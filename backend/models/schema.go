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
  PrimaryJobId    *uint               `gorm:"index"`
  SecondaryJobId  *uint               `gorm:"index"`
  PrimaryJob      Job                 `gorm:"foreignKey:PrimaryJobId"`
  SecondaryJob    Job                 `gorm:"foreignKey:SecondaryJobId" gorm:"default:null"`
}

type Job struct {
  gorm.Model
  ID           uint                `gorm:"primaryKey" json:"id"`
  Name         string              `gorm:"index" json:"name"`
}

type JobTag struct {
  gorm.Model
  ID           uint                `gorm:"primaryKey" json:"id"`
  JobId        uint                `gorm:"index"`
  Job          Job                 `gorm:"foreignKey:JobId"`
  Tag          string              `gorm:"index" json:"tag"`
  Correct      bool                `json:"correct"`
}
