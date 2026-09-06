import { Plus } from "lucide-react";

export default function HeaderAddButton({
  onClick,
  text = "Yangi Taom Qo'shish",
  icon: Icon = Plus,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer shrink-0 whitespace-nowrap ${className}`}
    >
      {Icon && <Icon size={16} />}
      {text}
    </button>
  );
}
