package main

import (
	"fmt"
	"net/http"
	"os"
	"time"
)

func main() {
	port := getEnv("PORT", "8080")
	url := fmt.Sprintf("http://localhost:%s/ping", port)

	client := http.Client{
		Timeout: 2 * time.Second,
	}

	resp, err := client.Get(url)
	if err != nil {
		fmt.Println("Healthcheck ERROR:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	fmt.Println("Healthcheck STATUS:", resp.StatusCode)

	if resp.StatusCode != http.StatusOK {
		os.Exit(1) // Ensure non-200 statuses also trigger failure
	}

	os.Exit(0)
}

// getEnv retrieves environment variables or returns a default value if not set
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
