import { useState } from "react";
import { useSelector } from "react-redux";

function Card() {
    const [praduct, setPraduct] = useState('');

    const { products } = useSelector((state) => state.products);


    return (
        <div >
            <div className="grid grid-cols-2 gap-4 px-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-gray-700/40 text-white rounded-lg shadow-md px-4 py-3 mb-2"
                        onClick={() => setPraduct(product.id)}
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