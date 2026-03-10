package router

import (
	"api-golang/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		now, err := database.GetDateTime(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Internal Server Error",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"now": now,
			"api": "go",
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	return r
}
