package config

import "testing"

func TestDefaultCertificateStorageDriver(t *testing.T) {
	for _, test := range []struct {
		environment string
		want        string
	}{
		{environment: "development", want: "local"},
		{environment: "test", want: "local"},
		{environment: "production", want: "gcs"},
	} {
		t.Run(test.environment, func(t *testing.T) {
			if got := defaultCertificateStorageDriver(test.environment); got != test.want {
				t.Fatalf("defaultCertificateStorageDriver(%q) = %q, want %q", test.environment, got, test.want)
			}
		})
	}
}
