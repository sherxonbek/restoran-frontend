import { Grip, House, Landmark } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Home() {

  const navigate = useNavigate()

  return (
    <div>
      <div className="flex flex-col gap-2 p-2">
        <div>
          <div className="flex items-center gap-2 bg-blue-700 btn-shadow max-w-max px-4 py-2 rounded-md">
            <House size={32} className="text-white" />
            <h1 className="text-lg font-bold text-white">Xonalar</h1>
          </div>
          <div className="grid grid-cols-3 mt-4 ml-2 gap-4">
            <div
              onClick={() => navigate(`/ofitsiant/xona/1`)}
              className="flex flex-col border items-center p-5 rounded-xl btn-shadow border-l-4"
            >
              <House size={32} className="text-white" />
              <h1 className="text-lg font-bold text-white">Xona 1</h1>
            </div>
            <div className="flex flex-col border items-center p-5 rounded-xl btn-shadow border-l-4">
              <House size={32} className="text-white" />
              <h1 className="text-lg font-bold text-white">Xona 2</h1>
            </div>
            <div className="flex flex-col border items-center p-5 rounded-xl btn-shadow border-l-4">
              <House size={32} className="text-white" />
              <h1 className="text-lg font-bold text-white">Xona 3</h1>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 bg-blue-700 btn-shadow max-w-max px-4 py-2 rounded-md">
            <Landmark size={32} className="text-white" />
            <h1 className="text-lg font-bold text-white">Zallar</h1>
          </div>
          <div className="grid grid-cols-3 mt-4 ml-2 gap-4">
            <div className="flex flex-col border items-center p-5 rounded-xl btn-shadow border-l-4">
              <Landmark size={32} className="text-white" />
              <h1 className="text-lg font-bold text-white">Zal 1</h1>
            </div>
            <div className="flex flex-col border items-center p-5 rounded-xl btn-shadow border-l-4">
              <Landmark size={32} className="text-white" />
              <h1 className="text-lg font-bold text-white">Zal 2</h1>
            </div>
            <div className="flex flex-col border items-center p-5 rounded-xl btn-shadow border-l-4">
              <Landmark size={32} className="text-white" />
              <h1 className="text-lg font-bold text-white">Zal 3</h1>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 bg-blue-700 btn-shadow max-w-max px-4 py-2 rounded-md">
            <Grip size={32} className="text-white" />
            <h1 className="text-lg font-bold text-white">Boshqalar</h1>
          </div>
          <div className="grid grid-cols-3 mt-4 ml-2 gap-4">
            <div className="flex flex-col border items-center py-5 rounded-xl btn-shadow border-l-4">
              <Grip size={32} className="text-white" />
              <h1 className="text-lg font-bold text-white">Boshqa 1</h1>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Home