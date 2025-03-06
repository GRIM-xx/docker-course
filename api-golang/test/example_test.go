package main

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockDatabase struct {
	mock.Mock
}

func (m *MockDatabase) GetTime(ctx context.Context) (time.Time, error) {
	args := m.Called(ctx)
	if args.Get(0) == nil {
		return time.Time{}, args.Error(1)
	}
	return args.Get(0).(time.Time), args.Error(1)
}

var mockDB *MockDatabase
var r *gin.Engine

func setupTest() {
	gin.SetMode(gin.TestMode)
	r = gin.Default()
	mockDB = new(MockDatabase)

	r.GET("/", func(c *gin.Context) {
		now, err := mockDB.GetTime(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch date and time"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"now": now.Format(time.RFC3339), "api": "golang"})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})
}

func TestMain(m *testing.M) {
	setupTest()
	m.Run()
}

func TestPingRoute(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"message": "pong"}`, w.Body.String())
}

func TestRootRoute(t *testing.T) {
	mockDB.On("GetTime", mock.Anything).Return(time.Date(2025, 2, 20, 12, 0, 0, 0, time.UTC), nil).Once()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"now": "2025-02-20T12:00:00Z", "api": "golang"}`, w.Body.String())
	mockDB.AssertExpectations(t)
}

func TestRootRouteError(t *testing.T) {
	mockDB.On("GetTime", mock.Anything).Return(time.Time{}, errors.New("database error")).Once()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"error": "Failed to fetch date and time"}`, w.Body.String())
	mockDB.AssertExpectations(t)
}
