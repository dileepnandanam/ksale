package backend

import (
	"net/http"
	"ksale/backend/models"
	"github.com/labstack/echo/v4"
	"strconv"
)

type AuthHeaders struct {
	ID    string
	Token string
}

func CurrentUserMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Get token and user ID from headers
		token := c.Request().Header.Get("Authorization")
		userID := c.Request().Header.Get("X-User-ID")

		// Check if both token and ID are provided
		if token == "" || userID == "" {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Missing token or user ID",
				"error": "missing_token",
			})
		}

		uID, _ := strconv.Atoi(userID)

		var existingUser models.User
		result := db.Where(&models.User{ID: uint(uID), BearerToken: token}).First(&existingUser)

		if result.Error != nil || existingUser.ID == 0 {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Missing User",
				"error": "missing_user_for_user",
			})
		}

		// Add user to context
		c.Set("currentUser", existingUser)

		// Proceed to the next middleware/handler
		return next(c)
	}
}