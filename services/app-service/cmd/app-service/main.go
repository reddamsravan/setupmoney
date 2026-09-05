package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"os/signal"
	"syscall"

	"setupmoney/services/app-service/internal/config"
	"setupmoney/services/app-service/internal/platform"
	"setupmoney/services/app-service/internal/server"
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	if err := run(ctx, os.LookupEnv, os.Stdout); err != nil {
		fmt.Fprintf(os.Stderr, "setupmoney fatal error: %v\n", err)
		os.Exit(1)
	}
}

func run(ctx context.Context, lookup config.LookupEnv, out io.Writer) error {
	cfg, err := config.Load(lookup)
	if err != nil {
		return fmt.Errorf("configuration error: %w", err)
	}

	if cfg.Logging.Service == "" {
		cfg.Logging.Service = serviceName()
	}

	logger := platform.NewLogger(cfg.Logging, out)
	clock := platform.RealClock{}

	srv, err := server.New(cfg, logger, clock, nil)
	if err != nil {
		return fmt.Errorf("server initialization error: %w", err)
	}

	return srv.Serve(ctx)
}

func serviceName() string {
	return "setupmoney"
}
