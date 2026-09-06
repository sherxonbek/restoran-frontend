import {
  CheckCircle,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import Tasdiqlandi from "@/components/ui/Tasdiqlandi";

function CartDrawer({
  cart,
  isOpen,
  onClose,
  onOpen,
  totalSum,
  totalCount,
  isLoading,
  text,
  onAddToCart,
  onRemoveFromCart,
  onSubmitOrder,
}) {
  return (
    <>
      {/* Mobil suzuvchi (floating) savat tugmasi */}
      <button
        type="button"
        onClick={onOpen}
        className={`lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full items-center justify-center shadow-2xl transition-all duration-300 scale-100 hover:scale-105 active:scale-95 cursor-pointer z-40 border border-indigo-400/20 ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {totalCount > 0 && (
            <span className="absolute -top-2.5 -right-2.5 min-w-5 h-5 px-1 bg-rose-500 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-indigo-600 font-mono">
              {totalCount}
            </span>
          )}
        </div>
      </button>

      {/* Savatcha paneli (Drawer) */}
      <div
        className={`w-full lg:w-[420px] bg-slate-900/90 lg:bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 sm:p-6 flex flex-col justify-between h-full fixed lg:static right-0 top-0 z-50 shadow-2xl backdrop-blur-xl lg:backdrop-blur-none transition-all duration-300 ${
          isOpen ? "flex" : "hidden lg:flex"
        }`}
      >
        <div>
          {/* Savatcha Headeri */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
                <ShoppingBag className="text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Tanlangan buyurtmalar
                </h3>
                <p className="text-[11px] font-medium text-slate-500 font-mono mt-0.5">
                  {totalCount} ta mahsulot
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Savatcha elementlari skrolli */}
          <div className="space-y-3 overflow-y-auto max-h-[55vh] lg:max-h-[62vh] pr-1 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <ShoppingCart
                  size={40}
                  className="text-slate-700 mb-3 stroke-[1.5]"
                />
                <p className="text-sm italic">Hali hech narsa tanlanmadi</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center gap-3 p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl hover:border-slate-700/80 transition-all duration-200"
                >
                  <img
                    src={item.image || "/assets/placeholder-food.jpg"}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-900 shadow-inner flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-slate-200 truncate">
                      {item.name}
                    </h5>
                    <p className="text-xs font-semibold text-emerald-400 font-mono mt-1">
                      {(item.price * item.quantity).toLocaleString()} so'm
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-400 transition cursor-pointer p-0.5"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-xs font-bold font-mono px-0.5 w-4 text-center text-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className="text-slate-400 hover:text-emerald-400 transition cursor-pointer p-0.5"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Savatcha Pastki qismi: Jami summa va Yuborish */}
        <div className="border-t border-slate-800/80 pt-4 mt-4 bg-slate-900/20 lg:bg-transparent">
          {isLoading ? (
            <Tasdiqlandi pr={text} />
          ) : (
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-slate-400 text-sm font-medium">
                Umumiy summa:
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400 tracking-tight">
                {totalSum.toLocaleString()} so'm
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onSubmitOrder}
            disabled={cart.length === 0}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-base transition-all duration-300 shadow-md ${
              cart.length === 0
                ? "bg-slate-800/50 text-slate-500 border border-slate-800/40 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.99] cursor-pointer"
            }`}
          >
            <CheckCircle size={18} /> Oshxonaga yuborish
          </button>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
