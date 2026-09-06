function ProductCategoryTabs({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar select-none">
      {categories.map((item) => {
        const isSelected =
          activeCategory?.toLowerCase() === item.category?.toLowerCase();

        return (
          <button
            key={item.id || item.category}
            type="button"
            onClick={() => onSelectCategory(item.category)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
              isSelected
                ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/90 hover:border-slate-700"
            }`}
          >
            <span className={isSelected ? "text-emerald-400" : "text-slate-400"}>
              {item.icon}
            </span>
            <span className="font-semibold">{item.category}</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-850 text-slate-400 border border-slate-800"
              }`}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ProductCategoryTabs;
