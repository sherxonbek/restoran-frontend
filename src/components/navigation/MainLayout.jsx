// src/components/navigation/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden text-white">
      {/* Kompyuter uchun chap tarafdagi Sidebar */}
      <Sidebar />

      {/* Asosiy kontent bloki */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto md:p-6 lg:p-8 text-white">
          <Outlet />
        </main>

        {/* Mobil uchun pastki navigatsiya */}
        <BottomNav />
      </div>
    </div>
  );
}
