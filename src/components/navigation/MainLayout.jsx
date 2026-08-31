// src/components/navigation/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen w-full justify-between overflow-hidden">
      
      <Navbar />
      
      <main className="flex-1 overflow-y-auto md:p-6 lg:p-8 text-white">
        <Outlet />
      </main>
      
      <BottomNav />
      
    </div>
  )
}
