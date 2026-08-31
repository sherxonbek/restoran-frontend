import { Hamburger, Martini, Salad, CakeSlice, Utensils, GalleryHorizontalEnd, DollarSign } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "@/server/Slice/productSlice"; // thunk import qilindi


function Maxsulotlar() {

    const dispatch = useDispatch();

    const [activeCategory, setActiveCategory] = useState("Hammasi")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [nextModal, setNextModal] = useState(false)
    const [ogohlantir, setOgohlantir] = useState("")

    //maxsulotlarni ma`lumotlari saqlanadigan state lar
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [img, setImg] = useState("")
    const [subCategory, setSubCategory] = useState("")

    // Masaliqlarni saqlash uchun state
    const [composition, setComposition] = useState({});
    const [masalliqNomi, setMasalliqNomi] = useState("");
    const [masalliqMiqdori, setMasalliqMiqdori] = useState("");
    const [miqdorTuri, setMiqdorTuri] = useState("g")

    const { products } = useSelector((state) => state.products);

    const closeModal = () => {
        setIsModalOpen(false);
        setNextModal(false);
        setName("");
        setPrice("");
        setCategory("");
        setSubCategory("");
        setImg("");
        setComposition({});
        setMasalliqNomi("");
        setMasalliqMiqdori("");
    };

    const mavjudSubKategoriyalar = [
        ...new Set(
            products
                .filter(p => p.category?.toLowerCase() === category?.toLowerCase())
                .map(p => p.subcategory?.trim())
                .filter(Boolean)
        )
    ];

    const nextModalHandler = (e) => {
        e.preventDefault();
        if (!name || !price || !category || !img) {
            setOgohlantir("Iltimos, barcha maydonlarni to'ldiring!");

            setTimeout(() => {
                setOgohlantir("");
            }, 4000);
            return;
        }
        if (mavjudSubKategoriyalar.length > 0) {
            setSubCategory(mavjudSubKategoriyalar[0]);
        }

        setNextModal(true);
    };


    const mavjudKategoriyalar = [
        ...new Set(products.map(p => p.category?.trim()).filter(Boolean))
    ];

    const handleAddIngredient = (e) => {
        e.preventDefault();
        if (!masalliqNomi.trim() || !masalliqMiqdori.trim() || !miqdorTuri.trim()) return;

        setComposition(prev => ({
            ...prev,
            [masalliqNomi.trim().toLowerCase()]: `${masalliqMiqdori.trim()} ${miqdorTuri.trim()}`
        }));

        setMasalliqNomi("");
        setMasalliqMiqdori("");
        setMiqdorTuri("");
    };


    const handleDeleteIngredient = (e, masalliqNomi) => {
        e.preventDefault();

        setComposition(prev => {
            const yangiComposition = { ...prev };
            delete yangiComposition[masalliqNomi];
            return yangiComposition;
        });
    };


    const addModalHandler = (e) => {
        e.preventDefault();
        if (Object.keys(composition).length === 0) {
            setOgohlantir("Kamida bitta masalliq qo'shishingiz kerak!");

            setTimeout(() => {
                setOgohlantir("");
            }, 4000);
            return;
        }
        if (!name || !price || !category || !img || !subCategory) {
            setOgohlantir("Iltimos, barcha maydonlarni to'ldiring!");

            setTimeout(() => {
                setOgohlantir("");
            }, 4000);
            return;
        }

        const finalProductData = {
            name: name,
            price: Number(price),
            category: category,
            subcategory: subCategory,
            composition: composition,
            image: img
        };

        dispatch(addProduct(finalProductData));

        setOgohlantir(`Muvaffaqiyatli: ${name} taomlar ro'yxatiga qo'shildi!`);

        setTimeout(() => {
            closeModal();
        }, 1500);
    }

    const categoryIcons = {
        "ichimliklar": <Martini />,
        "salatlar": <Salad />,
        "shirinliklar": <CakeSlice />,
        "nonushta": <Utensils />,
        "fast-food": <Hamburger />,
        "boshqa": <Utensils />
    };

    const dinamikKategoriyalar = [
        {
            id: "all",
            category: "Hammasi",
            icon: <GalleryHorizontalEnd />,
            count: products.length
        }
    ];

    products.forEach((product) => {
        const catName = product.category?.trim();
        if (!catName) return;

        let mavjudCat = dinamikKategoriyalar.find(
            (item) => item.category?.toLowerCase() === catName?.toLowerCase()
        );

        if (!mavjudCat) {
            const formatlanganNom = catName.charAt(0).toUpperCase() + catName.slice(1);

            mavjudCat = {
                id: product.id,
                category: formatlanganNom,
                icon: categoryIcons[catName?.toLowerCase()] || categoryIcons["boshqa"],
                count: 0
            };
            dinamikKategoriyalar.push(mavjudCat);
        }

        mavjudCat.count += 1;
    });


    return (
        <div className="flex flex-col w-full h-screen bg-gray-900 gap-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h1 className="text-white font-extrabold text-lg">
                    Maxsulotlar
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md btn-shadow"
                >
                    + Qo'shish
                </button>
            </div>

            {/* Maxsulotlarni filtirlash */}
            <div className="flex gap-4 px-1 py-2 bg-gray-800  overflow-x-auto ">
                {
                    dinamikKategoriyalar.map((item) => {
                        const isSelected = activeCategory?.toLowerCase() === item.category?.toLowerCase();

                        return (
                            <div
                                onClick={() => setActiveCategory(item.category)}
                                key={item.id}
                                className="relative flex gap-2 bg-amber-700 p-4 rounded-md font-bold text-xl btn-shadow cursor-pointer select-none whitespace-nowrap"
                                style={isSelected ? { backgroundColor: "#f59e0b" } : {}}
                            >
                                {item.icon}
                                <p className="text-white whitespace-nowrap mr-5">{item.category}</p>
                                <p
                                    className="absolute top-0 right-0 border rounded-4xl px-1 bg-black text-blue-400 whitespace-nowrap btn-shadow"
                                    style={isSelected ? { backgroundColor: "#1f5202", color: "white", border: "3px solid darkgreen" } : {}}
                                >
                                    {item.count}
                                </p>
                            </div>
                        )
                    })
                }
            </div>

            {/* maxsulot qo'shish */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm  bg-opacity-50 z-50">
                        <div className="bg-gray-800 p-2 rounded-md w-96">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-white text-lg font-bold">Maxsulot qo'shish</h2>
                                <h1 className="font-extrabold text-red-500 text-xl"
                                    onClick={closeModal}
                                >X</h1>
                            </div>
                            <form>

                                {nextModal ? (
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <div className="flex-1 flex-col gap-2 card p-2 rounded-sm mb-4">
                                            <img src={img} className="w-full  object-cover rounded-t-xl" />
                                            <h1 className="text-white border border-l-4 mt-2 p-2  rounded bg-gray-400 btn-shadow font-light">#{name}</h1>

                                            <div className="flex flex-col gap-1">
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

                                            <p className="text-white flex  mt-3 text-xl items-center"><DollarSign /> {price} so'm</p>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="flex flex-col gap-2 bg-gray-950/40 py-3 px-1 rounded-xl border border-gray-700/50 mt-2">
                                                <label className="text-xs text-indigo-400 font-bold">Taom Tarkibi</label>

                                                <input
                                                    type="text"
                                                    value={masalliqNomi}
                                                    onChange={(e) => setMasalliqNomi(e.target.value)}
                                                    placeholder="Masalliq (go'sht, non)"
                                                    className="flex-1 p-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                                <div className="flex gap-3">
                                                    <input
                                                        type="number"
                                                        value={masalliqMiqdori}
                                                        onChange={(e) => setMasalliqMiqdori(e.target.value)}
                                                        placeholder="Miqdori"
                                                        className="w-22 p-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />

                                                    <select name="turkimi" id="" className="bg-gray-900 border border-gray-700 text-gray-400 outline-none px-1 rounded-xl"
                                                        onChange={(e) => setMiqdorTuri(e.target.value)}
                                                    >
                                                        <option value="g" className="bg-gray-700">g</option>
                                                        <option value="ta" className="bg-gray-700">dona</option>
                                                    </select>

                                                </div>
                                                <button
                                                    onClick={handleAddIngredient}
                                                    className="max-w-max bg-emerald-600 hover:bg-emerald-700 px-3 rounded-xl text-xs font-bold transition-colors"
                                                >
                                                    +
                                                </button>

                                                <div className="flex flex-wrap gap-1.5 mt-2 min-h-[30px]">
                                                    {Object.keys(composition).length > 0 ? (
                                                        Object.entries(composition).map(([key, val]) => (
                                                            <span
                                                                key={key}
                                                                className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-lg bg-gray-900 border border-gray-700 text-slate-300 font-mono capitalize group"
                                                            >
                                                                <span>
                                                                    {key}: <span className="text-indigo-400 font-bold">{val}</span>
                                                                </span>

                                                                <button
                                                                    onClick={(e) => handleDeleteIngredient(e, key)}
                                                                    className="text-slate-500 hover:text-red-400 font-extrabold text-xs pl-1 transition-colors border-l border-gray-700 ml-0.5"
                                                                    title="Masalliqni o'chirish"
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
                                    </div>
                                ) : (
                                    <div className="mb-4 flex flex-col gap-2">
                                        <label htmlFor="img" className="block text-white font-bold ">Rasm: URL</label>
                                        <input
                                            type="text"
                                            id="img"
                                            value={img}
                                            required
                                            onChange={(e) => setImg(e.target.value)}
                                            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                                            placeholder="https://example.com/image.jpg" />
                                        <label htmlFor="name" className="block text-white font-bold ">Nomi:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            required
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                                            placeholder="Maxsulot nomi" />
                                        <label htmlFor="price" className="block text-white font-bold ">Narxi:</label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={price}
                                            required
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                                            placeholder="Maxsulot narxi" />
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="categoryInput" className="text-xs text-slate-400">
                                                Kategoriya (Izlang yoki Yangi yozing):
                                            </label>

                                            {/* Admin yozadigan toza input */}
                                            <input
                                                id="categoryInput"
                                                type="text"
                                                list="categoriesList" // pastdagi datalist bilan bog'laymiz
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)} // Admin harf yozganda state o'zgaradi
                                                required
                                                autoComplete="off"
                                                className="w-full p-2.5 rounded-xl bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white"
                                                placeholder="Masalan: Fast-food yoki Milliy taomlar"
                                            />

                                            {/* Admin harf yozganda b, l, s harflariga qarab avtomat filtrlab taklif qiluvchi oyna */}
                                            <datalist id="categoriesList">
                                                {mavjudKategoriyalar.map((cat, idx) => (
                                                    <option key={idx} value={cat} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    {ogohlantir && (
                                        <p className="text-red-500 text-sm mb-2">
                                            {ogohlantir}
                                        </p>
                                    )}
                                    {
                                        nextModal ? (
                                            <button
                                                onClick={addModalHandler}
                                                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md btn-shadow">
                                                Qo'shish
                                            </button>
                                        ) : (
                                            <button
                                                onClick={nextModalHandler}
                                                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md btn-shadow">
                                                Davom ettirish
                                            </button>
                                        )
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default Maxsulotlar