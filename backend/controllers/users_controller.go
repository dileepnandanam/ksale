package controllers

import (
  "github.com/labstack/echo/v4"
  "net/http"
  "ksale/backend/models"
  "fmt"
  "math/rand"
)

type UserHTTP struct {
  Name           string `json:"name"`
  ID             uint   `json:"id" param:"id"`
  CountryCode    string `json:"country_code"`
  Phone          uint `json:"phone"`
  PrimaryJobId   *uint `json:"primary_job_id"`
  SecondaryJobId *uint `json:"secondary_job_id"`
  OneTimePassword uint `json:"otp"`
}

type UserSearchHTTP struct {
  Key string `query:"key"`
}

func rangeIn(low, hi int) int {
  return low + rand.Intn(hi-low)
}

func UserCreate(c echo.Context) error {
  params := new(UserHTTP)
  var existingUser models.User
  c.Bind(params)

  result := db.Where(&models.User{CountryCode: params.CountryCode, Phone: params.Phone}).First(&existingUser)

  if result.Error == nil && existingUser.Activated {
    return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "already_exist"})
  }

  if result.Error == nil && existingUser.Activated == false {
  	db.Delete(&models.User{}, existingUser.ID)
  }

  newUser := models.User{Name: params.Name, CountryCode: params.CountryCode, Phone: params.Phone, PrimaryJobId: params.PrimaryJobId, SecondaryJobId: params.SecondaryJobId}
  newUser.OneTimePassword = uint(rangeIn(1000, 9999))
  db.Create(&newUser)

  fmt.Println("OTP")
  fmt.Println(newUser.OneTimePassword)
  newUser.OneTimePassword = 0

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "user_created", "data": newUser })
}


type LoginHTTP struct {
  Phone          uint `json:"phone"`
  CountryCode   string `json:"country_code"`
  OneTimePassword uint `json:"otp"`
  ID              uint `json:"id"`

}

func UserGetOtp(c echo.Context) error {
  params := new(LoginHTTP)
  var existingUser models.User
  c.Bind(params)

  result := db.Where(&models.User{CountryCode: params.CountryCode, Phone: params.Phone}).First(&existingUser)

  if result.Error == nil {
  	existingUser.OneTimePassword = uint(rangeIn(1000, 9999))
  	db.Save(&existingUser)
  	fmt.Println("OTP")
  	fmt.Println(existingUser.OneTimePassword)
  	existingUser.OneTimePassword = 0
    return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "otp_generated", "data": existingUser})
  }
  return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "phone_not_found"})
}

func UserLogin(c echo.Context) error {
  params := new(LoginHTTP)
  var existingUser models.User
  c.Bind(params)

  result := db.Where(&models.User{ID: params.ID}).First(&existingUser)

  if result.Error == nil && existingUser.OneTimePassword == params.OneTimePassword {
  	existingUser.OneTimePassword = 0
  	existingUser.Activated = true
  	db.Save(&existingUser)
  	return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "loged_in", "data": existingUser})
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "invalid_otp"})
}


func UserActivate(c echo.Context) error {
  params := new(UserHTTP)
  var existingUser models.User
  c.Bind(params)

  result := db.Where(&models.User{ID: params.ID}).First(&existingUser)

  if result.Error == nil && existingUser.OneTimePassword == params.OneTimePassword {
  	existingUser.Activated = true
  	db.Save(&existingUser)
  	return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "user_activated", "data": existingUser })
  }
  return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "could_not_activate_user" })
}

func UserSearch(c echo.Context) error {
	params := new(UserSearchHTTP)
	c.Bind(params)

	type UserAndJob struct {
    Name        string `json:"name"`
    Phone       uint   `json:"phone"`
    CountryCode string `json:"country_code"`
    Tags        string `json:"tags"`
  }

  var results []UserAndJob

  if params.Key == "" {
  	return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "searched", "data": nil })
  }


	db.Model(&models.User{}).Select(
    "users.name, users.phone, users.country_code, array_to_string(ARRAY_REMOVE(ARRAY_AGG(DISTINCT correct_tag.tag), NULL), ', ') as tags",
  ).Joins(
    "inner join jobs on jobs.id = users.primary_job_id OR jobs.id = users.secondary_job_id",
  ).Joins(
    "inner join job_tags on job_tags.job_id = jobs.id",
  ).Joins(
    "left join job_tags correct_tag on correct_tag.job_id = jobs.id and correct_tag.correct = true",
  ).Where(
    "users.activated = ? AND (job_tags.tag ILIKE ? OR job_tags.tag ILIKE ?)", true, params.Key + "%", "% " + params.Key + "%",
  ).Group("users.id, users.name, users.phone, users.country_code").Scan(&results)

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "searched", "data": results })
}