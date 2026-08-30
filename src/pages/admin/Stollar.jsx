import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { deleteTable, fetchTables, getRoom } from "@/server/Slice/roomSlice";
import { ArrowLeft, Trash2 } from "lucide-react";

function Stollar() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { rooms, tables, loading } = useSelector((state) => state.rooms);

    useEffect(() => {
        if (rooms.length === 0) dispatch(getRoom());
        dispatch(fetchTables());
    }, [dispatch, rooms.length]);

    const joriyXona = rooms.find((r) => r.id === roomId);

    const xonaStollari = tables.filter((t) => t.roomId === roomId);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-white">Yuklanmoqda...</div>;
    }

    return (
        <div className="w-full h-full p-6 text-white bg-slate-950 overflow-y-auto rounded-xl">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/admin/xonalar")}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-indigo-400">
                        {joriyXona ? joriyXona.name : "Xona"} stollari
                    </h2>
                    <p className="text-xs text-slate-400">Umumiy stollar soni: {xonaStollari.length} ta</p>
                </div>
            </div>

            {xonaStollari.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <p className="text-sm text-slate-500 italic">Bu xonada hali stollar yaratilmagan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {xonaStollari.map((table) => {
                        const tozaStolNomi = table.name.split("/")?.[1]?.trim() || table.name;

                        return (
                            <div
                                key={table.id}
                                className="relative flex flex-col items-center justify-center p-6 border border-slate-800 bg-slate-900/50 rounded-2xl shadow-lg hover:border-indigo-500/40 transition-all duration-200 group"
                            >
                                <div className="text-3xl mb-2 select-none">🪑</div>
                                <h4 className="font-mono text-sm font-bold text-slate-200">{tozaStolNomi}</h4>

                                <span className="mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                                    {table.status || "bo'sh"}
                                </span>

                                <button
                                    className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-rose-400 bg-slate-950/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={(e) => {
                                        dispatch(deleteTable({ tableId: table.id, roomId: roomId })); 
                                        e.stopPropagation();
                                    }}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Stollar;
