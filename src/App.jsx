// src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BgImage from '/public/assets/bg-image.jpg'
import MainLayout from './components/navigation/MainLayout'
import Xodimlar from './pages/admin/Xodimlar'
import Statistika from './pages/admin/Statistika'
import Sozlamalar from './pages/admin/Sozlamalar'
import Xonalar from './pages/admin/Xonalar'
import Home from './pages/admin/Home'

function App() {
  return (
    <div style={{ backgroundImage: `url(${BgImage})` }} className="flex h-screen w-screen overflow-hidden bg-cover bg-center font-sans antialiased relative">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md z-0">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/admin/xodimlar" element={<Xodimlar />} />
              <Route path="/admin/xonalar" element={<Xonalar />} />
              <Route path="/admin/statistika" element={<Statistika />} />
              <Route path="/admin/sozlamalar" element={<Sozlamalar />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
