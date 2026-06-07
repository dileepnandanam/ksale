package controllers

import (
  "github.com/labstack/echo/v4"
  "net/http"
  "ksale/backend/models"
  "fmt"
  "math/rand"
  crand "crypto/rand"
  "encoding/base32"
  "strconv"
  "time"
  "math"
)

type LocateHTTP struct {
  ID             uint    `json:"id" param:"id"`
  Lat            float64 `json:"lat"`
  Lng            float64 `json:"lng"`
}
type UserHTTP struct {
  Name           string `json:"name"`
  ID             uint   `json:"id" param:"id"`
  CountryCode    string `json:"country_code"`
  Phone          uint   `json:"phone"`
  JobIds         []uint `json:"job_ids"`
  OneTimePassword uint  `json:"otp"`
}

type UserSearchHTTP struct {
  Key string `query:"key"`
  Lat            string `query:"lat"`
  Lng            string `query:"lng"`
  Date           string `query:"date"`
  DateGiven      bool   `query:"date_given"`
}

func rangeIn(low, hi int) int {
  return low + rand.Intn(hi-low)
}

func srand() string {
  randomBytes := make([]byte, 32)
  _, err := crand.Read(randomBytes)
  if err != nil {
      panic(err)
  }
  return base32.StdEncoding.EncodeToString(randomBytes)[:50]
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

  newUser := models.User{Name: params.Name, CountryCode: params.CountryCode, Phone: params.Phone}
  newUser.OneTimePassword = uint(rangeIn(1000, 9999))
  db.Create(&newUser)

  var userJob models.UserJob

  for _, JobId := range params.JobIds {
    userJob.UserId = &newUser.ID
    userJob.JobId = &JobId
    db.Create(&userJob)
  } 

  fmt.Println("OTP")
  fmt.Println(newUser.OneTimePassword)
  sendOTP(newUser)
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

  if params.Phone == 0 {
    return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "phone_not_found"})
  }

  result := db.Where(&models.User{CountryCode: params.CountryCode, Phone: params.Phone}).First(&existingUser)

  if result.Error == nil {
  	existingUser.OneTimePassword = uint(rangeIn(1000, 9999))
  	db.Save(&existingUser)
  	fmt.Println("OTP")
  	fmt.Println(existingUser.OneTimePassword)
  	sendOTP(existingUser)
  	existingUser.OneTimePassword = 0
    return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "otp_generated", "data": map[string]interface{}{ "ID": existingUser.ID }})
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
    existingUser.BearerToken = srand()
    db.Save(&existingUser)
    return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "loged_in", "data": map[string]interface{}{ "ID": existingUser.ID, "token": existingUser.BearerToken, "name": existingUser.Name }})
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "invalid_otp"})
}

func UserGet(c echo.Context) error {
  token := c.Request().Header.Get("Authorization")
  userID := c.Request().Header.Get("X-User-ID")
  uID, _ := strconv.Atoi(userID)
  var existingUser models.User

  result := db.Where(&models.User{ID: uint(uID), BearerToken: token}).First(&existingUser)

  if result.Error == nil {
    return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "loged_in", "data": map[string]interface{}{ "ID": existingUser.ID, "token": existingUser.BearerToken, "name": existingUser.Name }})
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "invalid_user"})
}

func UserLocate(c echo.Context) error {
  params := new(LocateHTTP)

  c.Bind(params)

  existingUser := c.Get("currentUser").(models.User)

  result := db.Where(&models.User{ID: params.ID}).First(&existingUser)

  if result.Error == nil {
  	existingUser.Lat = params.Lat
    existingUser.LatBox = int(math.Trunc(params.Lat * 100))
  	existingUser.Lng = params.Lng
    existingUser.LngBox = int(math.Trunc(params.Lng * 100))
  	db.Save(&existingUser)
  	return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "located", "data": map[string]interface{}{ "ID": existingUser.ID } })
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "not_located"})
}


func UserActivate(c echo.Context) error {
  params := new(UserHTTP)
  var existingUser models.User
  c.Bind(params)

  result := db.Where(&models.User{ID: params.ID}).First(&existingUser)

  if result.Error == nil && existingUser.OneTimePassword == params.OneTimePassword {
    existingUser.Activated = true
    existingUser.BearerToken = srand()
    db.Save(&existingUser)
    return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "user_activated", "data": map[string]interface{}{ "ID": existingUser.ID, "token": existingUser.BearerToken, "name": existingUser.Name } })
  }
  return c.JSON(http.StatusOK, map[string]interface{}{"success": false, "message": "could_not_activate_user" })
}

func GetDates(c echo.Context) error {
  existingUser := c.Get("currentUser").(models.User)
  

  type UserWithDate struct {
    UserId          *uint
    Start           time.Time
    End             time.Time
  }

  var UsersWithDate []UserWithDate

  _ = db.Model(
    models.UserDate{},
  ).Where(
    "user_dates.user_id = ?", existingUser.ID,
  ).Select(
    "user_dates.start",
  ).Scan(&UsersWithDate)

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "dates_given", "data": map[string]interface{}{ "dates": UsersWithDate } })

}

