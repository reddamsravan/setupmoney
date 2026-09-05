package platform

import "time"

// Clock provides an interface for time retrieval to support deterministic testing.
type Clock interface {
	Now() time.Time
}

// RealClock returns the current system time.
type RealClock struct{}

// Now returns time.Now().
func (RealClock) Now() time.Time {
	return time.Now()
}

// FixedClock returns a constant time for testing.
type FixedClock struct {
	time time.Time
}

// NewFixedClock creates a FixedClock set to t.
func NewFixedClock(t time.Time) FixedClock {
	return FixedClock{time: t}
}

// Now returns the fixed time.
func (f FixedClock) Now() time.Time {
	return f.time
}
