import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronLeft, Plus, Minus, CheckCircle, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";

function OfitsiantBuyurtma() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const { products } = useSelector((state) => state.products);

    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [activeSubcategory, setActiveSubcategory] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);

    const mavjudKategoriyalar = [
        ...new Set(products.map(p => p.category?.trim()).filter(Boolean))
    ];

    const mavjudSubKategoriyalar = [
        ...new Set(
            products?.filter(p => p.category?.toLowerCase() === activeCategory?.toLowerCase())
                .map(p => p.subcategory?.trim())
                .filter(Boolean)
        )
    ];

    useEffect(() => {
        if (mavjudKategoriyalar.length > 0 && !activeCategory) {
            setActiveCategory(mavjudKategoriyalar[0]);
        }
    }, [products]);

    useEffect(() => {
        if (mavjudSubKategoriyalar.length > 0) {
            setActiveSubcategory(mavjudSubKategoriyalar[0]);
        } else {
            setActiveSubcategory("");
        }
    }, [activeCategory, products]);

    console.log("Mavjud subkategoriyalar:", mavjudSubKategoriyalar);
    console.log("Mavjud kategoriya:", mavjudKategoriyalar);

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
        if (existing.quantity === 1) {
            setCart(cart.filter(cartItem => cartItem.id !== id));
        } else {
            setCart(cart.map(cartItem => cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem));
        }
    };

    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleConfirmOrder = () => {
        if (cart.length === 0) return alert("Savatcha bo'sh!");
        console.log(`Stol №${tableId} uchun buyurtma:`, cart);
        alert("Buyurtma oshxonaga muvaffaqiyatli yuborildi!");
        setCart([]);
        navigate(-1);
    };

    const filtrgachaBulganTaomlar = products?.filter(item => {
        const kategoriyaMos = item.category?.toLowerCase() === activeCategory?.toLowerCase();

        if (activeSubcategory) {
            return kategoriyaMos && item.subcategory?.toLowerCase() === activeSubcategory?.toLowerCase();
        }
        return kategoriyaMos;
    });

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-white relative">
            <div className="flex-1 p-6 overflow-y-auto border-r border-slate-800">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition cursor-pointer">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold font-mono">Stol №{tableId}</h2>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {mavjudKategoriyalar.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer border ${activeCategory === cat
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {mavjudSubKategoriyalar.length > 0 && (
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 bg-slate-900/30 p-2 rounded-xl border border-slate-900">
                        {mavjudSubKategoriyalar.map(subCat => (
                            <button
                                key={subCat}
                                onClick={() => setActiveSubcategory(subCat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${activeSubcategory === subCat
                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                            >
                                {subCat}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtrgachaBulganTaomlar?.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                            <div>
                                <h4 className="font-bold text-slate-200">{item.name}</h4>
                                <p className="text-sm text-emerald-400 font-mono mt-1">{Number(item.price).toLocaleString()} so'm</p>
                            </div>
                            <button onClick={() => addToCart(item)} className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition cursor-pointer">
                                <Plus size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div
                onClick={() => { setIsCartOpen(true) }}
                className={`absolute bottom-4 right-4 fixed lg:static w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-indigo-500 transition ${isCartOpen ? "hidden" : "flex"
                    }`}
            >
                <ShoppingCart color="#ffffff" />
            </div>


            {
                isCartOpen && (
                    <div className="w-full bg-slate-900/40 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between items-center text-center pb-4">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="text-indigo-400" size={22} />
                                    <h3 className="text-lg font-bold">Savatcha ({cart.length})</h3>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition cursor-pointer">
                                    <ChevronLeft size={24} />
                                    <span className="text-lg font-bold">Yopish</span>
                                </button>
                            </div>

                            <div className="space-y-4 overflow-y-auto max-h-[22vh] pr-1">
                                {cart.length === 0 ? (
                                    <p className="text-slate-500 text-center py-10 text-sm">Hali hech narsa tanlanmadi</p>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h5 className="font-medium text-sm text-slate-200 truncate">{item.name}</h5>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">{(item.price * item.quantity).toLocaleString()} so'm</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-400 cursor-pointer"><Minus size={14} /></button>
                                                <span className="text-sm font-bold font-mono px-1 w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="text-slate-400 hover:text-emerald-400 cursor-pointer"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-400 text-sm">Umumiy summa:</span>
                                <span className="text-xl font-bold font-mono text-emerald-400">{totalSum.toLocaleString()} so'm</span>
                            </div>
                            <button
                                onClick={handleConfirmOrder}
                                disabled={cart.length === 0}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base transition duration-200 ${cart.length === 0
                                    ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 cursor-pointer'
                                    }`}
                            >
                                <CheckCircle size={18} /> Oshxonaga yuborish
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default OfitsiantBuyurtma;
