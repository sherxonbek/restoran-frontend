# 🍽️ Restoran Boshqaruv Tizimi (Frontend)

Ushbu loyiha restoran faoliyatini avtomatlashtirish, xodimlar (ofitsiantlar va administrator) ishini soddalashtirish hamda buyurtmalar va zallarni real-vaqt rejimida (real-time) boshqarish uchun mo'ljallangan veb-ilova.

---

## 🚀 Asosiy Imkoniyatlar

- **👨‍💼 Administrator Paneli:**
  - Xodimlar ro'yxati va boshqaruvi.
  - Xonalar va stollar tizimi (qo'shish, o'chirish, holatini kuzatish).
  - Mahsulotlar va menyuni boshqarish (kategoriya, narx, tahrirlash).
  - Restoran faoliyati bo'yicha tahliliy statistika.
- **🤵 Ofitsiant Paneli:**
  - Xona va stollar holatini ko'rish.
  - Buyurtma olish va savat shakllantirish.
  - Faol buyurtmalar ro'yxati va statuslarini yangilash.
- **⚡ Real-time Sinxronizatsiya:** Firebase Firestore orqali ma'lumotlar jonli rejimda barcha qurilmalarda yangilanadi.

---

## 🛠 Texnologiyalar Staki

- **Framework:** [React 19](https://react.dev/)
- **Build vositasi:** [Vite 8](https://vitejs.dev/)
- **Global State:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend / Real-time DB:** [Firebase Firestore](https://firebase.google.com/)
- **Ikonkalar:** [Lucide React](https://lucide.dev/)

---

## 📁 Fayllar Strukturasi Sxemasi

```text
restoran/frontend/
├── public/                 # Statik fayllar (rasmlar, ikonlar)
├── src/
│   ├── assets/             # Loyiha resurslari
│   ├── components/         # Qayta ishlatiluvchi UI komponentlar
│   │   ├── navigation/     # Navigatsiya va layoutlar (Navbar, MainLayout, OfitsiantLayout)
│   │   └── ui/             # Kichik UI elementlar (tugmalar, spinner, modal)
│   ├── hooks/              # Maxsus hooklar (useRealTimeData - jonli ma'lumotlar)
│   ├── pages/              # Asosiy sahifalar
│   │   ├── admin/          # Admin paneli sahifalari (Home, Xonalar, Stollar, Sozlamalar)
│   │   ├── ofitsiant/      # Ofitsiant interfeysi sahifalari (Home, Buyurtma olish)
│   │   └── auth/           # Tizimga kirish (Login)
│   ├── routes/             # Brauzer marshrutizatsiyasi (React Router)
│   │   └── index.jsx       # Markaziy yo'naltirish xaritasi
│   ├── services/           # Tashqi servislar integratsiyasi
│   │   └── firebase.js     # Firebase konfiguratsiyasi va DB ulanishi
│   ├── store/              # Redux Toolkit holat boshqaruvi
│   │   ├── slices/         # Alohida modul reducers (product, room, order, user)
│   │   └── index.js        # Markaziy Redux store
│   ├── utils/              # Yordamchi funksiyalar va formatlovchilar
│   ├── App.jsx             # Asosiy ilova qobig'i
│   ├── index.css           # Global uslublar
│   └── main.jsx            # Ilova kirish nuqtasi
├── .env                    # Muhit o'zgaruvchilari (Firebase kalitlari)
├── package.json            # Bog'liqliklar va skriptlar
└── vite.config.js          # Vite konfiguratsiyasi
```

---

## 💻 Loyihani Ishga Tushirish

### 1. Talablar
- [Node.js](https://nodejs.org/) (v18 yoki undan yuqori tavsiya etiladi)
- [npm](https://www.npmjs.com/) yoki [yarn](https://yarnpkg.com/)

### 2. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 3. Muhit o'zgaruvchilarini sozlash
Loyiha ildizida `.env` fayli mavjudligini va Firebase sozlamalari kiritilganligini tekshiring:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
...
```

### 4. Dasturni ishga tushirish (Development rejimi)
```bash
npm run dev
```
Brauzerda `http://localhost:5173` manzilini oching.

### 5. Loyihani ishlab chiqarish (Production) uchun yig'ish
```bash
npm run build
```
Yig'ilgan fayllar `dist/` papkasida hosil bo'ladi.
