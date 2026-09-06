import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyButton({ text, textToCopy }) {
  const [copied, setCopied] = useState(false);
  const valueToCopy = text ?? textToCopy ?? "";

  const handleCopy = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!valueToCopy) {
      console.warn("CopyButton: nusxalash uchun matn mavjud emas");
      return;
    }

    try {
      await navigator.clipboard.writeText(String(valueToCopy));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nusxalashda xatolik:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Nusxalandi!" : "Nusxalash"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
        copied
          ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
          : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
      }`}
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-400" />
          <span>Nusxalandi</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>Nusxa olish</span>
        </>
      )}
    </button>
  );
}

export default CopyButton;