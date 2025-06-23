package backend

import (
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
  "github.com/labstack/echo/v4"
  "github.com/labstack/echo/v4/middleware"
  "fmt"
  "os"
  "ksale/backend/models"
  "ksale/backend/controllers"
)

func RunHTTPServer() {
  host := "host=" + os.Getenv("DB_HOST") + " "
  password := "password=" + os.Getenv("DB_PASSWORD") + " "
  dbname := "dbname=" + os.Getenv("DB_NAME") + " "
  port := "port=" + os.Getenv("DB_PORT") + " "
  user := "user=" + os.Getenv("DB_USER") + " "

  dsn := host + user + password + dbname + port + " sslmode=allow TimeZone=Asia/Kolkata"
  db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

  if (err != nil) {
    fmt.Println("dbc error %w", err)
  } else {
    fmt.Println("dbc success")
  }

  db.AutoMigrate(&models.User{})
  db.AutoMigrate(&models.Job{})
  db.AutoMigrate(&models.JobTag{})

  geo := `
    CREATE OR REPLACE FUNCTION distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT) RETURNS FLOAT AS $$
    DECLARE                                                   
        x float = 69.1 * (lat2 - lat1);                           
        y float = 69.1 * (lon2 - lon1) * cos(lat1 / 57.3);        
    BEGIN                                                     
        RETURN sqrt(x * x + y * y);                               
    END  
    $$ LANGUAGE plpgsql;
  `
  db.Exec(geo)

  controllers.SetDb(db)
  SetDb(db)

  e := echo.New()
  e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
    AllowOrigins: []string{"*"},
    AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, "Authorization", "X-User-ID"},
  }))
  BindRoutes(e)

  e.Logger.Fatal(e.Start(":3000"))
}
