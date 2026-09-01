import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Card() {
    const navigate = useNavigate();
    const { products, loading } = useSelector((state) => state.products);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-white text-lg font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div >
            <div className="grid grid-cols-2 gap-4 px-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-gray-700/40 text-white rounded-lg shadow-md px-4 py-3 mb-2"
                        onClick={() => navigate(`/admin/maxsulotlar/${product.id}`)}
                    >
                        <img src={product.image} alt={product.name} className="w-full h-2xl object-cover rounded-md mb-4" />
                        <h2 className="text-sm font-bold truncate">{product.name}</h2>
                        <span className="text-[10px] text-gray-400 bg-gray-900 px-2 py-0.5 rounded-md mt-1 inline-block capitalize font-mono">
                            {product.subcategory}
                        </span>
                        <p className="text-emerald-400 font-mono font-black text-sm mt-2">
                            {Number(product.price).toLocaleString()} so'm
                        </p>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default Card