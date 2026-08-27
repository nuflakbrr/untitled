# Shared Packages

Folder ini digunakan untuk meletakkan shared modules / contracts di antara frontend dan backend, contohnya:

- `api-spec`: OpenAPI / Swagger schema atau Protocol Buffers (gRPC)
- `shared-types`: TypeScript definitions yang di-generate dari Go / OpenAPI schema
- `ui`: Shared UI component library jika nanti frontend dipecah menjadi multiple apps (misal: `apps/web` dan `apps/admin`)
- `eslint-config` / `typescript-config`: Konfigurasi linter / compiler bersama
