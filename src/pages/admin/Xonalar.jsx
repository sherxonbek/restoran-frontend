import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grip, House, Landmark } from "lucide-react";

import { AddBtn } from "@/components/ui/AddButton";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AddRoomModal from "@/components/admin/xonalar/AddRoomModal";
import AddTableModal from "@/components/admin/xonalar/AddTableModal";
import RoomCard from "@/components/admin/xonalar/RoomCard";

import { useToast } from "@/hooks/useToast";
import { addRoom, addTables, deleteRoom } from "@/store/slices/roomSlice";

function Xonalar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rooms, tables } = useSelector((state) => state.rooms);

  // UI / Modal holatlari
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [selectedRoomForTables, setSelectedRoomForTables] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("Xona");

  // Maxsus useToast hooki
  const { toast: successMessage, showToast: showSuccess } = useToast();

  // Yangi xonalar qo'shish
  const handleSaveRoom = (selectedType, countToCreate) => {
    const joriyXonalar = rooms.filter(r => r.type === selectedType);

    let engKattaRaqam = 0;
    if (joriyXonalar.length > 0) {
      const raqamlar = joriyXonalar.map(r => {
        const raqam = r.name.replace(/^\D+/g, "");
        return parseInt(raqam) || 0;
      });
      engKattaRaqam = Math.max(...raqamlar);
    }

    const newRoomsArray = [];
    for (let i = 1; i <= countToCreate; i++) {
      newRoomsArray.push({
        type: selectedType,
        name: `${selectedType} ${engKattaRaqam + i}`,
        tableCount: 0
      });
    }

    dispatch(addRoom(newRoomsArray));
    showSuccess(`Muvaffaqiyatli: ${countToCreate} ta ${selectedType.toLowerCase()} qo'shildi!`);
    setIsAddingRoom(false);
  };

  // Tanlangan xonaga yangi stollar qo'shish
  const handleSaveTables = (countToCreate) => {
    if (!selectedRoomForTables) return;
    const roomId = selectedRoomForTables.id;
    const roomName = selectedRoomForTables.name;
    const haqiqiyStollarSoni = tables.filter(t => t.roomId === roomId).length;

    const newTablesArray = [];
    for (let i = 1; i <= countToCreate; i++) {
      newTablesArray.push({
        roomId,
        name: `${roomName} / ${haqiqiyStollarSoni + i}-stol`,
        status: "bo'sh"
      });
    }

    dispatch(addTables({
      newTablesList: newTablesArray,
      roomId,
      newTotalCount: haqiqiyStollarSoni + countToCreate
    }));

    showSuccess(`Muvaffaqiyatli: ${roomName}ga ${countToCreate} ta yangi stol qo'shildi!`);
    setSelectedRoomForTables(null);
  };

  // Xonani o'chirish
  const handleConfirmDelete = () => {
    if (roomToDelete) {
      dispatch(deleteRoom(roomToDelete.id));
      setRoomToDelete(null);
    }
  };

  const tabs = [
    {
      id: 1,
      name: "Xona",
      type: "Xona",
      count: rooms.filter(r => r.type === "Xona").length,
      icon: <House className="w-5 h-5 text-indigo-400" />,
      colorClass: "text-indigo-400"
    },
    {
      id: 2,
      name: "Zal",
      type: "Zal",
      count: rooms.filter(r => r.type === "Zal").length,
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
      colorClass: "text-emerald-400"
    },
    {
      id: 3,
      name: "Boshqa",
      type: "Boshqa",
      count: rooms.filter(r => r.type === "Boshqa").length,
      icon: <Grip className="w-5 h-5 text-amber-400" />,
      colorClass: "text-amber-400"
    }
  ];

  const currentTabConfig = tabs.find(t => t.type === activeTab);
  const joriyXonalar = rooms.filter(room => room.type === activeTab);

  return (
    <div className="relative flex flex-col w-full h-full p-5 overflow-y-auto text-white">
      <AddBtn onClick={() => setIsAddingRoom(!isAddingRoom)} />

      {successMessage && (
        <div className="p-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all duration-300 mb-4 animate-in fade-in">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.type)}
            className={`flex flex-col gap-2 items-center p-3 border rounded-2xl btn-shadow cursor-pointer transition-all duration-200 ${
              activeTab === tab.type
                ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
                : "border-slate-800 bg-slate-100/10 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-1">
              {tab.icon}
              <p className={`text-sm font-medium ${tab.colorClass}`}>{tab.name}</p>
            </div>
            <h1 className="text-2xl font-black text-white">{tab.count}</h1>
          </div>
        ))}
      </div>

      {/* Xonalar ro'yxati */}
      <div className="mt-6 p-5 border border-slate-800 bg-slate-900/20 rounded-2xl min-h-[150px] max-h-[420px] overflow-y-auto backdrop-blur-sm custom-scrollbar">
        {joriyXonalar.length === 0 ? (
          <div className="animate-in fade-in duration-300">
            <h3 className={`text-lg font-bold mb-3 ${currentTabConfig?.colorClass}`}>
              {activeTab}lar ro'yxati
            </h3>
            <p className="text-sm text-slate-400">
              Bu yerda siz qo'shgan alohida {activeTab.toLowerCase()}lar va ularning stollari joylashadi.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            {joriyXonalar.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                activeConfig={currentTabConfig}
                onClick={() => navigate(`/admin/xonalar/${room.id}`)}
                onAddTable={(selected) => setSelectedRoomForTables(selected)}
                onDelete={(selected) => setRoomToDelete(selected)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modallar */}
      <AddRoomModal
        isOpen={isAddingRoom}
        onClose={() => setIsAddingRoom(false)}
        onSave={handleSaveRoom}
      />

      <AddTableModal
        isOpen={Boolean(selectedRoomForTables)}
        room={selectedRoomForTables}
        onClose={() => setSelectedRoomForTables(null)}
        onSave={handleSaveTables}
      />

      <ConfirmModal
        isOpen={Boolean(roomToDelete)}
        message={
          <span>
            Haqiqatdan ham <strong>{roomToDelete?.name}</strong> ni o'chirmoqchimisiz?
            <br />
            <br />
            Ichidagi barcha stollar ham o'chib ketadi!
          </span>
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setRoomToDelete(null)}
      />
    </div>
  );
}

export default Xonalar;