package main

import (
	"fmt"
	"net/http"
	"os"
	"time"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	client := http.Client{
		Timeout: 2 * time.Second,
	}

	resp, err := client.Get("http://localhost:" + port + "/ping")
	if err != nil {
		fmt.Println("ERROR:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		fmt.Println("OK")
		os.Exit(0)
	}

	fmt.Println("STATUS:", resp.StatusCode)
	os.Exit(1)
}
