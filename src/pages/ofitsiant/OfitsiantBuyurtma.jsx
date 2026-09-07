import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import { useCart } from "@/hooks/useCart";
import { formatTableName } from "@/utils/formatters";
import CategoryFilter from "@/components/ofitsiant/CategoryFilter";
import FoodCard from "@/components/ofitsiant/FoodCard";
import CartDrawer from "@/components/ofitsiant/CartDrawer";

function OfitsiantBuyurtma() {
  // 1. Router & Navigatsiya
  const { roomId, tableId } = useParams();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);
  const { rooms = [], tables = [] } = useSelector((state) => state.rooms);
  const { currentUser } = useSelector((state) => state.users);

  const activeUser = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem("current_user") || "{}");
    } catch {
      return {};
    }
  })();

  // 3. Savatcha boshqaruvi (useCart hooki)
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalSum,
    totalCount,
  } = useCart();

  // 4. Lokal UI State'lar
  const [activeCategory, setActiveCategory] = useState("Hammasi");
  const [activeSubcategory, setActiveSubcategory] = useState("Hammasi");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  // 5. Hisoblangan (Derived) ma'lumotlar
  const joriyStolObyekti = tables.find((t) => String(t.id) === String(tableId));
  const haqqoniyStolNomi = formatTableName(joriyStolObyekti?.name, tableId);
  const joriyXonaObyekti = rooms.find((r) => String(r.id) === String(roomId));
  const haqqoniyXonaNomi = joriyXonaObyekti?.name || (roomId ? `${roomId}-Xona` : "1-Xona");

  const mavjudKategoriyalar = [
    "Hammasi",
    ...new Set(products.map((p) => p.category?.trim()).filter(Boolean)),
  ];

  const mavjudSubKategoriyalar =
    activeCategory === "Hammasi"
      ? []
      : [
          "Hammasi",
          ...new Set(
            products
              ?.filter(
                (p) =>
                  p.category?.toLowerCase() === activeCategory?.toLowerCase()
              )
              .map((p) => p.subcategory?.trim())
              .filter(Boolean)
          ),
        ];

  const filtrgachaBulganTaomlar = products?.filter((item) => {
    if (activeCategory === "Hammasi") return true;

    const kategoriyaMos =
      item.category?.toLowerCase() === activeCategory?.toLowerCase();

    if (activeSubcategory && activeSubcategory !== "Hammasi") {
      return (
        kategoriyaMos &&
        item.subcategory?.toLowerCase() === activeSubcategory?.toLowerCase()
      );
    }

    return kategoriyaMos;
  });

  // 6. Hodisa boshqaruvchilari (Handlers)
  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setActiveSubcategory("Hammasi");
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return alert("Savatcha bo'sh!");

    try {
      const yangiBuyurtma = {
        roomId: roomId || "1",
        roomName: haqqoniyXonaNomi,
        tableId,
        tableName: haqqoniyStolNomi,
        waiterId: activeUser?.id || "waiter-1",
        waiterName: activeUser?.fullName || activeUser?.name || "Ofitsiant",
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category || "",
        })),
        totalPrice: totalSum,
        status: "yangi",
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "orders"), yangiBuyurtma);

      setText(`${haqqoniyStolNomi} buyurtma yuborildi!`);
      setIsLoading(true);
      clearCart();
    } catch (error) {
      console.error("Buyurtma yuborishda xato:", error);
      alert("Xatolik yuz berdi!");
    }
    setTimeout(() => {
      setIsLoading(false);
      setText("");
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-white relative antialiased">
      {/* Chap / Asosiy qism: Menyu va taomlar */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-900 scrollbar-thin">
        {/* Tepa qism: Orqaga qaytish va stol nomi */}
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 transition-all duration-300 cursor-pointer shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <span className="text-xs font-semibold text-slate-500 font-mono tracking-wider uppercase">
              Buyurtma berish
            </span>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              {haqqoniyStolNomi}{" "}
              <span className="text-slate-600 font-sans font-light">&bull;</span>{" "}
              <span className="text-indigo-400">Menyu</span>
            </h2>
          </div>
        </div>

        {/* Kategoriyalar filtri */}
        <CategoryFilter
          categories={mavjudKategoriyalar}
          subcategories={mavjudSubKategoriyalar}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onSelectCategory={handleCategorySelect}
          onSelectSubcategory={(subCat) => setActiveSubcategory(subCat)}
        />

        {/* Taomlar Ro'yxati */}
        <p className="text-xs font-bold text-slate-500 mb-4 uppercase font-mono tracking-wider">
          Taomlar va Ichimliklar
        </p>
        {filtrgachaBulganTaomlar?.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-900 rounded-3xl">
            <p className="text-slate-500 italic text-sm">
              Ushbu bo'limda taomlar topilmadi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtrgachaBulganTaomlar?.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                cartItem={cart.find((c) => c.id === item.id)}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* O'ng qism / Modal: Savatcha */}
      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpen={() => setIsCartOpen(true)}
        totalSum={totalSum}
        totalCount={totalCount}
        isLoading={isLoading}
        text={text}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onSubmitOrder={handleConfirmOrder}
      />
    </div>
  );
}

export default OfitsiantBuyurtma;