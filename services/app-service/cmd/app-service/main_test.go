package main

import (
	"bytes"
	"context"
	"fmt"
	"net"
	"strings"
	"testing"
	"time"
)

func TestServiceName(t *testing.T) {
	if got := serviceName(); got != "setupmoney" {
		t.Fatalf("serviceName() = %q, want %q", got, "setupmoney")
	}
}

func TestRun_InvalidConfig(t *testing.T) {
	var out bytes.Buffer
	lookup := func(key string) (string, bool) {
		if key == "SETUPMONEY_ENV" {
			return "invalid_env", true
		}
		return "", false
	}

	err := run(context.Background(), lookup, &out)
	if err == nil {
		t.Fatal("run() expected error for invalid config, got nil")
	}
	if !strings.Contains(err.Error(), "configuration error") {
		t.Fatalf("unexpected error message: %v", err)
	}
}

func TestRun_GracefulShutdown(t *testing.T) {
	var out bytes.Buffer

	// Find an available port
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("net.Listen() error = %v", err)
	}
	port := listener.Addr().(*net.TCPAddr).Port
	listener.Close()

	lookup := func(key string) (string, bool) {
		switch key {
		case "SETUPMONEY_HTTP_ADDRESS":
			return fmt.Sprintf("127.0.0.1:%d", port), true
		case "SETUPMONEY_HTTP_SHUTDOWN_TIMEOUT":
			return "1s", true
		default:
			return "", false
		}
	}

	ctx, cancel := context.WithCancel(context.Background())

	errCh := make(chan error, 1)
	go func() {
		errCh <- run(ctx, lookup, &out)
	}()

	// Wait briefly for server startup
	time.Sleep(50 * time.Millisecond)

	// Trigger shutdown
	cancel()

	select {
	case err := <-errCh:
		if err != nil {
			t.Fatalf("run() returned error on shutdown: %v", err)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("run() did not shut down in time")
	}

	output := out.String()
	if !strings.Contains(output, "starting HTTP server") {
		t.Fatalf("output missing startup log: %q", output)
	}
	if !strings.Contains(output, "shutting down HTTP server") {
		t.Fatalf("output missing shutdown log: %q", output)
	}
}

func TestRun_ReturnedStartupError(t *testing.T) {
	var out bytes.Buffer

	// Bind a port to force a port collision
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("net.Listen() error = %v", err)
	}
	defer listener.Close()

	port := listener.Addr().(*net.TCPAddr).Port
	lookup := func(key string) (string, bool) {
		if key == "SETUPMONEY_HTTP_ADDRESS" {
			return fmt.Sprintf("127.0.0.1:%d", port), true
		}
		return "", false
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err = run(ctx, lookup, &out)
	if err == nil {
		t.Fatal("run() expected startup error on port collision, got nil")
	}
}

