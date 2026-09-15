package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type LocalClient struct {
	rootDir       string
	publicBaseURL string
}

func NewLocalClient(rootDir, publicBaseURL string) (*LocalClient, error) {
	root, err := filepath.Abs(rootDir)
	if err != nil {
		return nil, fmt.Errorf("resolve local storage directory: %w", err)
	}
	if err := os.MkdirAll(root, 0o750); err != nil {
		return nil, fmt.Errorf("create local storage directory: %w", err)
	}
	return &LocalClient{rootDir: root, publicBaseURL: strings.TrimRight(publicBaseURL, "/")}, nil
}

func (l *LocalClient) Upload(ctx context.Context, input *UploadInput) (*FileInfo, error) {
	if input == nil || input.Reader == nil {
		return nil, fmt.Errorf("upload input and reader are required")
	}
	fullPath, objectPath, err := l.resolve(input.ObjectPath)
	if err != nil {
		return nil, err
	}
	if err := os.MkdirAll(filepath.Dir(fullPath), 0o750); err != nil {
		return nil, fmt.Errorf("create object directory: %w", err)
	}
	file, err := os.Create(fullPath)
	if err != nil {
		return nil, fmt.Errorf("create local object: %w", err)
	}
	written, copyErr := copyWithContext(ctx, file, input.Reader)
	closeErr := file.Close()
	if copyErr != nil {
		_ = os.Remove(fullPath)
		return nil, fmt.Errorf("write local object: %w", copyErr)
	}
	if closeErr != nil {
		_ = os.Remove(fullPath)
		return nil, fmt.Errorf("close local object: %w", closeErr)
	}
	return &FileInfo{ObjectPath: objectPath, PublicURL: l.PublicURL(objectPath), Size: written}, nil
}

func (l *LocalClient) Delete(_ context.Context, objectPath string) error {
	fullPath, _, err := l.resolve(objectPath)
	if err != nil {
		return err
	}
	if err := os.Remove(fullPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("delete local object: %w", err)
	}
	return nil
}

func (l *LocalClient) SignedURL(_ context.Context, objectPath string, _ time.Duration) (string, error) {
	if _, _, err := l.resolve(objectPath); err != nil {
		return "", err
	}
	return l.PublicURL(objectPath), nil
}

func (l *LocalClient) PublicURL(objectPath string) string {
	clean := filepath.ToSlash(filepath.Clean(objectPath))
	return l.publicBaseURL + "/files/" + strings.TrimLeft(clean, "/")
}

func (l *LocalClient) RootDir() string { return l.rootDir }

func (l *LocalClient) resolve(objectPath string) (string, string, error) {
	clean := strings.TrimPrefix(filepath.Clean("/"+objectPath), string(filepath.Separator))
	if clean == "" || clean == "." {
		return "", "", fmt.Errorf("object path is required")
	}
	return filepath.Join(l.rootDir, clean), filepath.ToSlash(clean), nil
}

func copyWithContext(ctx context.Context, dst io.Writer, src io.Reader) (int64, error) {
	buffer := make([]byte, 32*1024)
	var written int64
	for {
		if err := ctx.Err(); err != nil {
			return written, err
		}
		n, readErr := src.Read(buffer)
		if n > 0 {
			count, writeErr := dst.Write(buffer[:n])
			written += int64(count)
			if writeErr != nil {
				return written, writeErr
			}
			if count != n {
				return written, io.ErrShortWrite
			}
		}
		if readErr != nil {
			if readErr == io.EOF {
				return written, nil
			}
			return written, readErr
		}
	}
}
