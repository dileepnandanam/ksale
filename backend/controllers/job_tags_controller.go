package controllers

import (
  "github.com/labstack/echo/v4"
  "net/http"
  "ksale/backend/models"
  "fmt"
)

type JobTagSerializer struct {
  Tag string `json:"tag"`
  JobId uint `json:"job_id"`
  ID   uint   `json:"id"`
}

type JobTagHTTP struct {
  Tag string `json:"tag"`
  JobId uint `json:"job_id" param:"job_id"`
  ID   uint  `json:"id" param:"id"`
}

func JobTagList(c echo.Context) error {
  var jobs []JobTagSerializer
  params := new(JobTagHTTP)
  c.Bind(params)

  fmt.Println(params.JobId)
  db.Model(&models.JobTag{}).Where("job_id = ?", params.JobId).Find(&jobs)

  return c.JSON(http.StatusOK, jobs)
}

func JobTagCreate(c echo.Context) error {
  params := new(JobTagHTTP)
  var existingJobTag models.JobTag
  c.Bind(params)

  result := db.Where(&models.JobTag{Tag: params.Tag}).First(&existingJobTag)

  if result.Error == nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "already_exist"})
  }

  newJobTag := models.JobTag{Tag: params.Tag, JobId: params.JobId}
  db.Create(&newJobTag)

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "job_tag_created", "data": newJobTag })
}

func JobTagDelete(c echo.Context) error {
  params := new(JobTagHTTP)
  var existingJobTag models.JobTag
  c.Bind(params)

  result := db.Where(&models.JobTag{ID: params.ID}).First(&existingJobTag)

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "does_not_exist"})
  }

  result = db.Delete(&existingJobTag)

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "could_not_delete"})
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "job_tag_deleted", "data": existingJobTag })
}

func JobTagUpdate(c echo.Context) error {
  params := new(JobTagHTTP)
  var existingJobTag models.JobTag
  c.Bind(params)

  result := db.Where(&models.JobTag{ID: params.ID}).First(&existingJobTag)

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "does_not_exist"})
  }

  result = db.Model(&existingJobTag).Updates(models.JobTag{Tag: params.Tag})

  if result.Error != nil {
    return c.JSON(http.StatusUnprocessableEntity, map[string]interface{}{"success": false, "message": "could_not_update"})
  }

  return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "job_tag_updated", "data": existingJobTag })
}