import { Minus, Plus } from "lucide-react";

function FoodCard({ item, cartItem, onAddToCart, onRemoveFromCart }) {
  return (
    <div
      className={`flex justify-between items-center p-3.5 bg-slate-900/40 border rounded-2xl transition-all duration-300 group hover:shadow-xl hover:bg-slate-900/70 hover:scale-[1.01] ${
        cartItem ? "border-indigo-500/40 bg-indigo-950/5" : "border-slate-800/80"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative flex-shrink-0">
          <img
            src={item.image || "/assets/placeholder-food.jpg"}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-xl shadow-inner border border-slate-800"
          />
          {cartItem && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-[10px] font-bold rounded-full flex items-center justify-center border border-slate-950 font-mono animate-scaleIn">
              {cartItem.quantity}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-200 text-sm sm:text-base group-hover:text-white transition truncate">
            {item.name}
          </h4>
          <p className="text-sm font-semibold text-emerald-400 font-mono mt-1">
            {Number(item.price).toLocaleString()} so'm
          </p>
        </div>
      </div>

      {/* Savatcha boshqaruv tugmalari */}
      <div className="flex items-center ml-2">
        {cartItem ? (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => onRemoveFromCart(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-bold font-mono px-0.5 w-4 text-center">
              {cartItem.quantity}
            </span>
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="p-1.5 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all duration-300 cursor-pointer shadow-md"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default FoodCard;
