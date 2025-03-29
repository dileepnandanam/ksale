package backend

import (
  "gorm.io/gorm"
)

var db *gorm.DB

func SetDb(dbHandler *gorm.DB) {
  db = dbHandler
}
