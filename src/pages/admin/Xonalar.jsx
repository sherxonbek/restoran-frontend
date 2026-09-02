import { AddBtn } from "@/components/ui/AddButton";
import { addRoom, addTables, deleteRoom} from "@/server/Slice/roomSlice";
import { Grip, House, Landmark, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Xonalar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);
  const [isAddingTables, setIsAddingTables] = useState(false);

  const [isOpen, setIsOpen] = useState("Xona");
  const [selectedType, setSelectedType] = useState("Xona");

  const { rooms, tables } = useSelector((state) => state.rooms);
  const [ogohlantirish, setOgohlantirish] = useState("");
  const [deletes, setDelete] = useState("")

  const [tempCount, setTempCount] = useState("");
  const [tableTempCount, setTableTempCount] = useState("");
  const [selectedRoomForTables, setSelectedRoomForTables] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = () => {
    if (tempCount === "" || isNaN(tempCount) || parseInt(tempCount) <= 0) return;

    const countToCreate = parseInt(tempCount);
    const joriyXonalar = rooms.filter(r => r.type === selectedType);

    let engKattaRaqam = 0;
    if (joriyXonalar.length > 0) {
      const raqamlar = joriyXonalar.map(r => {
        const raqam = r.name.replace(/^\D+/g, '');
        return parseInt(raqam) || 0;
      });
      engKattaRaqam = Math.max(...raqamlar);
    }

    const newRoomsArray = [];
    for (let i = 1; i <= countToCreate; i++) {
      const keyingiRaqam = engKattaRaqam + i;
      newRoomsArray.push({
        type: selectedType,
        name: `${selectedType} ${keyingiRaqam}`,
        tableCount: 0
      });
    }

    dispatch(addRoom(newRoomsArray));
    setSuccessMessage(`Muvaffaqiyatli: ${countToCreate} ta ${selectedType.toLowerCase()} qo'shildi!`);
    setTempCount("");
    setIsAdding(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSaveTables = () => {
    if (tableTempCount === "" || isNaN(tableTempCount) || parseInt(tableTempCount) <= 0) return;

    const countToCreate = parseInt(tableTempCount);
    const roomId = selectedRoomForTables.id;
    const roomName = selectedRoomForTables.name;

    const haqiqiyStollarSoni = tables.filter(t => t.roomId === roomId).length;

    const newTablesArray = [];
    for (let i = 1; i <= countToCreate; i++) {
      const nextTableNumber = haqiqiyStollarSoni + i;
      newTablesArray.push({
        roomId: roomId,
        name: `${roomName} / ${nextTableNumber}-stol`,
        status: "bo'sh"
      });
    }

    const newTotalCount = haqiqiyStollarSoni + countToCreate;

    dispatch(addTables({
      newTablesList: newTablesArray,
      roomId: roomId,
      newTotalCount: newTotalCount
    }));

    setSuccessMessage(`Muvaffaqiyatli: ${roomName}ga ${countToCreate} ta yangi stol qo'shildi!`);
    setTableTempCount("");
    setIsAddingTables(false);
    setSelectedRoomForTables(null);

    setTimeout(() => setSuccessMessage(""), 3000);
  };


  const btn = [
    {
      id: 1,
      name: "Xona",
      type: "Xona",
      count: rooms.filter(r => r.type === "Xona").length,
      icon: <House className="w-5 h-5 text-indigo-400" />,
      colorClass: "text-indigo-400",
      class: "text-indigo-400"
    },
    {
      id: 2,
      name: "Zal",
      type: "Zal",
      count: rooms.filter(r => r.type === "Zal").length,
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
      colorClass: "text-emerald-400",
      class: "text-emerald-400"
    },
    {
      id: 3,
      name: "Boshqa",
      type: "Boshqa",
      count: rooms.filter(r => r.type === "Boshqa").length,
      icon: <Grip className="w-5 h-5 text-amber-400" />,
      colorClass: "text-amber-400",
      class: "text-amber-400"
    }
  ];

  return (
    <div className="relative flex flex-col w-full h-full p-5 overflow-y-auto text-white">

      {(isAdding || isAddingTables) && (
        <div
          onClick={() => { setIsAdding(false); setIsAddingTables(false); }}
          className="fixed inset-0 bg-slate-700/60 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        />
      )}

      <AddBtn onClick={() => setIsAdding(!isAdding)} />

      {isAdding && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 p-5 rounded-2xl shadow-lg z-50 flex flex-col gap-3 text-white w-[320px] border border-slate-800 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 relative">
            <h2 className="text-base font-bold text-indigo-400">Yangi joy qo'shish</h2>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-400 font-semibold p-1 text-sm">✕</button>
          </div>
          <div className="flex gap-1.5 justify-between bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {btn.map((b) => {
              const isSelected = selectedType === b.type;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedType(b.type)}
                  className={`flex items-center justify-center gap-1.5 flex-1 py-2 px-1 rounded-lg text-[11px] font-medium transition-all duration-200 ${isSelected ? "bg-indigo-600 text-white shadow-md font-bold" : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  {b.icon}
                  <span>{b.name}</span>
                </button>
              );
            })}
          </div>
          <input
            type="number"
            value={tempCount}
            onChange={(e) => setTempCount(e.target.value)}
            placeholder={`${selectedType.toLowerCase()}lar sonini kiriting`}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-semibold text-white outline-none"
          />
          <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-1">Saqlash</button>
        </div>
      )}

      {isAddingTables && selectedRoomForTables && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 p-5 rounded-2xl shadow-lg z-50 flex flex-col gap-3 text-white w-[320px] border border-slate-800 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-base font-bold text-emerald-400">{selectedRoomForTables.name}ga stol qo'shish</h2>
            <button onClick={() => { setIsAddingTables(false); setSelectedRoomForTables(null); }} className="text-slate-400 hover:text-red-400 font-semibold p-1 text-sm">✕</button>
          </div>
          <p className="text-xs text-slate-400 mb-1">Mavjud stollar soni: {selectedRoomForTables.tableCount || 0} ta</p>
          <input
            type="number"
            value={tableTempCount}
            onChange={(e) => setTableTempCount(e.target.value)}
            placeholder="Nechta stol yaratilsin?"
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-center font-semibold text-white outline-none"
          />
          <button onClick={handleSaveTables} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-1">Stollarni saqlash</button>
        </div>
      )}
      {ogohlantirish && (

        <div
          className="w-full fixed inset-0 bg-slate-700/60 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-2 rounded-xl border border-slate-800  shadow-lg shadow-red-400/20"
          >
            <h1
              className="text-sm text-red-400 font-semibold"
            >
              {ogohlantirish}
            </h1>
            <div className="flex items-center justify-between gap-2 mt-2">
              <button
                className="border p-2 rounded-md bg-green-700 font-extrabold btn-shadow"
                onClick={() => {
                  setOgohlantirish("")
                }}
              >Ortga</button>
              <button className="border p-2 rounded-md bg-red-700 font-extrabold btn-shadow"
                onClick={() => {
                  dispatch(deleteRoom(deletes))
                  setOgohlantirish("")
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="p-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all duration-300 mb-4 animate-in fade-in">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-5">
        {btn.map((b) => (
          <div
            key={b.id}
            onClick={() => setIsOpen(b.type)}
            className={`flex flex-col gap-2 items-center p-3 border rounded-2xl btn-shadow cursor-pointer transition-all duration-200 ${isOpen === b.type ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-slate-800 bg-slate-100/10 hover:border-slate-700"
              }`}
          >
            <div className="flex items-center gap-1">
              {b.icon}
              <p className={`text-sm font-medium ${b.class}`}>{b.name}</p>
            </div>
            <h1 className="text-2xl font-black text-white">{b.count}</h1>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 border border-slate-800 bg-slate-900/20 rounded-2xl min-h-[150px] max-h-[420px] overflow-y-auto backdrop-blur-sm custom-scrollbar">
        {(() => {
          const activeConfig = btn.find(b => b.type === isOpen);
          const joriyXonalar = rooms.filter(room => room.type === isOpen);

          if (joriyXonalar.length === 0) {
            return (
              <div className="animate-in fade-in duration-300">
                <h3 className={`text-lg font-bold mb-3 ${activeConfig?.colorClass}`}>{isOpen}lar ro'yxati</h3>
                <p className="text-sm text-slate-400">Bu yerda siz qo'shgan alohida {isOpen.toLowerCase()}lar va ularning stollari joylashadi.</p>
              </div>
            );
          }

          return (
            <div className="space-y-4 animate-in fade-in duration-300">
              {joriyXonalar.map((room) => {

                return (
                  <div
                    key={room.id}
                    onClick={() => navigate(`/admin/xonalar/${room.id}`)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomForTables(room);
                            setIsAddingTables(true);
                          }}
                          className="text-slate-400 hover:text-white transition-colors p-1"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOgohlantirish(
                              <span>
                                Haqiqatdan ham {room.name} ni o'chirmoqchisiz?
                                <br />
                                <br />
                                Ichidagi barcha stollar ham o'chib ketadi!
                              </span>
                            );

                            setDelete(room.id);
                          }}
                          className="text-red-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </div>


                  </div>
                );
              })}
            </div>
          );

        })()}

      </div>
    </div>
  );
}

export default Xonalar;