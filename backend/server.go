package main

import (
  "net/http"
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
  "github.com/labstack/echo/v4"
  "fmt"
  "ksale/backend/models"
)

func main() {
  dsn := "host=localhost user=root password=root@2008 dbname=ksale port=5432 sslmode=disable TimeZone=Asia/Kolkata"
  db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

  if (err != nil) {
    fmt.Println("dbc error %w", err)
  } else {
    fmt.Println("dbc success")
  }

  db.AutoMigrate(&models.User{})
  db.AutoMigrate(&models.Job{})
  db.AutoMigrate(&models.JobTag{})

  e := echo.New()
  e.GET("/", func(c echo.Context) error {
    return c.String(http.StatusOK, "Hello, World!")
  })

  e.Static("/", "frontend/dist")

  e.Logger.Fatal(e.Start(":3000"))
}
