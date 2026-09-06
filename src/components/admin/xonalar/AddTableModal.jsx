import { useState } from "react";

function AddTableModal({ isOpen, room, onClose, onSave }) {
  const [tableTempCount, setTableTempCount] = useState("");

  if (!isOpen || !room) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableTempCount || isNaN(tableTempCount) || parseInt(tableTempCount) <= 0) return;
    onSave(parseInt(tableTempCount));
    setTableTempCount("");
  };

  const handleClose = () => {
    setTableTempCount("");
    onClose();
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-700/60 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
      />
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 p-5 rounded-2xl shadow-lg z-50 flex flex-col gap-3 text-white w-[320px] border border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-base font-bold text-emerald-400">{room.name}ga stol qo'shish</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-red-400 font-semibold p-1 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-1">
          Mavjud stollar soni: {room.tableCount || 0} ta
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            value={tableTempCount}
            onChange={(e) => setTableTempCount(e.target.value)}
            placeholder="Nechta stol yaratilsin?"
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-center font-semibold text-white outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
          >
            Stollarni saqlash
          </button>
        </form>
      </div>
    </>
  );
}

export default AddTableModal;
