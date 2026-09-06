import { Utensils, ArrowUpRight } from "lucide-react";

function ProductGrid({
  products,
  activeCategory = "Hammasi",
  searchQuery = "",
  onSelectProduct,
}) {
  let filteredProducts =
    activeCategory === "Hammasi"
      ? products
      : products.filter(
          (p) => p.category?.toLowerCase() === activeCategory?.toLowerCase()
        );

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q)
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center">
        <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-500 mb-3">
          <Utensils size={32} />
        </div>
        <h3 className="text-base font-bold text-slate-200">Mahsulotlar topilmadi</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          {searchQuery
            ? `"${searchQuery}" so'rovi bo'yicha hech qanday taom topilmadi.`
            : "Ushbu kategoriyada hali taomlar mavjud emas."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          onClick={() => onSelectProduct(product.id)}
          className="group relative flex flex-col justify-between p-3 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          {/* Rasm */}
          <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800/80 mb-3">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = "/assets/bg-image.jpg";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <Utensils size={32} />
              </div>
            )}
            <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/70 backdrop-blur-md text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-emerald-400 transition-all">
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Ma'lumotlar */}
          <div className="space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-slate-300 capitalize font-mono">
                  {product.subcategory || product.category}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors mt-1.5 truncate" title={product.name}>
                {product.name}
              </h2>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <p className="text-emerald-400 font-mono font-black text-sm">
                {Number(product.price || 0).toLocaleString()} <span className="text-[11px] font-medium text-slate-400">so'm</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
