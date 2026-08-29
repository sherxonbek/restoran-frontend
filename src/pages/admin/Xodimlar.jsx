import { AddBtn } from "@/components/ui/AddButton"
import { useState } from "react"
import { User, Phone, Briefcase, Trash2 } from "lucide-react"
import { formatUzbekPhoneNumber } from "@/utils/formatters"
import { useDispatch, useSelector } from "react-redux";
import { addUser, deleteUser } from "@/server/Slice/userSlice";
import CopyButton from "@/components/ui/CopyButton";

function Xodimlar() {
  const dispatch = useDispatch();

  const [isAdding, setIsAdding] = useState(false)
  const { users, loading, error } = useSelector((state) => state.users);
  const [errorMessage, setErrorMessage] = useState("");

  const [employeeForm, setEmployeeForm] = useState({
    fullName: "",
    phone: "+998 ",
    role: "",
    password: ""
  })

  const generateUniquePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatUzbekPhoneNumber(e.target.value, employeeForm.phone)
    setEmployeeForm({ ...employeeForm, phone: formatted })
  }

  const handleSave = (e) => {
    e.preventDefault();

    if (!employeeForm.fullName || employeeForm.phone.length < 19 || !employeeForm.role || !employeeForm.password) {
      setErrorMessage("Iltimos, barcha maydonlarni to'liq to'ldiring!");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setErrorMessage("")
    dispatch(addUser(employeeForm))
    handleClose()
  }

  const handleClose = () => {
    setEmployeeForm({ fullName: "", phone: "+998 ", role: "", password: "" })
    setIsAdding(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-lg">Yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 text-lg">Xatolik yuz berdi: {error}</p>
      </div>
    )
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
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm animate-fade-in">
              {errorMessage}
            </div>
          )}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-base font-bold text-indigo-400">Yangi xodim qo'shish</h2>
            <h1 className="font-bold text-slate-400 hover:text-red-400 cursor-pointer p-1" onClick={handleClose}>✕</h1>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-2 mt-2">
            <select
              value={employeeForm.role}
              onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
              className={inputClass}
            >
              <option value="">Xodim lavozimi</option>
              <option value="oshpaz">Oshpaz</option>
              <option value="ofitsiant">Ofitsiant</option>
              <option value="administrator">Administrator</option>
            </select>

            <input
              type="text"
              value={employeeForm.fullName}
              onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
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

            <div className="flex items-center justify-between">
              <h1
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-1 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
                onClick={() => setEmployeeForm({ ...employeeForm, password: generateUniquePassword() })}>
                Parol yaratish
              </h1>
              <div className="flex items-center gap-2">
                <h1 className=" font-mono bg-gray-300 text-black p-2 rounded-xl">{employeeForm.password}</h1>
                {
                  employeeForm.password.length > 0 && (
                    <CopyButton text={employeeForm.password} />
                  )
                }
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              Saqlash
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-full col-span-2">
            <p className="text-white text-lg">Xodimlar mavjud emas</p>
          </div>
        ) : (
          users.map((emp) => (
            <div key={emp.id} className="p-4 border border-slate-800 bg-slate-900/40 rounded-2xl flex justify-between items-center backdrop-blur-sm shadow-md hover:border-slate-700 transition-colors">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-400" />
                  <h3 className="font-bold text-slate-100">{emp.fullName}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Briefcase size={14} /> <span className="capitalize">{emp.role}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Phone size={14} /> <span className="font-mono">{emp.phone}</span>
                </div>
              </div>
              <button
                onClick={() => dispatch(deleteUser(emp.id))}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Xodimlar
