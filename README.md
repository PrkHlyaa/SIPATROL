# SIPATROL 🛡️

**Sistem Informasi Patroli** — Aplikasi web untuk manajemen dan monitoring kegiatan patroli secara real-time.

> Tugas Akhir Semester (EAS) — Mata Kuliah Aplikasi 2  
> Politeknik Negeri Bandung

---

## 📋 Deskripsi

SIPATROL adalah aplikasi berbasis web yang membantu pengelolaan patroli keamanan, meliputi:

- **Dashboard Admin** — Monitoring sesi patroli, statistik kepatuhan, dan aktivitas terbaru.
- **Manajemen Sesi** — Penjadwalan dan pengelolaan sesi patroli harian.
- **Manajemen Titik Patroli** — Konfigurasi titik-titik yang harus dikunjungi petugas.
- **Peta Interaktif** — Visualisasi lokasi titik patroli secara geografis.
- **Riwayat Patroli** — Log lengkap seluruh aktivitas check-in petugas.
- **Check-in Petugas** — Petugas dapat melakukan check-in via QR code dan kamera.

---

## 🚀 Tech Stack

| Teknologi | Keterangan |
|---|---|
| [React 19](https://react.dev/) | UI Library |
| [TanStack Start](https://tanstack.com/start) | Full-stack framework (SSR + Routing) |
| [TanStack Router](https://tanstack.com/router) | File-based routing |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) | Komponen UI |
| [Recharts](https://recharts.org/) | Grafik & visualisasi data |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form & validasi |
| [Vite](https://vite.dev/) | Build tool |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

---

## 📁 Struktur Proyek

```
SIPATROL/
├── src/
│   ├── routes/          # Halaman (file-based routing)
│   │   ├── index.tsx        # Halaman petugas (check-in)
│   │   ├── admin.tsx        # Layout admin
│   │   ├── admin.index.tsx  # Dashboard admin
│   │   ├── admin.sesi.tsx   # Manajemen sesi patroli
│   │   ├── admin.titik.tsx  # Manajemen titik patroli
│   │   ├── admin.peta.tsx   # Peta titik patroli
│   │   └── admin.riwayat.tsx# Riwayat & log patroli
│   ├── components/      # Komponen UI reusable
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility, store, helpers
│   ├── styles.css       # Global styles
│   └── server.ts        # Server entry point
├── dist/                # Hasil build (production)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚙️ Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) v18+ atau [Bun](https://bun.sh/)
- npm / bun

### Instalasi

```bash
# Clone repository
git clone <url-repository>
cd SIPATROL

# Install dependencies
npm install
# atau pakai bun
bun install
```

### Development

```bash
npm run dev
# atau
bun run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

---

## 📄 Skrip yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run build:dev` | Build mode development |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Cek kode dengan ESLint |
| `npm run format` | Format kode dengan Prettier |

---

## 👥 Kontributor

- **Nobby** — Politeknik Negeri Bandung, Semester 6
