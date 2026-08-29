import { Wrench } from "lucide-react"
import { Link } from "react-router-dom"

function Sozlamalar() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center font-extrabold">
      <Link 
      to="/admin/sozlamalar/maxsulotlar"
      className="flex justify-center gap-3 items-center border w-full p-3 rounded-2xl btn-shadow bg-green-500"
      ><Wrench />Maxsulotlar sozlash</Link>
      <Link className="flex justify-center gap-3 items-center border w-full p-3 rounded-2xl btn-shadow bg-amber-400"
      ><Wrench />Zaxira maxsulotlar</Link>
      <Link className="flex justify-center gap-3 items-center border w-full p-3 rounded-2xl btn-shadow bg-blue-500"
      ><Wrench /> Oylik maoshlari</Link>
      <div className="flex justify-center gap-3 items-center border w-full p-3 rounded-2xl btn-shadow bg-red-500">
        <button className="border w-full p-3 rounded-2xl btn-shadow bg-blue-500"><span className="text-xl mr-2">🇺🇿</span> uz</button>
        <button className="border w-full p-3 rounded-2xl btn-shadow bg-amber-400"><span className="text-xl mr-2">🇷🇺</span> ru</button>
        <button className="border w-full p-3 rounded-2xl btn-shadow bg-green-500"><span className="text-xl mr-2">🇬🇧</span> en</button>
      </div>
    </div>
  )
}

export default Sozlamalar