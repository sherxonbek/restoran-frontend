import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"

function OfitsiantNavbar() {

const navigator = useNavigate()

  return (
    <div className="flex w-full justify-between items-center p-4 px-6 bg-gray-900/50 btn-shadow text-white">
        <h1 className="text-xl font-bold">User</h1>
        <Bell color="#ffffff" size={32} 
          onClick={() => navigator("/ofitsiant/buyurtmalar")}
        />
    </div>
  )
}

export default OfitsiantNavbar