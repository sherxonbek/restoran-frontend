import { useState } from "react";
import { DollarSign } from "lucide-react";

function AddProductModal({
  isOpen,
  onClose,
  onSave,
  existingCategories = [],
  existingProducts = [],
}) {
  const [step, setStep] = useState(1);
  const [warning, setWarning] = useState("");

  // Mahsulot asosiy ma'lumotlari
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [img, setImg] = useState("");

  // Masalliqlar ma'lumotlari
  const [composition, setComposition] = useState({});
  const [masalliqNomi, setMasalliqNomi] = useState("");
  const [masalliqMiqdori, setMasalliqMiqdori] = useState("");
  const [miqdorTuri, setMiqdorTuri] = useState("g");

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setName("");
    setPrice("");
    setCategory("");
    setSubCategory("");
    setImg("");
    setComposition({});
    setMasalliqNomi("");
    setMasalliqMiqdori("");
    setMiqdorTuri("g");
    setWarning("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const showWarning = (msg) => {
    setWarning(msg);
    setTimeout(() => setWarning(""), 4000);
  };

  // Tanlangan kategoriyaga mos mavjud subkategoriyalar
  const mavjudSubKategoriyalar = [
    ...new Set(
      existingProducts
        .filter((p) => p.category?.toLowerCase() === category?.toLowerCase())
        .map((p) => p.subcategory?.trim())
        .filter(Boolean)
    ),
  ];

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!name || !price || !category || !img) {
      showWarning("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    if (mavjudSubKategoriyalar.length > 0 && !subCategory) {
      setSubCategory(mavjudSubKategoriyalar[0]);
    }
    setStep(2);
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!masalliqNomi.trim() || !masalliqMiqdori.trim() || !miqdorTuri.trim()) return;

    setComposition((prev) => ({
      ...prev,
      [masalliqNomi.trim().toLowerCase()]: `${masalliqMiqdori.trim()} ${miqdorTuri.trim()}`,
    }));

    setMasalliqNomi("");
    setMasalliqMiqdori("");
  };

  const handleDeleteIngredient = (e, key) => {
    e.preventDefault();
    setComposition((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(composition).length === 0) {
      showWarning("Kamida bitta masalliq qo'shishingiz kerak!");
      return;
    }
    if (!name || !price || !category || !img || !subCategory) {
      showWarning("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const finalProductData = {
      name,
      price: Number(price),
      category,
      subcategory: subCategory,
      composition,
      image: img,
    };

    onSave(finalProductData);
    resetForm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-50 animate-in fade-in">
      <div className="bg-gray-800 p-5 rounded-2xl w-96 max-w-[92vw] border border-gray-700 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-white text-base font-bold">
            {step === 1 ? "Yangi mahsulot qo'shish" : "Tarkib va subkategoriya"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="font-extrabold text-red-400 hover:text-red-500 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
          {step === 1 ? (
            <div className="mb-4 flex flex-col gap-3">
              <div>
                <label htmlFor="prod-img" className="block text-xs font-semibold text-gray-300 mb-1">
                  Rasm URL manzili:
                </label>
                <input
                  type="text"
                  id="prod-img"
                  value={img}
                  required
                  onChange={(e) => setImg(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-900 text-white text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="prod-name" className="block text-xs font-semibold text-gray-300 mb-1">
                  Mahsulot nomi:
                </label>
                <input
                  type="text"
                  id="prod-name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-900 text-white text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masalan: Lavash, Cola"
                />
              </div>

              <div>
                <label htmlFor="prod-price" className="block text-xs font-semibold text-gray-300 mb-1">
                  Narxi (so'm):
                </label>
                <input
                  type="number"
                  id="prod-price"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-900 text-white text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masalan: 35000"
                />
              </div>

              <div>
                <label htmlFor="prod-category" className="block text-xs font-semibold text-gray-300 mb-1">
                  Kategoriya:
                </label>
                <input
                  id="prod-category"
                  type="text"
                  list="categoriesList"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full p-2.5 rounded-xl bg-gray-900 text-white text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tanlang yoki yangi kiriting"
                />
                <datalist id="categoriesList">
                  {existingCategories.map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex gap-3 items-center bg-gray-900/60 p-2.5 rounded-xl border border-gray-700/60">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-700" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{name}</h4>
                  <p className="text-emerald-400 font-mono text-xs flex items-center mt-0.5">
                    <DollarSign size={12} /> {Number(price).toLocaleString()} so'm
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="subCategoryInput" className="block text-xs font-semibold text-gray-300 mb-1">
                  Subkategoriya:
                </label>
                <input
                  id="subCategoryInput"
                  type="text"
                  list="subCategoriesList"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full p-2.5 rounded-xl bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white"
                  placeholder="Masalan: burger, pizza, lavash"
                />
                <datalist id="subCategoriesList">
                  {mavjudSubKategoriyalar.map((sub, idx) => (
                    <option key={idx} value={sub} />
                  ))}
                </datalist>
              </div>

              {/* Masalliqlar bloki */}
              <div className="flex flex-col gap-2 bg-gray-950/50 p-3 rounded-xl border border-gray-700/50">
                <label className="text-xs text-indigo-400 font-bold">Taom Tarkibi (Masalliqlar):</label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={masalliqNomi}
                    onChange={(e) => setMasalliqNomi(e.target.value)}
                    placeholder="Masalliq nomi"
                    className="flex-1 p-2 rounded-lg bg-gray-900 border border-gray-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    value={masalliqMiqdori}
                    onChange={(e) => setMasalliqMiqdori(e.target.value)}
                    placeholder="Miqdori"
                    className="w-16 p-2 rounded-lg bg-gray-900 border border-gray-700 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <select
                    value={miqdorTuri}
                    onChange={(e) => setMiqdorTuri(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-gray-300 text-xs px-2 rounded-lg outline-none"
                  >
                    <option value="g">g</option>
                    <option value="ta">dona</option>
                    <option value="ml">ml</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2 min-h-[30px] max-h-[80px] overflow-y-auto">
                  {Object.keys(composition).length > 0 ? (
                    Object.entries(composition).map(([key, val]) => (
                      <span
                        key={key}
                        className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-lg bg-gray-900 border border-gray-700 text-slate-300 font-mono capitalize"
                      >
                        <span>
                          {key}: <span className="text-indigo-400 font-bold">{val}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteIngredient(e, key)}
                          className="text-slate-500 hover:text-red-400 font-extrabold text-xs pl-1 transition-colors border-l border-gray-700 ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">Hali masalliq qo'shilmadi...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {warning && <p className="text-red-400 text-xs mb-3 font-semibold text-center">{warning}</p>}

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-700">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Ortga
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-blue-600/20"
            >
              {step === 1 ? "Davom ettirish" : "Qo'shish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
