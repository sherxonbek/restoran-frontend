import { useState } from "react";
import { X, PackagePlus, AlertCircle } from "lucide-react";

const STANDARD_CATEGORIES = [
  "Go'sht & Parranda",
  "Sabzavot & Meva",
  "Sut & Tuxum",
  "Yog' & Ziravor",
  "Baqqollik & Don",
  "Ichimliklar",
  "Qadoq & Idish",
  "Boshqa",
];

const STANDARD_UNITS = [
  { value: "kg", label: "Kilogramm (kg)" },
  { value: "litr", label: "Litr (l)" },
  { value: "dona", label: "Dona (ta)" },
  { value: "g", label: "Gramm (g)" },
  { value: "ml", label: "Millilitr (ml)" },
  { value: "quti", label: "Quti / Paket" },
];

export default function AddStockModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Go'sht & Parranda",
    customCategory: "",
    unit: "kg",
    quantity: "",
    minStock: "",
    costPrice: "",
    supplier: "",
  });

  const [warning, setWarning] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setWarning("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setWarning("Iltimos, xom-ashyo nomini kiriting!");
      return;
    }

    const finalCategory =
      formData.category === "Boshqa" && formData.customCategory.trim()
        ? formData.customCategory.trim()
        : formData.category;

    const newItem = {
      name: formData.name.trim(),
      category: finalCategory,
      unit: formData.unit,
      quantity: Number(formData.quantity) || 0,
      minStock: Number(formData.minStock) || 0,
      costPrice: Number(formData.costPrice) || 0,
      supplier: formData.supplier.trim() || "Noma'lum ta'minotchi",
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal tepa qismi */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <PackagePlus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Yangi Xom-ashyo Kiritish</h2>
              <p className="text-xs text-slate-400">Omborxona uchun tovar ro'yxatini to'ldiring</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Ogohlantirish */}
        {warning && (
          <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle size={16} />
            {warning}
          </div>
        )}

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tovar nomi */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Xom-ashyo / Mahsulot Nomi *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masalan: Mol go'shti (Lahm), Kartoshka..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              required
            />
          </div>

          {/* Kategoriya va O'lchov birligi (2 ustun) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kategoriya
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
              >
                {STANDARD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                O'lchov Birligi
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
              >
                {STANDARD_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.category === "Boshqa" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Yangi Kategoriya Nomini Yozing
              </label>
              <input
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Yangi toifa nomi..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Miqdor va Minimal Qoldiq (2 ustun) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Boshlang'ich Miqdor ({formData.unit})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Minimal Xavfsiz Qoldiq ({formData.unit})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                placeholder="Masalan: 10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Ushbu miqdordan kamaysa, tizim ogohlantirish beradi
              </p>
            </div>
          </div>

          {/* Xarid Narxi va Ta'minotchi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Xarid Narxi (so'm / 1 {formData.unit})
              </label>
              <input
                type="number"
                min="0"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="Masalan: 85000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ta'minotchi / Manba
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Bozor yoki firma nomi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Pastki tugmalar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
            >
              Saqlash va Qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
