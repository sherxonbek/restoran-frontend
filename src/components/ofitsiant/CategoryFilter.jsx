import { Layers } from "lucide-react";

function CategoryFilter({
  categories,
  subcategories,
  activeCategory,
  activeSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}) {
  return (
    <>
      {/* Asosiy Kategoriyalar */}
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-500 mb-2 uppercase font-mono tracking-wider">
          Kategoriyalar
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 mask-linear scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer border whitespace-nowrap shadow-sm ${
                activeCategory === cat
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]"
                  : "bg-slate-900/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {cat === "Hammasi" && <Layers size={14} className="inline mr-1.5 mb-0.5" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subkategoriyalar */}
      {subcategories.length > 0 && (
        <div className="mb-6 p-2 bg-slate-900/30 border border-slate-900 rounded-2xl">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {subcategories.map((subCat) => (
              <button
                key={subCat}
                type="button"
                onClick={() => onSelectSubcategory(subCat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer border whitespace-nowrap ${
                  activeSubcategory === subCat
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-950/80 border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {subCat}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default CategoryFilter;
