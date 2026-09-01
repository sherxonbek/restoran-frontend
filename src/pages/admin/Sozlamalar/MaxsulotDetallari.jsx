import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "@/server/Slice/productSlice";
import { CircleCheck } from "lucide-react";

function MaxsulotDetallari() {
    const dispatch = useDispatch();
    const { productId } = useParams();
    const { products, loading } = useSelector((state) => state.products);

    useEffect(() => {
        if (productId) {
            dispatch(getProduct(productId));
        }
    }, [dispatch, productId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-lg font-bold">Loading...</div>
            </div>
        );
    }


    if (!products || products.length === 0) {
        return <div className="text-white text-center mt-10">Mahsulot topilmadi</div>;
    }

    return (
        <div className="p-5 text-white bg-gray-800 h-full">
            <img src={products.image} alt={products.name} className="w-full object-cover rounded-2xl" />
            <h1 className="text-xl font-bold mt-4 flex gap-2 items-center"><CircleCheck className="text-green-500" size={18} /> Nomi: <span className="text-xl text-green-400">{products.name}</span></h1>
            <p className="text-white font-bold text-xl flex gap-2 items-center"><CircleCheck className="text-green-500" size={18} /> Narxi: <span className="text-xl text-green-400">{products.price} so'm</span></p>
            <p className="text-white font-bold text-xl flex gap-2 items-center"><CircleCheck className="text-green-500" size={18} /> Kategoriya: <span className="text-xl text-green-400">{products.category}</span></p>
            <p className="text-white font-bold text-xl flex gap-2 items-center"><CircleCheck className="text-green-500" size={18} /> Subkategoriya: <span className="text-xl text-green-400">{products.subcategory}</span></p>
        </div>
    );
}

export default MaxsulotDetallari;
