import { CircleFadingPlus } from "lucide-react"

export const AddBtn = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex gap-3 border w-full items-center justify-center py-4 rounded-2xl text-xl font-bold btn-shadow"
        >
            <CircleFadingPlus /> Qo'shish
        </button>
    )
}