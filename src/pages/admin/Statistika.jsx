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
  const [vaqtTuri, setVaqtTuri] = useState("hafta")
  const [chiqimTuri, setChiqimTuri] = useState("mahsulot")


  const haftalikMaLumot = [
    { kun: "Dush", daromad: 1200000, buyurtmalar: 45 },
    { kun: "Sesh", daromad: 1500000, buyurtmalar: 52 },
    { kun: "Chor", daromad: 950000, buyurtmalar: 38 },
    { kun: "Pay", daromad: 1800000, buyurtmalar: 60 },
    { kun: "Jum", daromad: 2500000, buyurtmalar: 85 },
    { kun: "Shan", daromad: 3200000, buyurtmalar: 110 },
    { kun: "Yak", daromad: 2800000, buyurtmalar: 95 },
  ]

  const oylikMaLumot = [
    { kun: "1-Hafta", daromad: 8500000, buyurtmalar: 280 },
    { kun: "2-Hafta", daromad: 11200000, buyurtmalar: 340 },
    { kun: "3-Hafta", daromad: 9800000, buyurtmalar: 310 },
    { kun: "4-Hafta", daromad: 14500000, buyurtmalar: 420 },
  ]

  const grafikMaLumoti = vaqtTuri === "hafta" ? haftalikMaLumot : oylikMaLumot

  const formatUzSum = (val) => `${(val / 1000).toLocaleString()} k`

  return (
    <div className="p-4 space-y-6 text-white">
      <div className="relative grid grid-cols-2 gap-5">
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
          <div className="space-y-4">
            <div className="flex justify-end items-center border-b border-zinc-900 pb-4">
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

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="flex border py-3 rounded-xl text-center items-center justify-center gap-3 bg-slate-900/60 border-slate-800/80 text-md font-bold">
                <DollarSign className="text-green-500" />
                <div className="text-left">
                  <h1 className="text-lg">
                    {vaqtTuri === "hafta" ? "15.1 M" : "44.0 M"}
                  </h1>
                  <p className="text-xs text-zinc-400">Daromad (so'm)</p>
                </div>
              </div>
              <div className="flex border py-3 rounded-xl text-center items-center justify-center gap-3 bg-slate-900/60 border-slate-800/80 text-md font-bold">
                <ListOrdered className="text-yellow-500" />
                <div className="text-left">
                  <h1 className="text-lg">
                    {vaqtTuri === "hafta" ? "485" : "1,350"}
                  </h1>
                  <p className="text-xs text-zinc-400">Buyurtmalar</p>
                </div>
              </div>
            </div>

            <div className="w-full mt-3 p-2 rounded-2xl border border-zinc-900/60 bg-zinc-900/20 overflow-x-auto scrollbar-thin">
              <div className="w-full h-[320px] min-w-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={grafikMaLumoti} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                    <XAxis dataKey="kun" stroke="#71717a" fontSize={11} tickLine={false} />

                    <YAxis yAxisId="left" stroke="#22c55e" fontSize={10} tickFormatter={formatUzSum} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} tickLine={false} />

                    <Tooltip
                      shared={true}
                      trigger="click"
                      contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "12px", color: "#fff" }}
                      formatter={(value, name) => [
                        name === "daromad" ? `${value.toLocaleString()} so'm` : `${value} ta`,
                        name === "daromad" ? "Daromad" : "Buyurtmalar"
                      ]}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />

                    <Bar yAxisId="left" dataKey="daromad" name="daromad" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    <Line yAxisId="right" type="monotone" dataKey="buyurtmalar" name="buyurtmalar" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {isOpen === "chiqim" && (
          <div className="space-y-5 animate-fadeIn">

            <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 w-fit">
              <button
                onClick={() => setChiqimTuri("mahsulot")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
          ${chiqimTuri === "mahsulot" ? "bg-red-600 text-white font-semibold shadow-md" : "text-zinc-400 hover:text-white"}`}
              >
                🥩 Mahsulotlar
              </button>
              <button
                onClick={() => setChiqimTuri("xodim")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
          ${chiqimTuri === "xodim" ? "bg-red-600 text-white font-semibold shadow-md" : "text-zinc-400 hover:text-white"}`}
              >
                👥 Oylik Maoshi
              </button>
              <button
                onClick={() => setChiqimTuri("chiqindi")}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all
          ${chiqimTuri === "chiqindi" ? "bg-red-600 text-white font-semibold shadow-md" : "text-zinc-400 hover:text-white"}`}
              >
                🗑️ Chiqindi
              </button>
            </div>
            {/* Maxsulot sotib olishga ketgan xarajat */}
            {chiqimTuri === "mahsulot" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Qisqa ma'lumot */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex border py-3 rounded-xl items-center justify-center gap-3 bg-red-950/20 border-red-900/40 text-md font-bold">
                    <div className="text-left">
                      <h1 className="text-lg text-red-400">10.3 M so'm</h1>
                      <p className="text-xs text-zinc-400">Mahsulotlarga jami</p>
                    </div>
                  </div>
                  <div className="flex border py-3 rounded-xl items-center justify-center gap-3 bg-zinc-900/60 border-zinc-800/80 text-md font-bold">
                    <div className="text-left">
                      <h1 className="text-lg">350 kg</h1>
                      <p className="text-xs text-zinc-400">Keltirilgan hajm</p>
                    </div>
                  </div>
                </div>

                {/* Mahsulotlar Jadvali */}
                <div className="w-full overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase"><th className="p-3">Mahsulot</th><th className="p-3">Miqdori</th><th className="p-3">Narxi</th><th className="p-3 text-right">Jami</th></tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-900">
                      <tr className="hover:bg-zinc-900/20"><td className="p-3 font-medium">🥩 Go'sht (Mol)</td><td className="p-3 text-zinc-300">100 kg</td><td className="p-3 text-zinc-400">85k</td><td className="p-3 text-right font-semibold text-red-400">8.5 M so'm</td></tr>
                      <tr className="hover:bg-zinc-900/20"><td className="p-3 font-medium">🥔 Kartoshka</td><td className="p-3 text-zinc-300">200 kg</td><td className="p-3 text-zinc-400">4.5k</td><td className="p-3 text-right font-semibold text-red-400">900k so'm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Oylik moshga ketadigan xarajat */}
            {chiqimTuri === "xodim" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Qisqa ma'lumot */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex border py-3 rounded-xl items-center justify-center gap-3 bg-red-950/20 border-red-900/40 text-md font-bold">
                    <div className="text-left">
                      <h1 className="text-lg text-red-400">18.5 M so'm</h1>
                      <p className="text-xs text-zinc-400">Oyliklar jamg'armasi</p>
                    </div>
                  </div>
                  <div className="flex border py-3 rounded-xl items-center justify-center gap-3 bg-zinc-900/60 border-zinc-800/80 text-md font-bold">
                    <div className="text-left">
                      <h1 className="text-lg">8 nafar</h1>
                      <p className="text-xs text-zinc-400">Xodimlar soni</p>
                    </div>
                  </div>
                </div>

                {/* Xodimlar Maoshi Jadvali */}
                <div className="w-full overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase"><th className="p-3">Xodim</th><th className="p-3">Lavozimi</th><th className="p-3">Turi</th><th className="p-3 text-right">Berilgan Maosh</th></tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-900">
                      <tr className="hover:bg-zinc-900/20"><td className="p-3 font-medium">👨‍🍳 Elyor Asadov</td><td className="p-3 text-zinc-300">Chef Oshpaz</td><td className="p-3 text-green-400">Oylik</td><td className="p-3 text-right font-semibold text-red-400">8.0 M so'm</td></tr>
                      <tr className="hover:bg-zinc-900/20"><td className="p-3 font-medium">🤵 Davron Aliev</td><td className="p-3 text-zinc-300">Ofitsiant</td><td className="p-3 text-yellow-400">Kunlik %</td><td className="p-3 text-right font-semibold text-red-400">350k so'm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Zarar chiqindiga ketgan xarajat */}
            {chiqimTuri === "chiqindi" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex border py-3 rounded-xl items-center justify-center gap-3 bg-red-950/20 border-red-900/40 text-md font-bold">
                    <div className="text-left">
                      <h1 className="text-lg text-red-400">450k so'm</h1>
                      <p className="text-xs text-zinc-400">Brak tufayli zarar</p>
                    </div>
                  </div>
                  <div className="flex border py-3 rounded-xl items-center justify-center gap-3 bg-zinc-900/60 border-zinc-800/80 text-md font-bold">
                    <div className="text-left">
                      <h1 className="text-lg">3 ta holat</h1>
                      <p className="text-xs text-zinc-400">Yozib yuborilgan (Spisanie)</p>
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/40 text-xs font-semibold text-zinc-400 uppercase">
                        <th className="p-3">Mahsulot / Taom</th>
                        <th className="p-3">Miqdori</th>
                        <th className="p-3">Sababi</th>
                        <th className="p-3 text-right">Zarar miqdori</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-900">
                      <tr className="hover:bg-zinc-900/20">
                        <td className="p-3 font-medium">🍅 Pomidor</td>
                        <td className="p-3 text-zinc-300">5 kg</td>
                        <td className="p-3 text-yellow-500 text-xs">Omborda chirigan</td>
                        <td className="p-3 text-right font-semibold text-red-400">75,000 so'm</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/20">
                        <td className="p-3 font-medium">🍲 Lavash (Tayyor)</td>
                        <td className="p-3 text-zinc-300">2 dona</td>
                        <td className="p-3 text-yellow-500 text-xs">Ofitsiant xatosi (Kuygan)</td>
                        <td className="p-3 text-right font-semibold text-red-400">70,000 so'm</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/20">
                        <td className="p-3 font-medium">🥛 Sut (Sutli mahsulot)</td>
                        <td className="p-3 text-zinc-300">6 litr</td>
                        <td className="p-3 text-yellow-500 text-xs">Muddati o'tgan</td>
                        <td className="p-3 text-right font-semibold text-red-400">105,000 so'm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

export default Statistika
