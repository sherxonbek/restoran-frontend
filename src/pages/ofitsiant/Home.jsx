import { Grip, House, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  
  const { rooms, loading } = useSelector((state) => state.rooms);

  const xonalarRoyxati = rooms.filter(room => 
    room.type?.toLowerCase() === "xona" || room.category?.toLowerCase() === "xonalar" || !room.type
  );
  
  const zallarRoyxati = rooms.filter(room => 
    room.type?.toLowerCase() === "zal" || room.category?.toLowerCase() === "zallar"
  );
  
  const boshqalarRoyxati = rooms.filter(room => 
    room.type?.toLowerCase() === "boshqa" || room.category?.toLowerCase() === "boshqalar"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="text-lg font-bold font-mono">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen p-4 text-white">
      <div className="flex flex-col gap-6 p-2">
        
        <div>
          <div className="flex items-center gap-2 bg-indigo-600 max-w-max px-4 py-2 rounded-xl shadow-lg">
            <House size={24} className="text-white" />
            <h1 className="text-base font-bold text-white font-mono">Xonalar</h1>
          </div>
          
          {xonalarRoyxati.length === 0 ? (
            <p className="text-xs text-slate-500 italic mt-3 ml-2">Xonalar mavjud emas</p>
          ) : (
            <div className="grid grid-cols-3 mt-4 ml-2 gap-4">
              {xonalarRoyxati.map((room) => (
                <div
                  key={room.id}
                  onClick={() => navigate(`/ofitsiant/xona/${room.id}`)}
                  className="flex flex-col border border-slate-800 bg-slate-900/40 items-center p-5 rounded-xl border-l-4 border-l-indigo-500 hover:border-indigo-400 transition cursor-pointer group"
                >
                  <House size={28} className="text-slate-400 group-hover:text-indigo-400 transition" />
                  <h1 className="text-base font-bold text-slate-200 mt-2 truncate max-w-full">{room.name}</h1>
                  <span className="text-[10px] text-slate-500 mt-1 font-mono">{room.tableCount || 0} ta stol</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 bg-emerald-600 max-w-max px-4 py-2 rounded-xl shadow-lg">
            <Landmark size={24} className="text-white" />
            <h1 className="text-base font-bold text-white font-mono">Zallar</h1>
          </div>
          
          {zallarRoyxati.length === 0 ? (
            <p className="text-xs text-slate-500 italic mt-3 ml-2">Zallar mavjud emas</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 ml-2 gap-4">
              {zallarRoyxati.map((room) => (
                <div
                  key={room.id}
                  onClick={() => navigate(`/ofitsiant/xona/${room.id}`)}
                  className="flex flex-col border border-slate-800 bg-slate-900/40 items-center p-5 rounded-xl border-l-4 border-l-emerald-500 hover:border-emerald-400 transition cursor-pointer group"
                >
                  <Landmark size={28} className="text-slate-400 group-hover:text-emerald-400 transition" />
                  <h1 className="text-base font-bold text-slate-200 mt-2 truncate max-w-full">{room.name}</h1>
                  <span className="text-[10px] text-slate-500 mt-1 font-mono">{room.tableCount || 0} ta stol</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 bg-amber-600 max-w-max px-4 py-2 rounded-xl shadow-lg">
            <Grip size={24} className="text-white" />
            <h1 className="text-base font-bold text-white font-mono">Boshqalar</h1>
          </div>
          
          {boshqalarRoyxati.length === 0 ? (
            <p className="text-xs text-slate-500 italic mt-3 ml-2">Boshqa bo'limlar mavjud emas</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 ml-2 gap-4">
              {boshqalarRoyxati.map((room) => (
                <div
                  key={room.id}
                  onClick={() => navigate(`/ofitsiant/xona/${room.id}`)}
                  className="flex flex-col border border-slate-800 bg-slate-900/40 items-center p-5 rounded-xl border-l-4 border-l-amber-500 hover:border-amber-400 transition cursor-pointer group"
                >
                  <Grip size={28} className="text-slate-400 group-hover:text-amber-400 transition" />
                  <h1 className="text-base font-bold text-slate-200 mt-2 truncate max-w-full">{room.name}</h1>
                  <span className="text-[10px] text-slate-500 mt-1 font-mono">{room.tableCount || 0} ta stol</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;
