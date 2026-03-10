package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"api-golang/database"
	"api-golang/router"
)

func main() {
	// Initialize DB
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to init DB: %v", err)
	}
	defer database.CloseDB()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	api := router.SetupRouter()

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: api,
	}

	// Start server
	go func() {
		log.Printf("Go API listening on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutdown signal received. Closing server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Shutdown error: %v", err)
	}

	log.Println("Server closed gracefully.")
}
