# Frontend Feature: Manajemen & Pemrosesan Media - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Media Upload & Image Cropper UI  
> **Stack**: Next.js 16 + React Advanced Cropper + Material UI v9

---

## 1. Komponen Pemotong Gambar (Image Cropper Modal)

- Memungkinkan pengguna memotong gambar sebelum diunggah:
  - Rasio 16:9 untuk Banner Event dan Cover Artikel.
  - Rasio 1:1 untuk Foto Profil dan Avatar Narasumber.
- Mengubah canvas hasil crop menjadi Blob/File untuk dikirim ke endpoint `POST /features/v1/uploads`.

---

## 2. Preview & Lightbox

- Pratinjau instan gambar sebelum disimpan ke form.
- Lightbox fullscreen untuk melihat detail berkas resolusi penuh.
