import { AddBtn } from "@/components/ui/AddButton";
import { Grip, House, Landmark, Pencil } from "lucide-react"
import { useState } from "react"

function Xonalar() {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState("Xona")

  const [roomCounts, setRoomCounts] = useState({
    Xona: 6,
    Zal: 12,
    Boshqa: 34
  })

  const [isOpen, setIsOpen] = useState("Xona")
  const [tempCount, setTempCount] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSave = () => {
    if (tempCount === "" || isNaN(tempCount)) return;

    setRoomCounts(prev => ({
      ...prev,
      [selectedType]: prev[selectedType] + parseInt(tempCount)
    }))

    setSuccessMessage(`Muvaffaqiyatli: ${parseInt(tempCount)} ta ${selectedType.toLowerCase()} qo'shildi!`)
    setTempCount("")
    setIsAdding(false)
    setTimeout(() => {
      setSuccessMessage("")
      setIsAdding(false)
    }, 3000)
  }

  const btn = [
    {
      id: 1,
      name: "Xona",
      type: "Xona",
      count: roomCounts.Xona,
      icon: <House className="w-5 h-5 text-indigo-400" />,
      colorClass: "text-indigo-400",
      badgeClass: "text-xs font-light px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300"
    },
    {
      id: 2,
      name: "Zal",
      type: "Zal",
      count: roomCounts.Zal,
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
      colorClass: "text-emerald-400",
      badgeClass: "text-xs font-light px-2 py-0.5 rounded-full bg-emerald-600/30 text-emerald-300"
    },
    {
      id: 3,
      name: "Boshqa",
      type: "Boshqa",
      count: roomCounts.Boshqa,
      icon: <Grip className="w-5 h-5 text-amber-400" />,
      colorClass: "text-amber-400",
      badgeClass: "text-xs font-light px-2 py-0.5 rounded-full bg-amber-600/30 text-amber-300"
    }
  ]

  return (

    <div div className="relative flex flex-col w-full h-full p-5 overflow-y-auto text-white" >

      {isAdding && (
        <div
          onClick={() => setIsAdding(false)}
          className="fixed inset-0 bg-slate-700/60 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        />
      )}

      <AddBtn onClick={() => setIsAdding(!isAdding)} />

      {
        isAdding && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-900/100 p-5 rounded-2xl shadow-lg z-50 flex flex-col gap-3 text-white w-[320px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 relative">
              <h2 className="text-base font-bold text-indigo-400">Yangi joy qo'shish</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-red-400 font-semibold transition-colors p-1 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-1.5 justify-between bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
              {btn.map((b) => {
                const isSelected = selectedType === b.type;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedType(b.type)}
                    className={`flex items-center justify-center gap-1.5 flex-1 py-2 px-1 rounded-lg text-[11px] font-medium transition-all duration-200 ${isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      }`}
                  >
                    {b.icon}
                    <span>{b.name}</span>
                  </button>
                )
              })}
            </div>

            <input
              type="number"
              value={tempCount}
              onChange={(e) => setTempCount(e.target.value)}
              placeholder={`${selectedType.toLowerCase()}lar sonini kiriting`}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all outline-none placeholder-slate-500 text-center font-semibold"
            />

            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20 mt-1"
            >
              Saqlash
            </button>
          </div>
        )
      }
      {
        successMessage && (
          <div className="p-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all duration-300">
            {successMessage}
          </div>
        )
      }
      <div className="grid grid-cols-3 gap-2 mt-5">

        {btn.map((btn) => (
          <div key={btn.id}
            onClick={() => setIsOpen(btn.type)}
            className="flex flex-col gap-2 items-center p-3 border border-slate-800 bg-slate-100/10 rounded-2xl btn-shadow">
            <div className="flex items-center gap-1">
              {btn.icon}
              <p className={btn.class}>{btn.name}</p>
            </div>
            <h1 className="text-2xl font-black text-white">{btn.count}</h1>
          </div>
        ))}

      </div>

      <div className="mt-6 p-5 border border-slate-800 bg-slate-900/20 rounded-2xl min-h-[150px] max-h-[400px] overflow-y-auto backdrop-blur-sm custom-scrollbar">
        {(() => {
          const activeConfig = btn.find(b => b.type === isOpen);
          const joriyCount = activeConfig ? activeConfig.count : 0;

          if (joriyCount === 0) {
            return (
              <div className="animate-in fade-in duration-300">
                <h3 className={`text-lg font-bold mb-3 ${activeConfig?.colorClass}`}>{isOpen}lar ro'yxati</h3>
                <p className="text-sm text-slate-400">Bu yerda siz qo'shgan alohida {isOpen.toLowerCase()}lar va ularning stollari joylashadi.</p>
              </div>
            );
          }

          return (
            <div className="space-y-2 animate-in fade-in duration-300">
              {Array.from({ length: joriyCount }).map((_, index) => {
                const tartibRaqami = index + 1;

                return (
                  <div key={index} className="flex flex-col items-center gap-3 p-4 border border-slate-800 bg-slate-100/10 rounded-2xl btn-shadow">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {activeConfig?.icon}
                        <h3 className="text-base font-bold text-slate-200">{activeConfig?.name} {tartibRaqami}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <h1 className={`text-xl font-black ${activeConfig?.colorClass}`}>0 <span className="text-xs font-normal text-slate-400">ta stol</span></h1>
                        <button className="text-slate-400 hover:text-white transition-colors">
                          <Pencil size={16} />
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
    </div >

  )
}

export default Xonalar
