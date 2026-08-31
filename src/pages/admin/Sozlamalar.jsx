import { Wrench } from "lucide-react"
import { Link } from "react-router-dom"

function Sozlamalar() {



  return (
    <>
      <div className="grid grid-cols-2 gap-4 justify-center items-center font-extrabold">
        <Link
          to="/admin/sozlamalar/maxsulotlar"
          className="flex justify-center gap-3 items-center border w-full p-3 rounded-2xl btn-shadow bg-green-500"
        ><Wrench />Maxsulotlar sozlash</Link>
        <Link className="flex justify-center gap-3 items-center border w-full p-3 rounded-2xl btn-shadow bg-amber-400"
        ><Wrench />Zaxira maxsulotlar</Link>
        <Link className="flex justify-center gap-3 items-center border w-full p-3 rounded-2xl btn-shadow bg-blue-500"
        ><Wrench /> Oylik maoshlari</Link>

      </div>
      <div className="flex justify-center border gap-3 mt-3 p-3 rounded-2xl btn-shadow bg-red-500">
        <h1 className="text-white font-extrabold text-lg">
          Dastur tilini tanlang
        </h1>
        <select name="" id="" className="bg-transparent text-green-500 font-extrabold text-lg outline-none">
          <option value="uz" className="bg-gray-800 text-white rounded-2xl ">🇺🇿 O'zbek</option>
          <option value="ru" className="bg-gray-800 text-white rounded-2xl ">🇷🇺 Русский</option>
          <option value="en" className="bg-gray-800 text-white rounded-2xl ">🇬🇧 English</option>
        </select>
      </div>
    </>

  )
}

export default Sozlamalar