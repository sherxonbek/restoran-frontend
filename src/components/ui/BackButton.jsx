import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  onClick,
  className = "",
  title = "Orqaga qaytish",
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      className={`p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer group shrink-0 ${className}`}
    >
      <ArrowLeft
        size={20}
        className="group-hover:-translate-x-0.5 transition-transform"
      />
    </button>
  );
}
