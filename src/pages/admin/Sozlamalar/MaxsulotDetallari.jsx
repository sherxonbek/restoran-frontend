import { useEffect, useState } from "react"; // useState qo'shildi
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct, updateProduct, deleteProduct } from "@/server/Slice/productSlice";
import { CircleCheck, Trash, PenLine, X, Check } from "lucide-react"; // Yangi ikonalar

function MaxsulotDetallari() {
    const dispatch = useDispatch();
    const { productId } = useParams();
    const { products, loading } = useSelector((state) => state.products);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", price: "", category: "", subcategory: "" });
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        if (productId) {
            dispatch(getProduct(productId));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (products) {
            setEditForm({
                name: products.name || "",
                price: products.price || "",
                category: products.category || "",
                subcategory: products.subcategory || "",
            });
        }
    }, [products]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-lg font-bold">Loading...</div>
            </div>
        );
    }

    if (!products) {
        return <div className="text-white text-center mt-10">Mahsulot topilmadi</div>;
    }

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await dispatch(updateProduct({ id: productId, updatedData: editForm })).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error("Yangilashda xatolik:", error);
            alert("Ma'lumotni saqlab bo'lmadi. Qaytadan urinib ko'ring!");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteProduct(productId)).unwrap();
        } catch (error) {
            console.error("O'chirishda xatolik:", error);
            alert("Maxsulotni o'chirib bo'lmadi. Qaytadan urinib ko'ring!");
        }
    }

    return (
        <div className="relative p-5 text-white bg-gray-800 h-screen">
            <img src={products.image} alt={products.name} className="w-full object-cover rounded-2xl mb-4" />

            <div className="border-b-3 border-gray-700 pb-2 text-xl font-bold mt-4 flex gap-2 items-center">
                <CircleCheck className="text-green-500" size={18} />
                Nomi:
                {isEditing ? (
                    <input type="text" name="name" value={editForm.name} onChange={handleChange} className="bg-gray-700 text-green-400 px-2 py-1 rounded ml-2 border border-gray-600 focus:outline-none w-full" />
                ) : (
                    <span className="text-xl text-green-400 ml-2">{products.name}</span>
                )}
            </div>

            <div className="border-b-3 border-gray-700 pb-2 text-white font-bold text-xl flex gap-2 items-center mt-3">
                <CircleCheck className="text-green-500" size={18} />
                Narxi:
                {isEditing ? (
                    <input type="number" name="price" value={editForm.price} onChange={handleChange} className="bg-gray-700 text-green-400 px-2 py-1 rounded ml-2 border border-gray-600 focus:outline-none w-full" />
                ) : (
                    <span className="text-xl text-green-400 ml-2">{products.price} so'm</span>
                )}
            </div>

            <div className="border-b-3 border-gray-700 pb-2 text-white font-bold text-xl flex gap-2 items-center mt-3">
                <CircleCheck className="text-green-500" size={18} />
                Kategoriya:
                {isEditing ? (
                    <input type="text" name="category" value={editForm.category} onChange={handleChange} className="bg-gray-700 text-green-400 px-2 py-1 rounded ml-2 border border-gray-600 focus:outline-none w-full" />
                ) : (
                    <span className="text-xl text-green-400 ml-2">{products.category}</span>
                )}
            </div>

            <div className="border-b-3 border-gray-300 pb-2 text-white font-bold text-xl flex gap-2 items-center mt-3">
                <CircleCheck className="text-green-500" size={18} />
                Subkategoriya:
                {isEditing ? (
                    <input type="text" name="subcategory" value={editForm.subcategory} onChange={handleChange} className="bg-gray-700 text-green-400 px-2 py-1 rounded ml-2 border border-gray-600 focus:outline-none w-full" />
                ) : (
                    <span className="text-xl text-green-400 ml-2">{products.subcategory}</span>
                )}
            </div>

            <div className="flex justify-between mt-6">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="flex items-center gap-2 font-bold text-xl border px-4 py-2 rounded-2xl bg-green-600 btn-shadow">
                            <Check size={20} /> Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 font-bold text-xl border px-4 py-2 rounded-2xl bg-gray-600 btn-shadow">
                            <X size={20} /> Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 font-bold text-xl border px-4 py-2 rounded-2xl bg-blue-600 btn-shadow">
                            <PenLine size={20} /> Edit
                        </button>
                        <button
                            onClick={() => { setIsDeleted(true) }}
                            className="flex items-center gap-2 font-bold text-xl border px-4 py-2 rounded-2xl bg-red-500 btn-shadow">
                            <Trash size={20} /> Delete
                        </button>
                    </>
                )}
            </div>
            {isDeleted && (
                <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-white w-[400px]">
                        <h2 className="text-xl font-bold mb-4">O'chirishni tasdiqlash</h2>
                        <p className="mb-6">Siz rostdan ham bu maxsulotni o'chirmoqchimisiz?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-all"
                            >
                                Ha, o'chirish
                            </button>
                            <button
                                onClick={() => setIsDeleted(false)}
                                className="bg-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all"
                            >
                                Bekor qilish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MaxsulotDetallari;
