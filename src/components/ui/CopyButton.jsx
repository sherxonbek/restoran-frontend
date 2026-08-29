import { useState } from "react";
import { Copy, Check } from "lucide-react"; // Ikonkalarni import qilish

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nusxalashda xatolik:", err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-simbold transition-all ${
        copied 
          ? "bg-green-500 text-white" 
          : "bg-gray-900 hover:bg-gray-200 text-white hover:text-black"
      }`}
    >
      {copied ? (
        <>
          <Check size={16} />
        </>
      ) : (
        <>
          <Copy size={16} />
        </>
      )}
    </div>
  );
}

export default CopyButton;