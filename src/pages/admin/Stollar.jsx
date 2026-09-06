import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

import { deleteTable } from "@/store/slices/roomSlice";
import { formatTableName } from "@/utils/formatters";
import ConfirmModal from "@/components/ui/ConfirmModal";

function Stollar({ navg }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rooms, tables, loading } = useSelector((state) => state.rooms);
  const { orders } = useSelector((state) => state.orders);

  const [tableToDelete, setTableToDelete] = useState(null);

  const joriyXona = rooms.find((r) => String(r.id) === String(roomId));
  const xonaStollari = tables.filter((t) => String(t.roomId) === String(roomId));

  const handleConfirmDelete = () => {
    if (tableToDelete) {
      dispatch(deleteTable({ tableId: tableToDelete.id, roomId }));
      setTableToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 text-white bg-slate-950 overflow-y-auto rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(navg)}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-indigo-400">
            {joriyXona ? joriyXona.name : "Xona"} stollari
          </h2>
          <p className="text-xs text-slate-400">
            Umumiy stollar soni: {xonaStollari.length} ta
          </p>
        </div>
      </div>

      {xonaStollari.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <p className="text-sm text-slate-500 italic">
            Bu xonada hali stollar yaratilmagan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {xonaStollari.map((table) => {
            const tozaStolNomi = formatTableName(table.name);
            const stoldaBuyurtmaBor = orders.some(
              (order) =>
                String(order.tableId) === String(table.id) &&
                order.status !== "yopildi"
            );

            return (
              <div
                key={table.id}
                onClick={() => {
                  if (navg === "/ofitsiant") {
                    navigate(
                      `/ofitsiant/buyurtma/xona/${roomId}/stol/${table.id}`
                    );
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-6 border border-slate-800 bg-slate-900/50 rounded-2xl shadow-lg hover:border-indigo-500/40 transition-all duration-200 group ${
                  navg === "/ofitsiant" ? "cursor-pointer" : ""
                }`}
              >
                <div className="text-3xl mb-2 select-none">🪑</div>
                <h4 className="font-mono text-sm font-bold text-slate-200">
                  {tozaStolNomi}
                </h4>

                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full mb-2 ${
                    stoldaBuyurtmaBor
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {stoldaBuyurtmaBor ? "Band" : "Bo'sh"}
                </span>

                {navg === "/admin/xonalar" && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-rose-400 bg-slate-950/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTableToDelete(table);
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* O'chirishni tasdiqlash modali */}
      <ConfirmModal
        isOpen={Boolean(tableToDelete)}
        message={
          <span>
            Haqiqatdan ham <strong>{formatTableName(tableToDelete?.name)}</strong> ni o'chirmoqchimisiz?
          </span>
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setTableToDelete(null)}
      />
    </div>
  );
}

export default Stollar;
