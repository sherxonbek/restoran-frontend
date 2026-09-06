function ConfirmModal({ isOpen, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Ortga" }) {
  if (!isOpen) return null;

  return (
    <div className="w-full fixed inset-0 bg-slate-700/60 backdrop-blur-sm z-50 transition-all duration-300 animate-in fade-in">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl shadow-red-500/10 min-w-[300px] max-w-[400px]">
        <div className="text-sm text-red-400 font-semibold mb-4 leading-relaxed">
          {message}
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-xl border border-red-700/50 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer shadow-md shadow-red-600/20"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
