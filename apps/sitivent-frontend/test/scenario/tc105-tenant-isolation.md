# Test Case: Tenant Context Isolation (TC105)
Memastikan route admin selalu membawa tenant context dan tidak menghapus identifier tenant saat navigasi.

## Hasil yang Diharapkan
URL tenant tetap memiliki pola `/admin/{tenant_id}/...`.
