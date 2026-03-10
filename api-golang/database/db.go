package database

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

// Initializes the PostgreSQL connection pool
func InitDB() error {
	dsn, err := loadDatabaseURL()
	if err != nil {
		return err
	}

	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		return fmt.Errorf("failed to create connection pool: %w", err)
	}

	DB = pool
	return nil
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}

// Supports DATABASE_URL or DATABASE_URL_FILE for secrets
func loadDatabaseURL() (string, error) {
	if url := os.Getenv("DATABASE_URL"); url != "" {
		return strings.TrimSpace(url), nil
	}

	if path := os.Getenv("DATABASE_URL_FILE"); path != "" {
		data, err := os.ReadFile(path)
		if err != nil {
			return "", fmt.Errorf("failed to read DATABASE_URL_FILE: %w", err)
		}
		return strings.TrimSpace(string(data)), nil
	}

	return "", errors.New("DATABASE_URL or DATABASE_URL_FILE must be set")
}

// Returns current timestamp from PostgreSQL
var GetDateTime = func(ctx context.Context) (string, error) {
    var now time.Time

    err := DB.QueryRow(ctx, "SELECT NOW()").Scan(&now)
    if err != nil {
        fmt.Println("DB ERROR:", err)
        return "", err
    }

    return now.Format(time.RFC3339), nil
}

