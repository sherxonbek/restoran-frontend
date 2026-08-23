import { AddBtn } from "@/components/ui/AddButton"
import { useState } from "react"
import { User, Phone, Briefcase, Trash2 } from "lucide-react"
import { formatUzbekPhoneNumber } from "@/utils/formatters"

function Xodimlar() {
  const [isAdding, setIsAdding] = useState(false)
  const [employees, setEmployees] = useState([
    { id: 1, name: "Ali Alimov", phone: "+998 (90) 123-45-67", position: "oshpaz" }
  ])

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    phone: "+998 ",
    position: ""
  })

  const date = new Date()

  const handlePhoneChange = (e) => {
    const formatted = formatUzbekPhoneNumber(e.target.value, employeeForm.phone)
    setEmployeeForm({ ...employeeForm, phone: formatted })
  }

  const handleSave = () => {
    if (!employeeForm.name || employeeForm.phone.length < 19 || !employeeForm.position) {
      alert("Iltimos, barcha maydonlarni to'liq to'ldiring!")
      return
    }

    setEmployees([{ id: date.now(), ...employeeForm }, ...employees])
    handleClose()
  }

  const handleClose = () => {
    setEmployeeForm({ name: "", phone: "+998 ", position: "" })
    setIsAdding(false)
  }

  const inputClass = "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"

  return (
    <div className="relative flex flex-col w-full h-full p-5 overflow-y-auto text-white">

      {isAdding && (
        <div
          onClick={() => setIsAdding(false)}
          className="fixed inset-0 bg-slate-700/60 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        />
      )}

      <AddBtn onClick={() => setIsAdding(!isAdding)} />

      {isAdding && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-950 p-6 rounded-2xl shadow-2xl z-50 flex flex-col gap-3 text-white w-[320px] border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-base font-bold text-indigo-400">Yangi xodim qo'shish</h2>
            <h1 className="font-bold text-slate-400 hover:text-red-400 cursor-pointer p-1" onClick={handleClose}>✕</h1>
          </div>

          <select
            value={employeeForm.position}
            onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
            className={inputClass}
          >
            <option value="">Xodim lavozimi</option>
            <option value="oshpaz">Oshpaz</option>
            <option value="ofitsiant">Ofitsiant</option>
            <option value="administrator">Administrator</option>
          </select>

          <input
            type="text"
            value={employeeForm.name}
            onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
            placeholder="Xodim ismi"
            className={inputClass}
          />

          <input
            type="text"
            value={employeeForm.phone}
            onChange={handlePhoneChange}
            placeholder="+998 (90) 123-45-67"
            className={`${inputClass} font-mono`}
          />

          <button
            onClick={handleSave}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20"
          >
            Saqlash
          </button>
        </div>
      )}

      {/* Xodimlar ro'yxati */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {employees.map((emp) => (
          <div key={emp.id} className="p-4 border border-slate-800 bg-slate-900/40 rounded-2xl flex justify-between items-center backdrop-blur-sm shadow-md hover:border-slate-700 transition-colors">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <User size={16} className="text-indigo-400" />
                <h3 className="font-bold text-slate-100">{emp.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Briefcase size={14} /> <span className="capitalize">{emp.position}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone size={14} /> <span className="font-mono">{emp.phone}</span>
              </div>
            </div>
            <button
              onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))}
              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Xodimlar
