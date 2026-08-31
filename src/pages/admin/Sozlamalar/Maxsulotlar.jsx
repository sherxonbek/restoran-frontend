import { Hamburger, Martini, Salad, CakeSlice, Utensils, GalleryHorizontalEnd } from "lucide-react"
import { useState } from "react"

function Maxsulotlar() {
    const [activeCategory, setActiveCategory] = useState("Hammasi")


    const Maxsulotlar = [
        {
            id: 1,
            category: "Hammasi",
            icon: <GalleryHorizontalEnd />,
            count: 57
        },
        {
            id: 2,
            category: "Ichimliklar",
            icon: <Martini />,
            count: 15
        },
        {
            id: 3,
            category: "Salatlar",
            icon: <Salad />,
            count: 8
        },
        {
            id: 4,
            category: "Shirinliklar",
            icon: <CakeSlice />,
            count: 17
        },
        {
            id: 5,
            category: "Nonushta",
            icon: <Utensils />,
            count: 5
        },
        {
            id: 6,
            category: "Fast-food",
            icon: <Hamburger />,
            count: 12
        }
    ]

    return (
        <div className="flex flex-col w-full h-screen bg-gray-900 gap-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h1 className="text-white font-extrabold text-lg">
                    Maxsulotlar
                </h1>
                <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md btn-shadow">
                    + Qo'shish
                </button>
            </div>
            {/* Maxsulotlarni filtirlash */}

            <div className="flex gap-4 px-1 py-2 bg-gray-800  overflow-x-auto ">
                {
                    Maxsulotlar.map((item) => {
                        return (
                            <div
                                onClick={() => setActiveCategory(item.category)}
                                key={item.id}
                                className="relative flex gap-2 bg-amber-700 p-4  rounded-md font-bold text-xl"
                                style={activeCategory === item.category ? { backgroundColor: "#f59e0b" } : {}}
                            >
                                {item.icon}
                                <p className="text-white whitespace-nowrap mr-5">{item.category}</p>
                                <p className="absolute top-0 right-0 border rounded-4xl px-1  bg-black text-blue-400 whitespace-nowrap">{item.count}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Maxsulotlar