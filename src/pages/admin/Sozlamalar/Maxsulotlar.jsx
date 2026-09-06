import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Hamburger,
  Martini,
  Salad,
  CakeSlice,
  Utensils,
  GalleryHorizontalEnd,
} from "lucide-react";

import { addProduct } from "@/store/slices/productSlice";
import { useToast } from "@/hooks/useToast";
import ProductCategoryTabs from "@/components/admin/mahsulotlar/ProductCategoryTabs";
import ProductGrid from "@/components/admin/mahsulotlar/ProductGrid";
import AddProductModal from "@/components/admin/mahsulotlar/AddProductModal";
import BackButton from "@/components/ui/BackButton";
import SearchInput from "@/components/ui/SearchInput";
import HeaderAddButton from "@/components/ui/HeaderAddButton";

const CATEGORY_ICONS = {
  ichimliklar: <Martini size={18} />,
  salatlar: <Salad size={18} />,
  shirinliklar: <CakeSlice size={18} />,
  nonushta: <Utensils size={18} />,
  "fast-food": <Hamburger size={18} />,
  boshqa: <Utensils size={18} />,
};

function Maxsulotlar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products: rawProducts = [], loading } = useSelector((state) => state.products);
  const products = useMemo(() => (Array.isArray(rawProducts) ? rawProducts : []), [rawProducts]);

  const [activeCategory, setActiveCategory] = useState("Hammasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Maxsus useToast hooki
  const { toast: successToast, showToast } = useToast();

  const handleSaveProduct = async (productData) => {
    await dispatch(addProduct(productData));
    showToast(`Muvaffaqiyatli: ${productData.name} taomlar ro'yxatiga qo'shildi!`);
    setIsModalOpen(false);
  };

  // Dinamik kategoriyalar va ulardagi mahsulotlar soni
  const dinamikKategoriyalar = useMemo(() => {
    const cats = [
      {
        id: "all",
        category: "Hammasi",
        icon: <GalleryHorizontalEnd size={18} />,
        count: products.length,
      },
    ];

    products.forEach((product) => {
      const catName = product?.category?.trim();
      if (!catName) return;

      let mavjudCat = cats.find(
        (item) => item.category?.toLowerCase() === catName?.toLowerCase()
      );

      if (!mavjudCat) {
        const formatlanganNom = catName.charAt(0).toUpperCase() + catName.slice(1);
        mavjudCat = {
          id: product.id || catName,
          category: formatlanganNom,
          icon: CATEGORY_ICONS[catName.toLowerCase()] || CATEGORY_ICONS.boshqa,
          count: 0,
        };
        cats.push(mavjudCat);
      }

      mavjudCat.count += 1;
    });

    return cats;
  }, [products]);

  const existingCategories = useMemo(
    () => [...new Set(products.map((p) => p?.category?.trim()).filter(Boolean))],
    [products]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Mahsulotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white pb-24 max-w-7xl mx-auto">
      {/* Toast xabarnoma */}
      {successToast && (
        <div className="sticky top-2 z-40 p-3 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {successToast}
        </div>
      )}

      {/* 1. Header boshqaruv paneli (Ortga, Qidiruv, Qo'shish) */}
      <div className="relative p-4 sm:p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          {/* Ortga qaytish */}
          <BackButton className="order-1" />

          {/* O'rtadagi qidiruv inputi */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="order-3 sm:order-2 w-full sm:flex-1 sm:max-w-xl"
          />

          {/* Yangi Taom Qo'shish */}
          <HeaderAddButton
            onClick={() => setIsModalOpen(true)}
            className="order-2 sm:order-3"
          />
        </div>
      </div>

      {/* 2. Kategoriyalar gorizontal tablari */}
      <ProductCategoryTabs
        categories={dinamikKategoriyalar}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* 3. Mahsulotlar ro'yxati (Grid) */}
      {products.length > 0 ? (
        <ProductGrid
          products={products}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onSelectProduct={(id) => navigate(`/admin/maxsulotlar/${id}`)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
            <Utensils size={36} />
          </div>
          <h2 className="text-lg font-bold text-white">Hozircha mahsulotlar mavjud emas</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Menyuga taomlar qo'shish uchun yuqoridagi tugmadan foydalaning.
          </p>
        </div>
      )}

      {/* Mahsulot qo'shish modali */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        existingCategories={existingCategories}
        existingProducts={products}
      />
    </div>
  );
}

export default Maxsulotlar;