func SetDate(c echo.Context) error {
  existingUser := c.Get("currentUser").(models.User)

  type DateHTTP struct {
    Start string `json:"start"`
    Busy bool  `json:"busy"`
  }
  params := new(DateHTTP)
  c.Bind(params)

  type UserWithDate struct {
    UserId          *uint
    Start           time.Time
    End             time.Time
  }

  var userDate models.UserDate

  if params.Busy {
    _ = db.Model(
      models.UserDate{},
    ).Where(
      "user_dates.user_id = ? AND Start = ?", existingUser.ID, params.Start,
    ).Select(
      "user_dates.start",
    ).Delete(&models.UserDate{})
  } else {
    userDate.UserId = &existingUser.ID
    parsedTime, _ := time.Parse(time.RFC3339, params.Start)
    userDate.Start = parsedTime
    db.Unscoped().Create(&userDate)
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "dates_given", "data": map[string]interface{}{ "dates": userDate } })

}


func GetUser(c echo.Context) error {
  existingUser := c.Get("currentUser").(models.User)
  

  type JobWithTag struct {
    Name string `json:"name"`
    Tags string `json:"tags"`
    ID   uint   `json:"id"`
  }

  var jobTags []JobWithTag

  _ = db.Model(
    models.JobTag{},
  ).Select(
    "job_tags.tag as name, job_tags.tag AS tags, job_tags.job_id as id",
  ).Joins(
    "inner join user_jobs on user_jobs.job_id = job_tags.job_id",
  ).Where(
    "user_jobs.user_id = ? and job_tags.correct = true", existingUser.ID,
  ).Scan(&jobTags)

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "found_user", "data": map[string]interface{}{ "ID": existingUser.ID, "token": existingUser.BearerToken, "name": existingUser.Name, "phone": existingUser.Phone, "country_code": existingUser.CountryCode, "jobs": jobTags } })

}

func UpdateUser(c echo.Context) error {
  params := new(UserHTTP)
  c.Bind(params)
  existingUser := c.Get("currentUser").(models.User)

  db.Unscoped().Where("user_id = ?", existingUser.ID).Delete(&models.UserJob{})
  
  var userJob models.UserJob
  for _, JobId := range params.JobIds {
    userJob = models.UserJob{}
    userJob.UserId = &existingUser.ID
    userJob.JobId = &JobId
    db.Unscoped().Create(&userJob)
  }

  db.Model(&existingUser).Updates(models.User{ Name: params.Name })

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "found_user", "data": map[string]interface{}{ "ID": existingUser.ID, "token": existingUser.BearerToken, "name": existingUser.Name, "phone": existingUser.Phone, "country_code": existingUser.CountryCode } })

}


func surroundingBoxes(lat, lon float64) [][]int {
  baseLat := int(math.Trunc(lat*100))
  baseLon := int(math.Trunc(lon*100))

  var latBoxes []int
  var lngBoxes []int

  for dLat := -1; dLat <= 1; dLat++ {
    for dLon := -1; dLon <= 1; dLon++ {
      latBoxes = append(latBoxes, baseLat + dLat)
      lngBoxes = append(lngBoxes, baseLon + dLon)
    }
  }
  var total [][]int
  total = append(total, latBoxes)
  total = append(total, lngBoxes)
  return total
}

func UserSearch(c echo.Context) error {
	params := new(UserSearchHTTP)
	c.Bind(params)

	type UserAndJob struct {
    Name        string  `json:"name"`
    Phone       uint    `json:"phone"`
    CountryCode string  `json:"country_code"`
    Tags        string  `json:"tags"`
    Distance    float64 `json:"distance"`
    Lat    float64 `json:"lat"`
    Lng    float64 `json:"lng"`
  }

  lat, _ := strconv.ParseFloat(params.Lat, 64)
  lng, _ := strconv.ParseFloat(params.Lng, 64)

  latLngBoxes := surroundingBoxes(lat, lng)

  var results []UserAndJob

  if params.Key == "" {
  	return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "searched", "data": nil })
  }

  distanceQuery := "distance(users.lat, users.lng," + params.Lat + "," + params.Lng + ")"
  order := distanceQuery + " ASC"

	scope := db.Model(&models.User{}).Select(
    "users.lat, users.lng, users.name, users.phone, users.country_code, array_to_string(ARRAY_REMOVE(ARRAY_AGG(DISTINCT correct_tag.tag), NULL), ', ') as tags, " + distanceQuery + " AS distance" ,
  ).Joins(
    "inner join user_jobs on user_jobs.user_id = users.id",
  ).Joins(
    "inner join job_tags on job_tags.job_id = user_jobs.job_id",
  ).Joins(
    "left join job_tags correct_tag on correct_tag.job_id = user_jobs.job_id and correct_tag.correct = true",
  )

  scope = scope.Where("users.lat_box in (?) AND users.lng_box in (?)", latLngBoxes[0], latLngBoxes[1])

  if params.DateGiven {
    scope = scope.Joins("left join user_dates on user_dates.user_id = users.id AND user_dates.start = ?", params.Date)
    scope = scope.Where("user_dates.id is NULL")
  }

  scope.Where(
    "users.lat > 0 AND users.activated = ? AND (job_tags.tag ILIKE ? OR job_tags.tag ILIKE ? OR job_tags.tag %> ?)", true, params.Key + "%", "% " + params.Key + "%", params.Key,
  ).Order(
  	order,
  ).Limit(30).Group("users.id, users.name, users.phone, users.country_code").Scan(&results)

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "searched", "data": results })
}