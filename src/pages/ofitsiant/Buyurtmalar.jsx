import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronLeft, Clock, CreditCard, MapPin, UtensilsCrossed } from "lucide-react";
import { useSelector } from "react-redux";

function BuyurtmalarHeader() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("buyurtmalar");

    const { orders } = useSelector((state) => state.orders);

    console.log("Orders from Redux Store:", orders);

    return (
        <div className="w-full">
            <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 sticky top-0 z-50 flex items-center min-h-[64px] btn-shadow">

                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 p-2 bg-slate-950 border border-slate-800 rounded-xl hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 transition-all duration-300 cursor-pointer shadow-md z-10"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">

                    <h1
                        onClick={() => setActiveTab("buyurtmalar")}
                        className={`text-base font-mono tracking-wide relative cursor-pointer transition-all duration-300 ${activeTab === "buyurtmalar" ? "font-bold text-white" : "font-medium text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        Buyurtmalar
                        {activeTab === "buyurtmalar" && (
                            <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-indigo-500 rounded-full animate-fadeIn"></span>
                        )}
                    </h1>

                    <h1
                        onClick={() => setActiveTab("payments")}
                        className={`text-base font-mono tracking-wide relative cursor-pointer transition-all duration-300 ${activeTab === "payments" ? "font-bold text-white" : "font-medium text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        Payments
                        {activeTab === "payments" && (
                            <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-indigo-500 rounded-full animate-fadeIn"></span>
                        )}
                    </h1>

                </div>

            </div>
            {
                activeTab === "buyurtmalar" ? (
                    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 flex flex-col text-white mt-3 rounded-2xl shadow-xl shadow-slate-950/40 antialiased group hover:border-slate-700 transition-all duration-300">

                        {/* 1. Status bloki (Kutmoqda...) */}
                        <div className="flex justify-center items-center gap-2 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                            <Clock size={18} className="animate-pulse" />
                            <h1 className="font-mono text-sm font-bold tracking-wider uppercase">Kutmoqda...</h1>
                        </div>

                        {/* 2. Ma'lumotlar bloki */}
                        <div className="mt-4 space-y-3.5">

                            {/* Manzil (Joylashuv) */}
                            <div className="flex justify-between items-center bg-slate-950/40 px-3 py-2.5 rounded-xl border border-slate-900/60">
                                <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5">
                                    <MapPin size={14} className="text-indigo-500" /> Manzil
                                </span>
                                <span className="font-mono text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                    1-Xona, 2-Stol
                                </span>
                            </div>

                            {/* Buyurtma vaqti */}
                            <div className="flex justify-between items-center bg-slate-950/40 px-3 py-2.5 rounded-xl border border-slate-900/60">
                                <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5">
                                    <CalendarDays size={14} className="text-indigo-500" /> Vaqt
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                    12:30
                                </span>
                            </div>

                            {/* Taomlar ro'yxati */}
                            <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-900/60">
                                <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5 mb-2.5">
                                    <UtensilsCrossed size={14} className="text-indigo-500" /> Taomlar
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {["Osh", "Shashlik", "Kebab"].map((taom, index) => (
                                        <span
                                            key={index}
                                            className="text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-xl hover:border-slate-700 transition"
                                        >
                                            {taom}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 flex flex-col text-white mt-4 rounded-2xl shadow-2xl shadow-slate-950/50 antialiased">

                        {/* Chek Sarlavhasi */}
                        <div className="flex items-center justify-center gap-2.5 pb-4 border-b border-slate-800/60">
                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                                <CreditCard size={20} />
                            </div>
                            <h1 className="font-mono text-base font-bold tracking-wider uppercase text-slate-200">Elektron Chek</h1>
                        </div>

                        {/* Ma'lumotlar bloki */}
                        <div className="mt-4 space-y-4">

                            {/* Stol haqida ma'lumot */}
                            <div className="flex justify-between items-center bg-slate-950/40 px-3 py-2.5 rounded-xl border border-slate-900">
                                <span className="text-sm font-semibold text-slate-400">Joylashuv:</span>
                                <span className="font-mono text-xs font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                                    1-xona, 2-stol
                                </span>
                            </div>

                            {/* Buyurtmalar ro'yxati */}
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider block mb-2">Buyurtma tarkibi</span>
                                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">

                                    {/* Taom 1 */}
                                    <div className="flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-xl border border-slate-900/60 hover:border-slate-800 transition">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">1x</span>
                                            <span className="text-sm font-medium text-slate-300">Osh</span>
                                        </div>
                                        <span className="font-mono text-sm font-semibold text-slate-400">120 000 so'm</span>
                                    </div>

                                    {/* Taom 2 */}
                                    <div className="flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-xl border border-slate-900/60 hover:border-slate-800 transition">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">2x</span>
                                            <span className="text-sm font-medium text-slate-300">Shashlik</span>
                                        </div>
                                        <span className="font-mono text-sm font-semibold text-slate-400">200 000 so'm</span>
                                    </div>

                                    {/* Taom 3 */}
                                    <div className="flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-xl border border-slate-900/60 hover:border-slate-800 transition">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">1x</span>
                                            <span className="text-sm font-medium text-slate-300">Kebab</span>
                                        </div>
                                        <span className="font-mono text-sm font-semibold text-slate-400">150 000 so'm</span>
                                    </div>

                                </div>
                            </div>

                            {/* To'lov Summasi (Footer) */}
                            <div className="border-t border-slate-800/80 pt-4 mt-2 flex justify-between items-center px-1">
                                <span className="text-sm font-medium text-slate-400">Umumiy summa:</span>
                                <span className="text-xl font-black font-mono text-emerald-400 tracking-tight">
                                    120 000 so'm
                                </span>
                            </div>

                        </div>
                    </div>

                )
            }
        </div>
    );
}

export default BuyurtmalarHeader;
