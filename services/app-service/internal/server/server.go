package server

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"setupmoney/services/app-service/internal/config"
	"setupmoney/services/app-service/internal/platform"
)

type Server struct {
	cfg        config.Config
	logger     *slog.Logger
	clock      platform.Clock
	httpServer *http.Server
}

func New(cfg config.Config, logger *slog.Logger, clock platform.Clock, handler http.Handler) (*Server, error) {
	if logger == nil {
		return nil, errors.New("logger cannot be nil")
	}
	if clock == nil {
		return nil, errors.New("clock cannot be nil")
	}
	if handler == nil {
		handler = http.NewServeMux()
	}

	httpServer := &http.Server{
		Addr:           cfg.HTTP.Address,
		Handler:        handler,
		ReadTimeout:    cfg.HTTP.ReadTimeout,
		WriteTimeout:   cfg.HTTP.WriteTimeout,
		IdleTimeout:    cfg.HTTP.IdleTimeout,
		MaxHeaderBytes: cfg.HTTP.MaxHeaderBytes,
	}

	return &Server{
		cfg:        cfg,
		logger:     logger,
		clock:      clock,
		httpServer: httpServer,
	}, nil
}

func (s *Server) HTTPServer() *http.Server {
	return s.httpServer
}

func (s *Server) Serve(ctx context.Context) error {
	shutdownComplete := make(chan error, 1)

	go func() {
		<-ctx.Done()
		s.logger.Info("shutting down HTTP server",
			slog.Duration("timeout", s.cfg.HTTP.ShutdownTimeout),
		)

		shutdownCtx, cancel := context.WithTimeout(context.Background(), s.cfg.HTTP.ShutdownTimeout)
		defer cancel()

		shutdownComplete <- s.httpServer.Shutdown(shutdownCtx)
	}()

	s.logger.Info("starting HTTP server",
		slog.String("address", s.httpServer.Addr),
		slog.String("env", s.cfg.Environment),
	)

	err := s.httpServer.ListenAndServe()
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		s.logger.Error("HTTP server failed", slog.String("error", err.Error()))
		return fmt.Errorf("HTTP server listen failed: %w", err)
	}

	shutdownErr := <-shutdownComplete
	if shutdownErr != nil {
		s.logger.Error("HTTP server shutdown error", slog.String("error", shutdownErr.Error()))
		return fmt.Errorf("HTTP server shutdown failed: %w", shutdownErr)
	}

	s.logger.Info("HTTP server stopped cleanly")
	return nil
}
