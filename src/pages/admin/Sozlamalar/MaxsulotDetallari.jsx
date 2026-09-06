import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct, deleteProduct } from "@/store/slices/productSlice";
import {
  Trash,
  PenLine,
  X,
  Check,
  ArrowLeft,
  Tag,
  CircleDollarSign,
  Layers,
  Plus,
  Minus,
  Scale,
  UtensilsCrossed,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/hooks/useToast";

const parseCompositionValue = (val) => {
  if (!val) return { amount: 0, unit: "g" };
  const str = String(val).trim();
  const match = str.match(/^([\d.]+)\s*(.*)$/);
  if (match) {
    return {
      amount: parseFloat(match[1]) || 0,
      unit: match[2] || "g",
    };
  }
  return { amount: 0, unit: str || "g" };
};

function MaxsulotDetallari() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, selectedProduct, loading } = useSelector((state) => state.products);
  const { toast, showToast } = useToast();

  const product =
    selectedProduct?.id === productId
      ? selectedProduct
      : Array.isArray(products)
      ? products.find((p) => p.id === productId)
      : selectedProduct;

  const [isEditing, setIsEditing] = useState(false);
  const [customForm, setCustomForm] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  // Yangi masalliq qo'shish inputlari
  const [newIngName, setNewIngName] = useState("");
  const [newIngAmount, setNewIngAmount] = useState("");
  const [newIngUnit, setNewIngUnit] = useState("g");

  const editForm = customForm || {
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    composition: product?.composition ? { ...product.composition } : {},
  };

  const existingCategories = useMemo(() => {
    return Array.isArray(products)
      ? [...new Set(products.map((p) => p?.category?.trim()).filter(Boolean))]
      : [];
  }, [products]);

  const existingSubcategories = useMemo(() => {
    return Array.isArray(products)
      ? [
          ...new Set(
            products
              .filter((p) => p?.category?.toLowerCase() === editForm.category?.toLowerCase())
              .map((p) => p?.subcategory?.trim())
              .filter(Boolean)
          ),
        ]
      : [];
  }, [products, editForm.category]);

  useEffect(() => {
    if (productId) {
      dispatch(getProduct(productId));
    }
  }, [dispatch, productId]);

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Mahsulot yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-white max-w-md mx-auto space-y-4">
        <p className="text-slate-400">Mahsulot topilmadi</p>
        <button
          type="button"
          onClick={() => navigate("/admin/sozlamalar/maxsulotlar")}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
        >
          Mahsulotlar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  const startEditing = () => {
    setCustomForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      composition: product.composition ? { ...product.composition } : {},
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setCustomForm(null);
    setNewIngName("");
    setNewIngAmount("");
    setNewIngUnit("g");
  };

  const handleChange = (e) => {
    setCustomForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Masalliq miqdorini +/- orqali o'zgartirish
  const handleAdjustAmount = (key, delta) => {
    const currentVal = editForm.composition?.[key] || "0 g";
    const { amount, unit } = parseCompositionValue(currentVal);
    const step =
      unit === "ta" || unit === "dona" ? 1 : unit === "kg" || unit === "litr" ? 0.1 : 10;
    const newAmount = Math.max(0, +(amount + delta * step).toFixed(2));

    setCustomForm((prev) => ({
      ...prev,
      composition: {
        ...(prev.composition || {}),
        [key]: `${newAmount} ${unit}`,
      },
    }));
  };

  // Masalliq miqdorini input orqali to'g'ridan-to'g'ri o'zgartirish
  const handleUpdateAmountDirect = (key, newAmountStr, currentUnit) => {
    const num = Math.max(0, parseFloat(newAmountStr) || 0);
    setCustomForm((prev) => ({
      ...prev,
      composition: {
        ...(prev.composition || {}),
        [key]: `${num} ${currentUnit}`,
      },
    }));
  };

  // Masalliq o'lchov birligini o'zgartirish
  const handleUpdateUnitDirect = (key, currentAmount, newUnit) => {
    setCustomForm((prev) => ({
      ...prev,
      composition: {
        ...(prev.composition || {}),
        [key]: `${currentAmount} ${newUnit}`,
      },
    }));
  };

  // Masalliqni o'chirish
  const handleDeleteIngredient = (key) => {
    setCustomForm((prev) => {
      const nextComp = { ...(prev.composition || {}) };
      delete nextComp[key];
      return {
        ...prev,
        composition: nextComp,
      };
    });
  };

  // Yangi masalliq qo'shish
  const handleAddNewIngredient = (e) => {
    e?.preventDefault();
    if (!newIngName.trim() || !newIngAmount) return;
    const key = newIngName.trim().toLowerCase();
    const val = `${parseFloat(newIngAmount) || 0} ${newIngUnit.trim()}`;

    setCustomForm((prev) => ({
      ...prev,
      composition: {
        ...(prev.composition || {}),
        [key]: val,
      },
    }));
    setNewIngName("");
    setNewIngAmount("");
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        category: editForm.category.trim(),
        subcategory: editForm.subcategory.trim(),
        composition: editForm.composition || {},
      };
      await dispatch(updateProduct({ id: productId, updatedData: payload })).unwrap();
      showToast("Mahsulot ma'lumotlari muvaffaqiyatli yangilandi!");
      setIsEditing(false);
      setCustomForm(null);
    } catch (error) {
      console.error("Yangilashda xatolik:", error);
      alert("Ma'lumotni saqlab bo'lmadi. Qaytadan urinib ko'ring!");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      setIsDeleted(false);
      navigate("/admin/sozlamalar/maxsulotlar");
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      alert("Maxsulotni o'chirib bo'lmadi. Qaytadan urinib ko'ring!");
    }
  };

  const currentComposition = isEditing ? editForm.composition || {} : product.composition || {};
  const compositionEntries = Object.entries(currentComposition);

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white pb-24 max-w-4xl mx-auto">
      {/* Toast xabarnoma */}
      {toast && (
        <div className="sticky top-2 z-40 p-3 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Header va Orqaga qaytish */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/sozlamalar/maxsulotlar")}
          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer group"
          title="Orqaga"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Check size={16} /> Saqlash
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                <X size={16} /> Bekor qilish
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startEditing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <PenLine size={15} /> Tahrirlash
              </button>
              <button
                type="button"
                onClick={() => setIsDeleted(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-xs transition-all cursor-pointer"
              >
                <Trash size={15} /> O'chirish
              </button>
            </>
          )}
        </div>
      </div>

      {/* Asosiy Kartochka */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-6">
        {/* Rasm */}
        {product.image && (
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = "/assets/bg-image.jpg";
              }}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Parametrlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nomi */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Tag size={14} className="text-indigo-400" />
              Taom Nomi
            </span>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                placeholder="Taom nomi"
                required
                className="w-full p-2.5 rounded-xl bg-slate-900 text-white text-sm border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <h2 className="text-base font-bold text-white">{product.name}</h2>
            )}
          </div>

          {/* Narxi */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <CircleDollarSign size={14} className="text-emerald-400" />
              Narxi
            </span>
            {isEditing ? (
              <input
                type="number"
                name="price"
                value={editForm.price}
                onChange={handleChange}
                placeholder="Narxi"
                required
                className="w-full p-2.5 rounded-xl bg-slate-900 text-white text-sm border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            ) : (
              <p className="text-base font-black font-mono text-emerald-400">
                {Number(product.price || 0).toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-400">so'm</span>
              </p>
            )}
          </div>

          {/* Kategoriya */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Layers size={14} className="text-cyan-400" />
              Kategoriya
            </span>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="category"
                  list="categoryList"
                  value={editForm.category}
                  onChange={handleChange}
                  placeholder="Kategoriyani tanlang yoki yozing"
                  required
                  autoComplete="off"
                  className="w-full p-2.5 rounded-xl bg-slate-900 text-white text-sm border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
                <datalist id="categoryList">
                  {existingCategories.map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-200 capitalize">
                {product.category || "Ko'rsatilmagan"}
              </p>
            )}
          </div>

          {/* Subkategoriya */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Layers size={14} className="text-purple-400" />
              Subkategoriya
            </span>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="subcategory"
                  list="subCategoryList"
                  value={editForm.subcategory}
                  onChange={handleChange}
                  placeholder="Subkategoriya (masalan: lavash, burger)"
                  required
                  autoComplete="off"
                  className="w-full p-2.5 rounded-xl bg-slate-900 text-white text-sm border border-slate-700 focus:outline-none focus:border-purple-500"
                />
                <datalist id="subCategoryList">
                  {existingSubcategories.map((sub, idx) => (
                    <option key={idx} value={sub} />
                  ))}
                </datalist>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-200 capitalize">
                {product.subcategory || "Ko'rsatilmagan"}
              </p>
            )}
          </div>
        </div>

        {/* Masalliqlar / Tarkib bo'limi */}
        <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Taom Tarkibi (Masalliqlar)</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {compositionEntries.length} ta masalliq
            </span>
          </div>

          {/* Masalliqlar ro'yxati */}
          {compositionEntries.length > 0 ? (
            <div className="space-y-2.5">
              {compositionEntries.map(([key, val]) => {
                const { amount, unit } = parseCompositionValue(val);

                if (isEditing) {
                  return (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800"
                    >
                      <span className="text-sm font-semibold text-slate-200 capitalize min-w-[140px]">
                        {key}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Minus tugmasi */}
                        <button
                          type="button"
                          onClick={() => handleAdjustAmount(key, -1)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Kamaytirish"
                        >
                          <Minus size={14} />
                        </button>

                        {/* Miqdor inputi */}
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => handleUpdateAmountDirect(key, e.target.value, unit)}
                          className="w-20 p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-center text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                        />

                        {/* Plus tugmasi */}
                        <button
                          type="button"
                          onClick={() => handleAdjustAmount(key, 1)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Ko'paytirish"
                        >
                          <Plus size={14} />
                        </button>

                        {/* Birlik tanlash */}
                        <select
                          value={unit}
                          onChange={(e) => handleUpdateUnitDirect(key, amount, e.target.value)}
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ta">ta</option>
                          <option value="ml">ml</option>
                          <option value="litr">litr</option>
                        </select>

                        {/* O'chirish tugmasi */}
                        <button
                          type="button"
                          onClick={() => handleDeleteIngredient(key)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer ml-1"
                          title="Masalliqni o'chirish"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                  >
                    <span className="text-xs font-medium text-slate-300 capitalize">{key}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">
              Hozircha masalliqlar tarkibi kiritilmagan.
            </p>
          )}

          {/* Tahrirlash rejimida: Yangi masalliq qo'shish paneli */}
          {isEditing && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Scale size={14} />
                Yangi masalliq qo'shish:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  placeholder="Masalliq nomi (masalan: Pishloq)"
                  className="flex-1 min-w-[160px] p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="number"
                  value={newIngAmount}
                  onChange={(e) => setNewIngAmount(e.target.value)}
                  placeholder="Miqdori"
                  className="w-24 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-center text-white focus:outline-none focus:border-indigo-500 font-mono"
                />

                <select
                  value={newIngUnit}
                  onChange={(e) => setNewIngUnit(e.target.value)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ta">ta</option>
                  <option value="ml">ml</option>
                  <option value="litr">litr</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddNewIngredient}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Plus size={14} /> Qo'shish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleted}
        message={`Haqiqatan ham "${product.name}" mahsulotini o'chirmoqchimisiz?`}
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleted(false)}
      />
    </div>
  );
}

export default MaxsulotDetallari;
