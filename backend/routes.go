package backend

import (
  "github.com/labstack/echo/v4"
  "ksale/backend/controllers"
)

func BindRoutes(r *echo.Echo) {
  r.Static("/assets", "frontend/dist/assets")

  r.GET("/api/jobs", controllers.JobList)
  r.POST("/api/jobs", controllers.JobCreate)
  r.DELETE("/api/jobs/:id", controllers.JobDelete)
  r.PUT("/api/jobs/:id", controllers.JobUpdate)

  r.GET("/api/jobs/:job_id/job_tags", controllers.JobTagList)
  r.POST("/api/job_tags", controllers.JobTagCreate)
  r.DELETE("/api/job_tags/:id", controllers.JobTagDelete)
  r.PUT("/api/job_tags/:id", controllers.JobTagUpdate)

  r.File("/*", "frontend/dist/index.html")
}
