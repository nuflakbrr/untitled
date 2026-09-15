package storage

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestLocalClientLifecycle(t *testing.T) {
	client, err := NewLocalClient(t.TempDir(), "http://localhost:8000/")
	if err != nil {
		t.Fatal(err)
	}
	info, err := client.Upload(context.Background(), &UploadInput{
		Reader: strings.NewReader("pdf"), ObjectPath: "certificates/event/cert.pdf", ContentType: "application/pdf",
	})
	if err != nil {
		t.Fatal(err)
	}
	if info.PublicURL != "http://localhost:8000/files/certificates/event/cert.pdf" || info.Size != 3 {
		t.Fatalf("unexpected file info: %+v", info)
	}
	if _, err := os.Stat(filepath.Join(client.RootDir(), "certificates", "event", "cert.pdf")); err != nil {
		t.Fatal(err)
	}
	if err := client.Delete(context.Background(), info.ObjectPath); err != nil {
		t.Fatal(err)
	}
	if err := client.Delete(context.Background(), info.ObjectPath); err != nil {
		t.Fatalf("Delete() must be idempotent: %v", err)
	}
}

func TestLocalClientRejectsEmptyPath(t *testing.T) {
	client, err := NewLocalClient(t.TempDir(), "http://localhost")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.Upload(context.Background(), &UploadInput{Reader: strings.NewReader("x")}); err == nil {
		t.Fatal("Upload() expected an empty path error")
	}
}
