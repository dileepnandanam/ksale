package models

import (
  "gorm.io/gorm"
  "time"
)

type User struct {
  gorm.Model
  ID              uint               `gorm:"primaryKey"`
  CountryCode     string             `gorm:"index"`
  Phone           uint               `gorm:"index"`
  Name            string             `gorm:"index"`
  OneTimePassword uint
  Activated       bool
  BearerToken     string
  CreatedAt       time.Time
  UpdatedAt       time.Time
  DeletedAt       gorm.DeletedAt      `gorm:"index"`
  Lat             float64             `gorm:"type:decimal(10,8)"`
  Lng             float64             `gorm:"type:decimal(11,8)"`
  Jobs            []Job               `gorm:"many2many:user_jobs"`
}

type UserJob struct {
  ID              uint                `gorm:"primaryKey"`
  UserId          *uint               `gorm:"index"`
  JobId           *uint               `gorm:"index"`
  User            User                `gorm:"foreignKey:UserId"`
  Job             Job                 `gorm:"foreignKey:JobId"`
  CreatedAt       time.Time           `gorm:"autoCreateTime:milli"`
  UpdatedAt       time.Time           `gorm:"autoUpdateTime:milli"`
}

type Job struct {
  gorm.Model
  ID           uint                `gorm:"primaryKey" json:"id"`
  Name         string              `gorm:"index" json:"name"`
  Tags         []JobTag
}

func (obj Job) CorrectTag(db *gorm.DB) JobTag {
  var tag JobTag;
  _ = db.Model(obj).Preload("Tags").Where("job_tags.correct = true").First(&tag)
  return tag
}

type JobTag struct {
  gorm.Model
  ID           uint                `gorm:"primaryKey" json:"id"`
  JobId        uint                `gorm:"index"`
  Job          Job                 `gorm:"foreignKey:JobId"`
  Tag          string              `gorm:"index" json:"tag"`
  Correct      bool                `json:"correct"`
}
