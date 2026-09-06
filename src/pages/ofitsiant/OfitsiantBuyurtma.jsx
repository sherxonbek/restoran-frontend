import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronLeft, Plus, Minus, CheckCircle, ShoppingCart, Layers, X } from "lucide-react";
import { useSelector } from "react-redux";
import { db } from "@/server/firebase";
import { collection, addDoc } from "firebase/firestore";
import Tasdiqlandi from "@/components/ui/Tasdiqlandi";

function OfitsiantBuyurtma() {
    const { roomId, tableId } = useParams();
    const navigate = useNavigate();

    const { products } = useSelector((state) => state.products);
    const { tables } = useSelector((state) => state.rooms);

    const [cart, setCart] = useState([]);
    // Default holatda "Hammasi" turishi uchun boshlang'ich qiymat berildi
    const [activeCategory, setActiveCategory] = useState("Hammasi");
    const [activeSubcategory, setActiveSubcategory] = useState("Hammasi");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");

    const joriyStolObyekti = tables.find(t => String(t.id) === String(tableId));
    const haqqoniyStolNomi = joriyStolObyekti
        ? (joriyStolObyekti.name.includes("/") ? joriyStolObyekti.name.split("/")[1]?.trim() : joriyStolObyekti.name)
        : `№${tableId}`;

    // Kategoriyalar ro'yxatiga "Hammasi" birinchi element qilib qo'shildi
    const mavjudKategoriyalar = [
        "Hammasi",
        ...new Set(products.map(p => p.category?.trim()).filter(Boolean))
    ];

    // Subkategoriyalar faqat tanlangan kategoriyaga moslab chiqadi
    const mavjudSubKategoriyalar = activeCategory === "Hammasi"
        ? []
        : [
            "Hammasi",
            ...new Set(
                products?.filter(p => p.category?.toLowerCase() === activeCategory?.toLowerCase())
                    .map(p => p.subcategory?.trim())
                    .filter(Boolean)
            )
        ];

    // Har safar asosiy kategoriya o'zgarganda ichki kategoriyani ham "Hammasi" holatiga qaytaramiz
    useEffect(() => {
        if (activeCategory === "Hammasi") {
            setActiveSubcategory("Hammasi");
        } else if (mavjudSubKategoriyalar.length > 0) {
            setActiveSubcategory("Hammasi");
        } else {
            setActiveSubcategory("");
        }
    }, [activeCategory, products]);

    const addToCart = (item) => {
        const existing = cart.find(cartItem => cartItem.id === item.id);
        if (existing) {
            setCart(cart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        const existing = cart.find(cartItem => cartItem.id === id);
        if (!existing) return;
        if (existing.quantity === 1) {
            setCart(cart.filter(cartItem => cartItem.id !== id));
        } else {
            setCart(cart.map(cartItem => cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem));
        }
    };

    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleConfirmOrder = async () => {
        if (cart.length === 0) return alert("Savatcha bo'sh!");

        try {
            const yangiBuyurtma = {
                roomId: roomId || "1",
                tableId: tableId,
                tableName: haqqoniyStolNomi,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalPrice: totalSum,
                status: "yangi",
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, "orders"), yangiBuyurtma);


            setText(`${haqqoniyStolNomi} buyurtma yuborildi!`);
            setIsLoading(true);
            setCart([]);
        } catch (error) {
            console.error("Buyurtma yuborishda xato:", error);
            alert("Xatolik yuz berdi!");
        }
        setTimeout(() => {
            setIsLoading(false);
            setText("");
        }, 2000);
    };

    // "Hammasi" funksionalligi bilan boyitilgan filtrlash logikasi
    const filtrgachaBulganTaomlar = products?.filter(item => {
        if (activeCategory === "Hammasi") return true;

        const kategoriyaMos = item.category?.toLowerCase() === activeCategory?.toLowerCase();

        if (activeSubcategory && activeSubcategory !== "Hammasi") {
            return kategoriyaMos && item.subcategory?.toLowerCase() === activeSubcategory?.toLowerCase();
        }
        return kategoriyaMos;
    });

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-white relative antialiased">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-900 scrollbar-thin">
                {/* Tepa qism: Orqaga qaytish va stol nomi */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 transition-all duration-300 cursor-pointer shadow-md">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <span className="text-xs font-semibold text-slate-500 font-mono tracking-wider uppercase">Buyurtma berish</span>
                        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            {haqqoniyStolNomi} <span className="text-slate-600 font-sans font-light">&bull;</span> <span className="text-indigo-400">Menyu</span>
                        </h2>
                    </div>
                </div>

                {/* Asosiy Kategoriyalar skrolli */}
                <div className="mb-4">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase font-mono tracking-wider">Kategoriyalar</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 mask-linear scrollbar-none">
                        {mavjudKategoriyalar.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer border whitespace-nowrap shadow-sm ${activeCategory === cat
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                                    : 'bg-slate-900/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                    }`}
                            >
                                {cat === "Hammasi" && <Layers size={14} className="inline mr-1.5 mb-0.5" />}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subkategoriyalar (Faqat kerak bo'lganda chiqadi) */}
                {mavjudSubKategoriyalar.length > 0 && (
                    <div className="mb-6 p-2 bg-slate-900/30 border border-slate-900 rounded-2xl">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {mavjudSubKategoriyalar.map(subCat => (
                                <button
                                    key={subCat}
                                    onClick={() => setActiveSubcategory(subCat)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer border whitespace-nowrap ${activeSubcategory === subCat
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20'
                                        : 'bg-slate-950/80 border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                >
                                    {subCat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Taomlar Ro'yxati */}
                <p className="text-xs font-bold text-slate-500 mb-4 uppercase font-mono tracking-wider">Taomlar va Ichimliklar</p>
                {filtrgachaBulganTaomlar?.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-900 rounded-3xl">
                        <p className="text-slate-500 italic text-sm">Ushbu bo'limda taomlar topilmadi.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtrgachaBulganTaomlar?.map(item => {
                            const cartItem = cart.find(c => c.id === item.id);
                            return (
                                <div
                                    key={item.id}
                                    className={`flex justify-between items-center p-3.5 bg-slate-900/40 border rounded-2xl transition-all duration-300 group hover:shadow-xl hover:bg-slate-900/70 hover:scale-[1.01] ${cartItem ? 'border-indigo-500/40 bg-indigo-950/5' : 'border-slate-800/80'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="relative flex-shrink-0">
                                            <img src={item.image || "/assets/placeholder-food.jpg"} alt="" className="w-16 h-16 object-cover rounded-xl shadow-inner border border-slate-800" />
                                            {cartItem && (
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-[10px] font-bold rounded-full flex items-center justify-center border border-slate-950 font-mono animate-scaleIn">
                                                    {cartItem.quantity}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-slate-200 text-sm sm:text-base group-hover:text-white transition truncate">{item.name}</h4>
                                            <p className="text-sm font-semibold text-emerald-400 font-mono mt-1">{Number(item.price).toLocaleString()} so'm</p>
                                        </div>
                                    </div>

                                    {/* Aqlli tugmalar bloki (Savatchada bo'lsa +/- chiqaradi) */}
                                    <div className="flex items-center ml-2">
                                        {cartItem ? (
                                            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
                                                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-xs font-bold font-mono px-0.5 w-4 text-center">{cartItem.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="p-1.5 text-slate-400 hover:text-emerald-400 transition cursor-pointer">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="p-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <button
                onClick={() => setIsCartOpen(true)}
                className={`lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full items-center justify-center shadow-2xl transition-all duration-300 scale-100 hover:scale-105 active:scale-95 cursor-pointer z-40 border border-indigo-400/20 ${isCartOpen ? "hidden" : "flex"
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

            <div className={`w-full lg:w-[420px] bg-slate-900/90 lg:bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 sm:p-6 flex flex-col justify-between h-full fixed lg:static right-0 top-0 z-50 shadow-2xl backdrop-blur-xl lg:backdrop-blur-none transition-all duration-300 ${isCartOpen ? "flex" : "hidden lg:flex"
                }`}>
                <div>
                    {/* Savatcha Headeri */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
                                <ShoppingBag className="text-indigo-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-100">Tanlangan buyurtmalar</h3>
                                <p className="text-[11px] font-medium text-slate-500 font-mono mt-0.5">{totalCount} ta mahsulot</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="lg:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Savatcha elementlari skrolli */}
                    <div className="space-y-3 overflow-y-auto max-h-[55vh] lg:max-h-[62vh] pr-1 scrollbar-thin">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <ShoppingCart size={40} className="text-slate-700 mb-3 stroke-[1.5]" />
                                <p className="text-sm italic">Hali hech narsa tanlanmadi</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center gap-3 p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl hover:border-slate-700/80 transition-all duration-200">
                                    <img src={item.image || "/assets/placeholder-food.jpg"} alt="" className="w-14 h-14 object-cover rounded-xl border border-slate-900 shadow-inner flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-bold text-sm text-slate-200 truncate">{item.name}</h5>
                                        <p className="text-xs font-semibold text-emerald-400 font-mono mt-1">{(item.price * item.quantity).toLocaleString()} so'm</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-400 transition cursor-pointer p-0.5">
                                            <Minus size={13} />
                                        </button>
                                        <span className="text-xs font-bold font-mono px-0.5 w-4 text-center text-slate-200">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="text-slate-400 hover:text-emerald-400 transition cursor-pointer p-0.5">
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
                    {
                        isLoading ? (
                            <Tasdiqlandi pr={text}/>

                        ) : (
                            <div className="flex justify-between items-center mb-4 px-1">
                                <span className="text-slate-400 text-sm font-medium">Umumiy summa:</span>
                                <span className="text-xl font-bold font-mono text-emerald-400 tracking-tight">{totalSum.toLocaleString()} so'm</span>
                            </div>
                        )
                    }


                    <button
                        onClick={handleConfirmOrder}
                        disabled={cart.length === 0}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-base transition-all duration-300 shadow-md ${cart.length === 0
                            ? 'bg-slate-800/50 text-slate-500 border border-slate-800/40 cursor-not-allowed shadow-none'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.99] cursor-pointer'
                            }`}
                    >
                        <CheckCircle size={18} /> Oshxonaga yuborish
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OfitsiantBuyurtma;