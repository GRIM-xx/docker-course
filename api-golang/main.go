package main

import (
	"api-golang/database"
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	// Load .env file if present
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ .env file not found, using system environment variables")
	}

	// Get DATABASE_URL from environment or file
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		databaseUrlFile := os.Getenv("DATABASE_URL_FILE")
		if databaseUrlFile != "" {
			content, err := os.ReadFile(databaseUrlFile)
			if err != nil {
				log.Fatalf("⛔ Error reading DATABASE_URL_FILE: %v\n", err)
			}
			databaseUrl = string(content)
		} else {
			log.Fatalf("⛔ DATABASE_URL is not set in environment variables or file\n")
		}
	}

	// Initialize Database
	if err := database.InitDB(databaseUrl); err != nil {
		log.Fatalf("⛔ Unable to connect to database: %v\n", err)
	}
	log.Println("✅ DATABASE CONNECTED 🥇")
}

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		now, err := database.GetTime(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch date and time"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"now": now, "api": "golang"})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	// Graceful Shutdown
	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	// Start server in a goroutine
	go func() {
		log.Println("🚀 Server running on port 8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("⛔ Server error: %v", err)
		}
	}()

	// Wait for termination signal (e.g., Docker/Kubernetes stops the container)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("⚠️ Shutting down server...")

	// Create a timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("⛔ Server shutdown error: %v", err)
	}

	log.Println("✅ Server stopped gracefully")
}
