import { useState, useMemo } from "react";
import { X, ChefHat, Search } from "lucide-react";

export default function KitchenSummaryModal({ isOpen, onClose, orders = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Faol buyurtmalardan barcha taomlar yig'indisini hisoblash
  const aggregatedDishes = useMemo(() => {
    const counts = {};

    orders.forEach((o) => {
      // Faqat kutilayotgan yoki tayyorlanayotgan buyurtmalar
      if (
        o.status === "bekor" ||
        o.status === "yakunlandi" ||
        o.status === "tayyor" ||
        o.status === "bajarildi" ||
        o.status === "yetkazildi"
      ) {
        return;
      }

      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const nom = item?.name?.trim() || "Noma'lum taom";
          const qty = Number(item?.quantity) || 1;
          const cat = item?.category || "Boshqa";

          if (!counts[nom]) {
            counts[nom] = {
              name: nom,
              totalQuantity: 0,
              category: cat,
              tables: new Set(),
            };
          }
          counts[nom].totalQuantity += qty;
          if (o.tableName) {
            counts[nom].tables.add(o.tableName);
          }
        });
      }
    });

    return Object.values(counts)
      .map((item) => ({
        ...item,
        tablesList: Array.from(item.tables).join(", "),
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  }, [orders]);

  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return aggregatedDishes;
    return aggregatedDishes.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [aggregatedDishes, searchQuery]);

  if (!isOpen) return null;

  const totalPortions = aggregatedDishes.reduce(
    (acc, curr) => acc + curr.totalQuantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-white max-h-[85vh] flex flex-col">
        {/* Tepa qismi */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ChefHat size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Oshxona Agregatori — Jami Pishirilishi Kerak
              </h2>
              <p className="text-xs text-slate-400">
                Barcha faol stollardagi taomlarning umumiy yig'indisi:{" "}
                <span className="font-bold text-amber-400">
                  {totalPortions} ta porsiya
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Qidiruv */}
        <div className="relative shrink-0">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Taom nomini qidiring..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Taomlar Ro'yxati */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-800/60 pr-1">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {dish.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      Stollar:{" "}
                      <span className="text-slate-300 font-medium">
                        {dish.tablesList || "Stol"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-lg font-black font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                    {dish.totalQuantity}x
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              Hozircha pishirilishi kerak bo'lgan taomlar yo'q
            </div>
          )}
        </div>

        {/* Yopish tugmasi */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
