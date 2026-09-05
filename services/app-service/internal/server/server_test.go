package server

import (
	"bytes"
	"context"
	"fmt"
	"net"
	"net/http"
	"testing"
	"time"

	"setupmoney/services/app-service/internal/config"
	"setupmoney/services/app-service/internal/platform"
)

func testConfig() config.Config {
	return config.Config{
		Environment: "test",
		HTTP: config.HTTPConfig{
			Address:         "127.0.0.1:0",
			ShutdownTimeout: 2 * time.Second,
			ReadTimeout:     5 * time.Second,
			WriteTimeout:    5 * time.Second,
			IdleTimeout:     10 * time.Second,
			MaxHeaderBytes:  1 << 20,
		},
		Logging: config.LoggingConfig{
			Level:   "INFO",
			Format:  "text",
			Service: "setupmoney-test",
			Version: "test",
		},
	}
}

func TestNewServerConfig(t *testing.T) {
	cfg := testConfig()
	var logBuf bytes.Buffer
	logger := platform.NewLogger(cfg.Logging, &logBuf)
	clock := platform.NewFixedClock(time.Now())

	srv, err := New(cfg, logger, clock, nil)
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	if srv.HTTPServer().Addr != cfg.HTTP.Address {
		t.Errorf("Addr = %q, want %q", srv.HTTPServer().Addr, cfg.HTTP.Address)
	}
	if srv.HTTPServer().ReadTimeout != cfg.HTTP.ReadTimeout {
		t.Errorf("ReadTimeout = %v, want %v", srv.HTTPServer().ReadTimeout, cfg.HTTP.ReadTimeout)
	}
	if srv.HTTPServer().WriteTimeout != cfg.HTTP.WriteTimeout {
		t.Errorf("WriteTimeout = %v, want %v", srv.HTTPServer().WriteTimeout, cfg.HTTP.WriteTimeout)
	}
	if srv.HTTPServer().IdleTimeout != cfg.HTTP.IdleTimeout {
		t.Errorf("IdleTimeout = %v, want %v", srv.HTTPServer().IdleTimeout, cfg.HTTP.IdleTimeout)
	}
	if srv.HTTPServer().MaxHeaderBytes != cfg.HTTP.MaxHeaderBytes {
		t.Errorf("MaxHeaderBytes = %v, want %v", srv.HTTPServer().MaxHeaderBytes, cfg.HTTP.MaxHeaderBytes)
	}
}

func TestServerGracefulShutdown(t *testing.T) {
	cfg := testConfig()
	var logBuf bytes.Buffer
	logger := platform.NewLogger(cfg.Logging, &logBuf)
	clock := platform.NewFixedClock(time.Now())

	mux := http.NewServeMux()
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	srv, err := New(cfg, logger, clock, mux)
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	// Find an available port
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("net.Listen() error = %v", err)
	}
	port := listener.Addr().(*net.TCPAddr).Port
	listener.Close()

	srv.HTTPServer().Addr = fmt.Sprintf("127.0.0.1:%d", port)

	ctx, cancel := context.WithCancel(context.Background())

	errCh := make(chan error, 1)
	go func() {
		errCh <- srv.Serve(ctx)
	}()

	// Wait for server to start listening
	var resp *http.Response
	client := &http.Client{Timeout: 500 * time.Millisecond}
	for i := 0; i < 20; i++ {
		time.Sleep(20 * time.Millisecond)
		resp, err = client.Get(fmt.Sprintf("http://127.0.0.1:%d/ping", port))
		if err == nil {
			break
		}
	}
	if err != nil {
		t.Fatalf("failed to connect to server: %v", err)
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}

	// Trigger shutdown
	cancel()

	select {
	case err := <-errCh:
		if err != nil {
			t.Fatalf("Serve() returned unexpected error on shutdown: %v", err)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("Serve() did not shut down in time")
	}
}

func TestServerStartupError(t *testing.T) {
	cfg := testConfig()
	var logBuf bytes.Buffer
	logger := platform.NewLogger(cfg.Logging, &logBuf)
	clock := platform.NewFixedClock(time.Now())

	// Bind a port to force a port collision
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("net.Listen() error = %v", err)
	}
	defer listener.Close()

	port := listener.Addr().(*net.TCPAddr).Port
	cfg.HTTP.Address = fmt.Sprintf("127.0.0.1:%d", port)

	srv, err := New(cfg, logger, clock, nil)
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err = srv.Serve(ctx)
	if err == nil {
		t.Fatal("Serve() expected startup error on port collision, got nil")
	}
}

