import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Phone, Briefcase, Trash2 } from "lucide-react";

import { AddBtn } from "@/components/ui/AddButton";
import CopyButton from "@/components/ui/CopyButton";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/hooks/useToast";
import { formatUzbekPhoneNumber } from "@/utils/formatters";
import { addUser, deleteUser } from "@/store/slices/userSlice";

function Xodimlar() {
  // 1. Hooks & Redux State
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  // 2. UI State
  const [isAdding, setIsAdding] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const { toast: errorMessage, showToast: showError } = useToast();

  // 3. Form State
  const [employeeForm, setEmployeeForm] = useState({
    fullName: "",
    phone: "+998 ",
    role: "",
    password: "",
  });

  const generateUniquePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const newPass = generateUniquePassword();
    setEmployeeForm((prev) => ({
      ...prev,
      password: newPass,
    }));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatUzbekPhoneNumber(
      e.target.value,
      employeeForm.phone
    );
    setEmployeeForm({ ...employeeForm, phone: formatted });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      !employeeForm.fullName ||
      employeeForm.phone.length < 19 ||
      !employeeForm.role ||
      !employeeForm.password
    ) {
      showError("Iltimos, barcha maydonlarni to'liq to'ldiring!");
      return;
    }

    dispatch(addUser(employeeForm));
    setIsAdding(false);
    setEmployeeForm({
      fullName: "",
      phone: "+998 ",
      role: "",
      password: "",
    });
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      dispatch(deleteUser(employeeToDelete.id));
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full p-5 overflow-y-auto text-white">
      <AddBtn onClick={() => setIsAdding(!isAdding)} />

      {isAdding && (
        <div
          onClick={() => setIsAdding(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        />
      )}

      {isAdding && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 p-6 rounded-2xl shadow-xl z-50 flex flex-col gap-4 text-white w-[360px] border border-slate-800 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-indigo-400">
              Yangi xodim qo'shish
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-red-400 font-semibold p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-3">
            {errorMessage && (
              <div className="p-2 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                F.I.SH (Ism Familiya)
              </label>
              <input
                type="text"
                placeholder="Masalan: Aziz Rahimov"
                value={employeeForm.fullName}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    fullName: e.target.value,
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Telefon raqami
              </label>
              <input
                type="text"
                placeholder="+998 (90) 123-45-67"
                value={employeeForm.phone}
                onChange={handlePhoneChange}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Lavozimi
              </label>
              <select
                value={employeeForm.role}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, role: e.target.value })
                }
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="" disabled>
                  Lavozimni tanlang
                </option>
                <option value="ofitsiant">Ofitsiant</option>
                <option value="admin">Administrator</option>
                <option value="oshpaz">Oshpaz</option>
                <option value="kassir">Kassir</option>
                <option value="boshqa">Boshqa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Parol (Avtomatik generatsiya)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Parolni generatsiya qiling"
                  value={employeeForm.password}
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-indigo-400 font-mono font-bold tracking-wider select-all"
                />
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="px-3.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Yaratish
                </button>
              </div>
              {Boolean(employeeForm.password?.trim()) && (
                <div className="mt-2 flex justify-end">
                  <CopyButton text={employeeForm.password} textToCopy={employeeForm.password} />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-2 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Saqlash
            </button>
          </form>
        </div>
      )}

      {/* Xodimlar ro'yxati */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-full col-span-2 py-20 text-slate-500">
            <p className="text-sm italic">Xodimlar mavjud emas</p>
          </div>
        ) : (
          users.map((emp) => (
            <div
              key={emp.id}
              className="p-4 border border-slate-800 bg-slate-900/40 rounded-2xl flex justify-between items-center backdrop-blur-sm shadow-md hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-400" />
                  <h3 className="font-bold text-slate-100">{emp.fullName}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Briefcase size={14} />{" "}
                  <span className="capitalize">{emp.role}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Phone size={14} />{" "}
                  <span className="font-mono">{emp.phone}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmployeeToDelete(emp)}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="Xodimni o'chirish"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Xodimni o'chirishni tasdiqlash modali */}
      <ConfirmModal
        isOpen={Boolean(employeeToDelete)}
        message={
          <span>
            Haqiqatdan ham <strong>{employeeToDelete?.fullName}</strong> xodimini o'chirmoqchimisiz?
          </span>
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </div>
  );
}

export default Xodimlar;
