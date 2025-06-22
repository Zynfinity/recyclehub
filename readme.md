
# Recycle Hub

Aplikasi ini adalah sebuah platform ecommerce untuk UMKM atau perusahaan lain yang dirancang untuk memfasilitasi transaksi jual beli berbagai jenis material bekas serta daur ulang. Dengan fokus pada ekonomi sirkular dan keberlanjutan, aplikasi ini menjembatani konsumen dengan UMKM.


## Tech Stack

**Client :** NextJs, ChakraUi V2, tailwindcss

**Server:** Supabase (BaaS)



## Tutorial Membuat Supabase dan Mendapatkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

Supabase adalah platform open-source yang menyediakan backend-as-a-service dengan fitur seperti database SQL, autentikasi pengguna, penyimpanan file, dan banyak lagi. Dalam tutorial ini, kita akan membahas cara membuat akun Supabase dan mendapatkan dua kunci penting: `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.

### Langkah 1: Membuat Akun Supabase

    1. Buka [website Supabase](https://supabase.io/) dan klik tombol Get Started atau Start your project.
    2. Jika Anda belum memiliki akun, Anda akan diminta untuk mendaftar. Anda bisa mendaftar menggunakan email atau akun GitHub.
    3. Setelah berhasil mendaftar dan login, Anda akan diarahkan ke halaman dashboard Supabase.

### Langkah 2: Membuat Proyek Baru

    1. Di dashboard Supabase, klik tombol New Project.
    2. Isikan informasi untuk proyek baru Anda:
        - Project Name: Nama proyek Anda (misalnya: `my-supabase-project`).
        - Password: Pilih password yang kuat, ini akan digunakan untuk mengakses database PostgreSQL Anda.
        - Region: Pilih region terdekat dengan lokasi Anda untuk mengoptimalkan kinerja aplikasi Anda.
    3. Klik tombol Create new project. Proses ini akan memakan waktu beberapa detik hingga proyek Anda selesai dibuat.

### Langkah 3: Mengambil `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

Setelah proyek berhasil dibuat, Anda perlu mendapatkan dua informasi penting untuk menghubungkan aplikasi Anda ke Supabase:

#### 1. Mendapatkan `SUPABASE_URL`:
    1. Di halaman proyek, klik Settings pada panel sebelah kiri.
    2. Pilih API.
    3. Di bagian Project API settings, Anda akan melihat `SUPABASE_URL`. Salin URL ini karena Anda akan menggunakannya untuk menghubungkan aplikasi ke Supabase.

#### 2. Mendapatkan `SUPABASE_ANON_KEY`:
    1. Masih di halaman yang sama (API settings), Anda akan menemukan anon public key.
    2. Salin anon key ini. Kunci ini digunakan untuk autentikasi aplikasi Anda untuk mengakses data publik di Supabase.

### Langkah 4: Menggunakan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

Setelah Anda mendapatkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`, Anda bisa menambahkannya ke dalam aplikasi Anda. Misalnya, Anda bisa menambahkannya ke dalam file `.env`.

## Features

- Autentikasi (OAuth Google)
- Admin
    - Manejemen Produk ( Add, Update, Edit, Delete )
    - Manajemen Pengguna ( Edit Role )
    - Manajemen Kategori ( Add, Update, Edit, Delete )
- Non - Admin
    - Keranjang Kuning
    - CheckOut Barang


## Environment Variables

Untuk menjalankan proyek ini, Anda perlu menambahkan variabel berikut ke file .env Anda

`NEXT_PUBLIC_SUPABASE_URL=`

`NEXT_PUBLIC_SUPABASE_ANON_KEY=`


## Ai Support Explanation
Dalam proyek ini, IBM Granite memainkan peran yang sangat penting dalam mendukung proses pengembangan. IBM Granite, sebagai platform yang kaya akan fitur dan kemudahan penggunaan, sangat membantu dalam berbagai aspek pengembangan aplikasi. Salah satu fitur utama yang dimanfaatkan adalah Code Generator, yang memungkinkan tim pengembang untuk dengan cepat menghasilkan kode-kode yang dibutuhkan tanpa harus menulisnya secara manual. Fitur ini tidak hanya menghemat waktu tetapi juga meningkatkan konsistensi kode di seluruh proyek, mengurangi kemungkinan kesalahan manusia, dan mempercepat fase pengembangan.

## Aplikasi Ini Masih dalam tahap pengembangan
beberapa fitur belum tersedia 