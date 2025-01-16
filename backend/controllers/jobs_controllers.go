package controllers

import (
  "github.com/labstack/echo/v4"
  "net/http"
  "ksale/backend/models"
)

type JobSerializer struct {
  Name string `json:"name"`
  ID   uint   `json:"id"`
}

type JobHTTP struct {
  Name string `json:"name"`
  ID   uint   `json:"id" param:"id"`
}

func JobList(c echo.Context) error {
  var jobs []JobSerializer

  db.Model(&models.Job{}).Find(&jobs)

  return c.JSON(http.StatusOK, jobs)
}

func JobCreate(c echo.Context) error {
  params := new(JobHTTP)
  var existingJob models.Job
  c.Bind(params)

  result := db.Where(&models.Job{Name: params.Name}).First(&existingJob)

  if result.Error == nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "already_exist"})
  }

  newJob := models.Job{Name: params.Name}
  db.Create(&newJob)

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "job_created", "data": newJob })
}

func JobDelete(c echo.Context) error {
  params := new(JobHTTP)
  var existingJob models.Job
  c.Bind(params)

  result := db.Where(&models.Job{ID: params.ID}).First(&existingJob)

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "does_not_exist"})
  }

  result = db.Delete(&existingJob)

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "could_not_delete"})
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "job_deleted", "data": existingJob })
}

func JobUpdate(c echo.Context) error {
  params := new(JobHTTP)
  var existingJob models.Job
  c.Bind(params)

  result := db.Where(&models.Job{ID: params.ID}).First(&existingJob)

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "does_not_exist"})
  }

  result = db.Model(&existingJob).Updates(models.Job{Name: params.Name})

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "could_not_update"})
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "job_updated", "data": existingJob })
}