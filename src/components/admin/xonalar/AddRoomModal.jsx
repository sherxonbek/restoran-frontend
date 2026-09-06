import { useState } from "react";
import { House, Landmark, Grip } from "lucide-react";

const ROOM_TYPES = [
  {
    id: 1,
    name: "Xona",
    type: "Xona",
    icon: <House className="w-5 h-5 text-indigo-400" />
  },
  {
    id: 2,
    name: "Zal",
    type: "Zal",
    icon: <Landmark className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 3,
    name: "Boshqa",
    type: "Boshqa",
    icon: <Grip className="w-5 h-5 text-amber-400" />
  }
];

function AddRoomModal({ isOpen, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState("Xona");
  const [tempCount, setTempCount] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tempCount || isNaN(tempCount) || parseInt(tempCount) <= 0) return;
    onSave(selectedType, parseInt(tempCount));
    setTempCount("");
  };

  const handleClose = () => {
    setTempCount("");
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
          <h2 className="text-base font-bold text-indigo-400">Yangi joy qo'shish</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-red-400 font-semibold p-1 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1.5 justify-between bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {ROOM_TYPES.map((b) => {
            const isSelected = selectedType === b.type;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedType(b.type)}
                className={`flex items-center justify-center gap-1.5 flex-1 py-2 px-1 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                  isSelected ? "bg-indigo-600 text-white shadow-md font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {b.icon}
                <span>{b.name}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            value={tempCount}
            onChange={(e) => setTempCount(e.target.value)}
            placeholder={`${selectedType.toLowerCase()}lar sonini kiriting`}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-semibold text-white outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
          >
            Saqlash
          </button>
        </form>
      </div>
    </>
  );
}

export default AddRoomModal;
