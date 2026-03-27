# Employee Training Records App

Ứng dụng quản lý hồ sơ đào tạo nội bộ dành cho bộ phận L&D/HR.

## Yêu cầu

- Node.js >= 20
- Backend API chạy tại `http://localhost:3000`

## Cài đặt & chạy local

```bash
npm install
npm run dev
```

Truy cập: http://localhost:5173

## Cấu hình API URL

Tạo file `.env.local` nếu backend chạy ở địa chỉ khác:

```
VITE_API_URL=http://your-backend-url
```

## Tài khoản admin mặc định

```
Email: admin@company.com
Password: Admin@123456
```

## Build production

```bash
npm run build
```

Output tại thư mục `dist/`.

## Deploy

Upload thư mục `dist/` lên bất kỳ static hosting nào (Nginx, Vercel, Netlify...).

Với Nginx, cần cấu hình redirect về `index.html` cho SPA:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Cấu trúc project

```
src/
├── api/          # Axios + API calls theo từng module
├── assets/       # CSS (Tailwind)
├── components/   # Reusable UI components
├── layouts/      # AdminLayout
├── router/       # Vue Router + auth guard
├── stores/       # Pinia stores (auth)
├── types/        # TypeScript interfaces
├── utils/        # format helpers, constants
└── views/        # Pages
```
