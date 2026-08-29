import Close from "@/components/ui/Close"

function Maxsulotlar() {

    const to = "/admin/sozlamalar"
    return (
        <div className="flex flex-col w-full  bg-gray-600 rounded-xl p-4 gap-4">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-lg">Maxsulotlar</h1>
                <Close to={to} />

            </div>
        </div>
    )
}

export default Maxsulotlar