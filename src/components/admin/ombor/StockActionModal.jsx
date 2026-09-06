import { useState } from "react";
import { X, ArrowDownRight, ArrowUpRight, AlertCircle } from "lucide-react";

export default function StockActionModal({
  isOpen,
  onClose,
  item,
  type = "kirim", // "kirim" | "chiqim"
  onConfirm,
}) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState(
    type === "kirim" ? "Yangi partiya xaridi" : "Oshxonaga topshirildi"
  );
  const [user, setUser] = useState("");
  const [warning, setWarning] = useState("");

  if (!isOpen || !item) return null;

  const isKirim = type === "kirim";

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      setWarning("Iltimos, noldan katta miqdor kiriting!");
      return;
    }

    if (!isKirim && qty > item.quantity) {
      setWarning(
        `Omborda buncha mahsulot yo'q! Hozirgi qoldiq: ${item.quantity} ${item.unit}`
      );
      return;
    }

    onConfirm({
      id: item.id,
      quantity: qty,
      reason: reason.trim() || (isKirim ? "Kirim qilindi" : "Chiqim qilindi"),
      user: user.trim() || (isKirim ? "Admin" : "Oshpaz"),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-white">
        {/* Modal Tepa qismi */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isKirim
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              {isKirim ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isKirim ? "Omborga Kirim Qilish (+)" : "Ombordan Chiqim Qilish (-)"}
              </h2>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[240px]">
                {item.name}
              </p>
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

        {/* Hozirgi qoldiq axboroti */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <span className="text-slate-400">Hozirgi mavjud qoldiq:</span>
          <span className="font-bold text-white font-mono text-sm">
            {item.quantity} {item.unit}
          </span>
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isKirim ? "Kirim miqdori" : "Chiqim / Sarf miqdori"} ({item.unit}) *
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setWarning("");
              }}
              placeholder={`Necha ${item.unit}...`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-mono"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sababi / Izoh
            </label>
            {isKirim ? (
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="Yangi partiya xaridi">Yangi partiya xaridi</option>
                <option value="Qo'shimcha yetkazib berish">Qo'shimcha yetkazib berish</option>
                <option value="Inventarizatsiya qoldig'i">Inventarizatsiya (Ortiqcha)</option>
                <option value="Oshxonadan qaytarildi">Oshxonadan qaytarildi</option>
              </select>
            ) : (
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 transition-all"
              >
                <option value="Oshxonaga topshirildi">Oshxonaga topshirildi (Taomlar uchun)</option>
                <option value="Brak / Chirigan / Yaroqsiz">Brak / Chirigan (Spisanie)</option>
                <option value="Muddati o'tgan">Muddati o'tgan</option>
                <option value="Inventarizatsiya kamomadi">Inventarizatsiya kamomadi</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mas'ul Xodim (Ismi)
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder={isKirim ? "Admin / Ta'minotchi" : "Oshpaz Elyor"}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Pastki tugmalar */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                isKirim
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/25"
              }`}
            >
              {isKirim ? "Kirimni Tasdiqlash" : "Chiqimni Tasdiqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
