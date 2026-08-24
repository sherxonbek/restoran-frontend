import { CalendarDays, DollarSign, ListOrdered, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"

function Statistika() {
  const [isOpen, setIsOpen] = useState("kirm")


  const haftalikMaLumot = [
    { kun: "Dush", daromad: 1200000, buyurtmalar: 45 },
    { kun: "Sesh", daromad: 1500000, buyurtmalar: 52 },
    { kun: "Chor", daromad: 950000, buyurtmalar: 38 },
    { kun: "Pay", daromad: 1800000, buyurtmalar: 60 },
    { kun: "Jum", daromad: 2500000, buyurtmalar: 85 },
    { kun: "Shan", daromad: 3200000, buyurtmalar: 110 },
    { kun: "Yak", daromad: 2800000, buyurtmalar: 95 },
  ]

  // 2. OYLIK SOXTA MA'LUMOTLAR (Mock Data)
  const oylikMaLumot = [
    { kun: "1-Hafta", daromad: 8500000, buyurtmalar: 280 },
    { kun: "2-Hafta", daromad: 11200000, buyurtmalar: 340 },
    { kun: "3-Hafta", daromad: 9800000, buyurtmalar: 310 },
    { kun: "4-Hafta", daromad: 14500000, buyurtmalar: 420 },
  ]


  const [vaqtTuri, setVaqtTuri] = useState("hafta")

  // Tanlangan vaqt turiga qarab ma'lumotni saralash
  const grafikMaLumoti = vaqtTuri === "hafta" ? haftalikMaLumot : oylikMaLumot

  // Pullarni so'm formatiga o'tkazish uchun yordamchi funksiya
  const formatUzSum = (val) => `${(val / 1000).toLocaleString()} k so'm`

  return (
    <div className="p-4 space-y-6">
      <div className="relative grid grid-cols-2 gap-5 text-white">

        <button
          onClick={() => setIsOpen("kirm")}
          className={`flex text-center items-center justify-center gap-3 border font-bold text-xl py-3 rounded-2xl transition-all duration-300 btn-shadow
            ${isOpen === "kirm"
              ? "border-green-400 bg-green-600 scale-[1.02] shadow-lg shadow-green-600/50"
              : "border-green-900 bg-green-950/40 text-green-400 opacity-60 hover:opacity-90"
            }`}
        >
          <TrendingUp />
          Kirim
        </button>

        <button
          onClick={() => setIsOpen("chiqim")}
          className={`flex text-center items-center justify-center gap-3 border font-bold text-xl py-3 rounded-2xl transition-all duration-300 btn-shadow
            ${isOpen === "chiqim"
              ? "border-red-400 bg-red-600 scale-[1.02] shadow-lg shadow-red-600/50"
              : "border-red-900 bg-red-950/40 text-red-400 opacity-60 hover:opacity-90"
            }`}
        >
          <TrendingDown />
          Chiqim
        </button>
      </div>

      <div>
        {isOpen === "kirm" && (
          <div>
            <select name="" id="" className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all outline-none placeholder-slate-500 text-center font-semibold">
              <option value="haftalik">Haftalik</option>
              <option value="oylik">Oylik</option>
            </select>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="flex border py-2 rounded-xl text-center items-center justify-center gap-3 bg-slate-900/60 border-slate-800/80 text-md font-bold">
                <DollarSign className="text-green-500" />
                <div>
                  <h1>0</h1>
                  <p>Daromad</p>
                </div>
              </div>
              <div className="flex border py-2 rounded-xl text-center items-center justify-center gap-3 bg-slate-900/60 border-slate-800/80 text-md font-bold">
                <ListOrdered className="text-yellow-500" />
                <div>
                  <h1>0</h1>
                  <p>Buyurtmalar</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4">

              {/* Haftalik / Oylik o'tkazgich */}
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setVaqtTuri("hafta")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                    ${vaqtTuri === "hafta" ? "bg-green-600 text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
                >
                  <CalendarDays size={16} /> Haftalik
                </button>
                <button
                  onClick={() => setVaqtTuri("oy")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                    ${vaqtTuri === "oy" ? "bg-green-600 text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
                >
                  <CalendarDays size={16} /> Oylik
                </button>
              </div>
            </div>

            {/* RECHARTS GRAFIK SATHI */}
            <div className="w-full h-[320px] bg-zinc-900/20 p-2 rounded-2xl border border-zinc-900/60">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={grafikMaLumoti} margin={{ top: 20, right: -10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                  <XAxis dataKey="kun" stroke="#71717a" fontSize={12} tickLine={false} />
                  
                  {/* Chap tomondagi Y-O'qi: Daromad uchun */}
                  <YAxis yAxisId="left" stroke="#22c55e" fontSize={11} tickFormatter={formatUzSum} tickLine={false} />
                  {/* O'ng tomondagi Y-O'qi: Buyurtmalar soni uchun */}
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={11} tickLine={false} />
                  
                  {/* Sichqoncha olib kelgandagi oyna (Tooltip) */}
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "12px", color: "#fff" }}
                    formatter={(value, name) => [
                      name === "daromad" ? `${value.toLocaleString()} so'm` : `${value} ta`,
                      name === "daromad" ? "Daromad" : "Buyurtmalar"
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  
                  {/* Daromadni USTUN ko'rinishida chizamiz */}
                  <Bar yAxisId="left" dataKey="daromad" name="daromad" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  {/* Buyurtmalarni CHIZIQ ko'rinishida ustidan chizamiz */}
                  <Line yAxisId="right" type="monotone" dataKey="buyurtmalar" name="buyurtmalar" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {isOpen === "chiqim" && (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-semibold text-red-400 mb-4">Chiqim statistikasi</h3>
            <p className="text-zinc-400">Bu yerda mahsulotlar xaridi, xodimlar oyligi va boshqa xarajatlar ro‘yxati joylashadi.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistika
