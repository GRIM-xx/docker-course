package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var conn *pgxpool.Pool

// InitDB initializes the database connection pool
func InitDB(connString string) error {
	var err error
	conn, err = pgxpool.New(context.Background(), connString)
	if err != nil {
		return fmt.Errorf("failed to initialize database: %w", err)
	}

	// Test connection
	if err := conn.Ping(context.Background()); err != nil {
		return fmt.Errorf("database ping failed: %w", err)
	}

	log.Println("✅ Database connected successfully")
	return nil
}

// CloseDB closes the database connection pool
func CloseDB() {
	if conn != nil {
		conn.Close()
		log.Println("✅ Database connection closed")
	}
}

// GetTime fetches the current time from PostgreSQL
func GetTime(ctx context.Context) (time.Time, error) {
	if conn == nil {
		return time.Time{}, fmt.Errorf("database connection is not initialized")
	}

	var tm time.Time
	err := conn.QueryRow(ctx, "SELECT NOW()").Scan(&tm)
	if err != nil {
		return time.Time{}, fmt.Errorf("query failed: %w", err)
	}

	return tm, nil
}
