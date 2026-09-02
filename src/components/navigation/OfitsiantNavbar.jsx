import { Bell } from "lucide-react"

function OfitsiantNavbar() {
  return (
    <div className="flex w-full justify-between items-center p-4 px-6 bg-gray-900/50 btn-shadow text-white">
        <h1 className="text-xl font-bold">User</h1>
        <Bell color="#ffffff" size={32}/>
    </div>
  )
}

export default OfitsiantNavbar