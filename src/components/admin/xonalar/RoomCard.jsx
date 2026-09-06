import { Pencil, Trash2 } from "lucide-react";

function RoomCard({ room, activeConfig, onClick, onAddTable, onDelete }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-3 p-4 border border-slate-800 bg-slate-100/10 rounded-2xl btn-shadow cursor-pointer hover:border-slate-700 transition-colors"
    >
      <div className="w-full flex justify-between items-center border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-3">
          {activeConfig?.icon}
          <h3 className="text-base font-bold text-slate-200">{room.name}</h3>
        </div>
        <div className="flex items-center gap-4">
          <h1 className={`text-xl font-black ${activeConfig?.colorClass}`}>
            {room.tableCount || 0} <span className="text-xs font-normal text-slate-400">ta stol</span>
          </h1>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddTable(room);
            }}
            className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
            title="Stol qo'shish"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(room);
            }}
            className="text-red-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
            title="O'chirish"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
