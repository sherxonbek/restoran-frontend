import { Grip, House, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const { rooms, loading } = useSelector((state) => state.rooms);

  const xonalarRoyxati = rooms.filter(
    (room) =>
      room.type?.toLowerCase() === "xona" ||
      room.category?.toLowerCase() === "xonalar" ||
      !room.type
  );

  const zallarRoyxati = rooms.filter(
    (room) =>
      room.type?.toLowerCase() === "zal" ||
      room.category?.toLowerCase() === "zallar"
  );

  const boshqalarRoyxati = rooms.filter(
    (room) =>
      room.type?.toLowerCase() === "boshqa" ||
      room.category?.toLowerCase() === "boshqalar"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] text-white">
        <div className="text-base font-bold font-mono text-slate-400 animate-pulse">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 text-white pb-24 max-w-7xl mx-auto">
      {/* 1. Xonalar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 max-w-max px-4 py-2 rounded-xl text-indigo-400">
          <House size={20} />
          <h1 className="text-sm font-bold font-mono tracking-wide uppercase">Xonalar</h1>
        </div>

        {xonalarRoyxati.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-3">Xonalar mavjud emas</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {xonalarRoyxati.map((room) => (
              <div
                key={room.id}
                onClick={() => navigate(`/ofitsiant/xona/${room.id}`)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 border-l-4 border-l-indigo-500 hover:border-indigo-400/80 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg"
              >
                <House size={26} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <h2 className="text-sm font-bold text-slate-200 mt-2.5 truncate max-w-full text-center">
                  {room.name}
                </h2>
                <span className="text-[11px] text-slate-400 font-mono mt-1">
                  {room.tableCount || 0} ta stol
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Zallar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 max-w-max px-4 py-2 rounded-xl text-emerald-400">
          <Landmark size={20} />
          <h1 className="text-sm font-bold font-mono tracking-wide uppercase">Zallar</h1>
        </div>

        {zallarRoyxati.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-3">Zallar mavjud emas</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {zallarRoyxati.map((room) => (
              <div
                key={room.id}
                onClick={() => navigate(`/ofitsiant/xona/${room.id}`)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 border-l-4 border-l-emerald-500 hover:border-emerald-400/80 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg"
              >
                <Landmark size={26} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                <h2 className="text-sm font-bold text-slate-200 mt-2.5 truncate max-w-full text-center">
                  {room.name}
                </h2>
                <span className="text-[11px] text-slate-400 font-mono mt-1">
                  {room.tableCount || 0} ta stol
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Boshqalar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 max-w-max px-4 py-2 rounded-xl text-amber-400">
          <Grip size={20} />
          <h1 className="text-sm font-bold font-mono tracking-wide uppercase">Boshqalar</h1>
        </div>

        {boshqalarRoyxati.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-3">Boshqa bo'limlar mavjud emas</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {boshqalarRoyxati.map((room) => (
              <div
                key={room.id}
                onClick={() => navigate(`/ofitsiant/xona/${room.id}`)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 border-l-4 border-l-amber-500 hover:border-amber-400/80 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg"
              >
                <Grip size={26} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                <h2 className="text-sm font-bold text-slate-200 mt-2.5 truncate max-w-full text-center">
                  {room.name}
                </h2>
                <span className="text-[11px] text-slate-400 font-mono mt-1">
                  {room.tableCount || 0} ta stol
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
