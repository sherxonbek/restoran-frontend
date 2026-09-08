import { Printer, X, UtensilsCrossed } from "lucide-react";

export default function ReceiptModal({ isOpen, onClose, receiptData }) {
  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    locationName = "Stol",
    waiterName = "Ofitsiant",
    cashierName = "Kassir",
    createdAt = new Date().toISOString(),
    itemsList = [],
    subtotal = 0,
    servicePercent = 10,
    serviceFee = 0,
    discount = 0,
    totalPrice = 0,
    paymentMethod = "naqd",
    cashReceived = 0,
    change = 0,
    receiptNumber = "000000",
  } = receiptData;

  const formattedDate = new Date(createdAt).toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const paymentMethodLabel = {
    naqd: "Naqd pul 💵",
    karta: "Plastik karta (Uzcard/Humo) 💳",
    click: "Click / Payme 📱",
  }[paymentMethod] || "Naqd pul";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      {/* Chop etishda faqat chek qismi ko'rinishi uchun maxsus CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 5mm !important;
            margin: 0 auto;
            color: black !important;
            background: white !important;
            font-size: 12px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-sm bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Yuqori boshqaruv tugmalari (Chop etishda ko'rinmaydi) */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <Printer size={18} />
            <span>Elektron Chek</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chop etiladigan haqiqiy chek qismi */}
        <div
          id="printable-receipt"
          className="p-6 overflow-y-auto font-mono text-xs leading-relaxed text-slate-900 bg-white"
        >
          {/* Logo va Restoran nomi */}
          <div className="text-center pb-3 border-b border-dashed border-slate-400 space-y-1">
            <div className="flex justify-center items-center gap-1 text-slate-800 font-black text-base tracking-wider">
              <UtensilsCrossed size={18} />
              <span>RESTO POS</span>
            </div>
            <p className="text-[11px] text-slate-600 font-sans">
              Mazzali taomlar restorani
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              Tel: +998 (71) 200-00-00
            </p>
          </div>

          {/* Chek ma'lumotlari */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Chek №:</span>
              <span className="font-bold">#{receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sana:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Joylashuv:</span>
              <span className="font-bold">{locationName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ofitsiant:</span>
              <span>{waiterName}</span>
            </div>
            {cashierName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Kassir:</span>
                <span>{cashierName}</span>
              </div>
            )}
          </div>

          {/* Taomlar ro'yxati */}
          <div className="py-2.5 border-b border-dashed border-slate-400">
            <div className="flex justify-between font-bold text-slate-700 pb-1 mb-1 border-b border-slate-200 text-[11px]">
              <span className="w-1/2">Taom nomi</span>
              <span className="w-1/4 text-center">Miq. x Narx</span>
              <span className="w-1/4 text-right">Summa</span>
            </div>
            <div className="space-y-1.5">
              {itemsList.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span className="w-1/2 font-sans truncate pr-1">
                    {item.name}
                  </span>
                  <span className="w-1/4 text-center text-[10px] text-slate-600">
                    {item.quantity}x {Number(item.price).toLocaleString()}
                  </span>
                  <span className="w-1/4 text-right font-bold">
                    {Number(item.total).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hisob-kitob (Summalar) */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">Taomlar jami:</span>
              <span>{Number(subtotal).toLocaleString()} so'm</span>
            </div>
            {serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Xizmat haqi ({servicePercent}%):
                </span>
                <span>{Number(serviceFee).toLocaleString()} so'm</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Chegirma:</span>
                <span>-{Number(discount).toLocaleString()} so'm</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 text-sm font-black border-t border-slate-300">
              <span>JAMI TO'LOV:</span>
              <span className="text-base font-mono">
                {Number(totalPrice).toLocaleString()} so'm
              </span>
            </div>
          </div>

          {/* To'lov usuli va qaytim */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">To'lov turi:</span>
              <span className="font-bold">{paymentMethodLabel}</span>
            </div>
            {paymentMethod === "naqd" && cashReceived > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600">Berilgan pul:</span>
                  <span>{Number(cashReceived).toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Qaytim:</span>
                  <span>{Number(change).toLocaleString()} so'm</span>
                </div>
              </>
            )}
          </div>

          {/* Footer minnatdorchilik */}
          <div className="pt-3 text-center space-y-1">
            <p className="text-[11px] font-sans font-medium text-slate-700">
              Xaridingiz uchun tashakkur!
            </p>
            <p className="text-[9px] font-sans text-slate-500">
              Sizga xizmat ko'rsatganimizdan mamnunmiz!
            </p>
          </div>
        </div>

        {/* Pastki tugmalar (Chop etishda ko'rinmaydi) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer active:scale-98"
          >
            <Printer size={18} />
            <span>Chop etish (Print)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
