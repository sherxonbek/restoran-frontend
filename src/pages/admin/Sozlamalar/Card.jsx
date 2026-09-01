import { useSelector } from "react-redux";

function Card() {

    const { products } = useSelector((state) => state.products);


    return (
        <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
                <div key={product.id} className="bg-gray-700/40 text-white rounded-lg shadow-md p-4 mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-2xl object-cover rounded-md mb-4" />
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-300 font-bold">${product.price}</p>
                </div>
            ))}
        </div>
    )
}

export default Card