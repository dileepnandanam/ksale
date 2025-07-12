package backend

import (
  "github.com/labstack/echo/v4"
  "ksale/backend/controllers"
)

func BindRoutes(r *echo.Echo) {
  r.Static("/assets", "frontend/dist/assets")

  r.GET("/api/jobs", controllers.JobList)
  r.GET("/api/jobs/search", controllers.JobSearch)
  r.GET("/api/jobs/prompt", controllers.JobPrompt)
  r.POST("/api/jobs", controllers.JobCreate)
  r.DELETE("/api/jobs/:id", controllers.JobDelete)
  r.PUT("/api/jobs/:id", controllers.JobUpdate)

  r.GET("/api/jobs/:job_id/job_tags", controllers.JobTagList)
  r.POST("/api/job_tags", controllers.JobTagCreate)
  r.DELETE("/api/job_tags/:id", controllers.JobTagDelete)
  r.PUT("/api/job_tags/:id", controllers.JobTagUpdate)
  r.PUT("/api/job_tags/:id/mark", controllers.JobTagMark)

  r.POST("/api/users", controllers.UserCreate)
  r.GET("/api/users", controllers.UserSearch)
  r.PUT("/api/users/:id/activate", controllers.UserActivate)
  r.PUT("/api/users/getotp", controllers.UserGetOtp)
  r.PUT("/api/users/login", controllers.UserLogin)
  r.PUT("/api/users/locate", controllers.UserLocate, CurrentUserMiddleware)
  r.GET("/api/users/current", controllers.UserGet, CurrentUserMiddleware)
  r.GET("/api/users/:id", controllers.GetUser, CurrentUserMiddleware)
  r.PUT("/api/users/:id", controllers.UpdateUser, CurrentUserMiddleware)

  r.File("/*", "frontend/dist/index.html")
}
