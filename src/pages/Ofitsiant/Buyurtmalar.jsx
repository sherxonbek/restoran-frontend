import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function BuyurtmalarHeader() {
    const navigate = useNavigate();
    // Faol bo'limni aniqlash uchun state (default: buyurtmalar)
    const [activeTab, setActiveTab] = useState("buyurtmalar");

    return (
        <div className="w-full">
            <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 sticky top-0 z-50 flex items-center min-h-[64px] shadow-lg shadow-slate-950/20">

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
        </div>
    );
}

export default BuyurtmalarHeader;
