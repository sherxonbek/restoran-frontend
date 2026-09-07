import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Package,
  AlertTriangle,
  Boxes,
  ArrowDownRight,
  ArrowUpRight,
  History,
  LayoutGrid,
  Table as TableIcon,
  Filter,
  Trash2,
  User,
  DollarSign,
} from "lucide-react";

import {
  addStockItem,
  stockIn,
  stockOut,
  deleteStockItem,
  seedInitialStock,
} from "@/store/slices/inventorySlice";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatters";

import SearchInput from "@/components/ui/SearchInput";
import HeaderAddButton from "@/components/ui/HeaderAddButton";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AddStockModal from "@/components/admin/ombor/AddStockModal";
import StockActionModal from "@/components/admin/ombor/StockActionModal";

function Ombor() {
  const dispatch = useDispatch();
  const { items = [], history = [] } = useSelector((state) => state.inventory);
  const { toast, showToast } = useToast();

  // Holatlar
  const [activeTab, setActiveTab] = useState("qoldiq"); // "qoldiq" | "tarix"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "low" | "ok" | "empty"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Modallar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionModalData, setActionModalData] = useState({
    isOpen: false,
    item: null,
    type: "kirim",
  });
  const [deleteModalData, setDeleteModalData] = useState({
    isOpen: false,
    item: null,
  });

  // Dinamik kategoriyalar
  const categories = useMemo(() => {
    const list = ["Hammasi"];
    items.forEach((i) => {
      if (i.category && !list.includes(i.category)) {
        list.push(i.category);
      }
    });
    return list;
  }, [items]);

  // 1. KPI hisob-kitoblari
  const jamiXil = items.length;

  const jamiQiymat = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.quantity * curr.costPrice, 0);
  }, [items]);

  const kamQolganlar = useMemo(() => {
    return items.filter((i) => i.quantity <= i.minStock && i.quantity > 0);
  }, [items]);

  // 2. Filtrlangan tovarlar
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Qidiruv
      const searchMatch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.supplier &&
          item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));

      // Kategoriya
      const categoryMatch =
        selectedCategory === "Hammasi" || item.category === selectedCategory;

      // Status
      let statusMatch = true;
      if (statusFilter === "low") {
        statusMatch = item.quantity <= item.minStock && item.quantity > 0;
      } else if (statusFilter === "ok") {
        statusMatch = item.quantity > item.minStock;
      } else if (statusFilter === "empty") {
        statusMatch = item.quantity <= 0;
      }

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [items, searchQuery, selectedCategory, statusFilter]);

  // Handlers
  const handleSaveNewStock = async (newItem) => {
    try {
      await dispatch(addStockItem(newItem)).unwrap();
      showToast(`Muvaffaqiyatli: "${newItem.name}" omborga qo'shildi!`);
    } catch (err) {
      showToast(`Xatolik: ${err || "Saqlashda xatolik yuz berdi"}`);
    }
  };

  const handleOpenActionModal = (item, type) => {
    setActionModalData({
      isOpen: true,
      item,
      type,
    });
  };

  const handleConfirmAction = async (payload) => {
    try {
      if (actionModalData.type === "kirim") {
        await dispatch(stockIn(payload)).unwrap();
        showToast(
          `Kirim qilindi: +${payload.quantity} ${actionModalData.item.unit} ${actionModalData.item.name}`
        );
      } else {
        await dispatch(stockOut(payload)).unwrap();
        showToast(
          `Chiqim qilindi: -${payload.quantity} ${actionModalData.item.unit} ${actionModalData.item.name}`
        );
      }
    } catch (err) {
      showToast(`Xatolik: ${err || "Amalni bajarib bo'lmadi"}`);
    }
  };

  const handleRequestDelete = (item) => {
    setDeleteModalData({
      isOpen: true,
      item,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModalData.item) {
      try {
        await dispatch(deleteStockItem(deleteModalData.item.id)).unwrap();
        showToast(`"${deleteModalData.item.name}" ombordan o'chirildi!`);
      } catch (err) {
        showToast(`Xatolik: ${err || "O'chirishda xatolik yuz berdi"}`);
      }
    }
    setDeleteModalData({ isOpen: false, item: null });
  };

  const handleSeedData = async () => {
    try {
      showToast("Boshlang'ich mahsulotlar bazaga yuklanmoqda...");
      await dispatch(seedInitialStock()).unwrap();
      showToast("Barcha mahsulotlar muvaffaqiyatli bazaga yuklandi!");
    } catch (err) {
      showToast(`Yuklashda xatolik: ${err}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white pb-24 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Toast */}
      {toast && (
        <div className="sticky top-2 z-40 p-3 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {toast}
        </div>
      )}

      {/* 1. Yuqori Hero & Header */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 tracking-wider uppercase">
              <Boxes size={14} /> Omborxona va Ta'minot Nazorati
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Zaxira & Sklad Boshqaruvi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Xom-ashyolar hisobi, kirim-chiqim operatsiyalari va xavfsiz qoldiq nazorati
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tab switcher: Qoldiq vs Tarix */}
            <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("qoldiq")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "qoldiq"
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Package size={15} />
                Zaxira Qoldiqlari
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tarix")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "tarix"
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <History size={15} />
                Harakatlar Tarixi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 ta Glassmorphic KPI Kartochkalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jami Xil */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-amber-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
              <Boxes size={22} />
            </div>
            <span className="text-[11px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
              Faol
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Xom-ashyolar Turi
            </p>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              {jamiXil} <span className="text-xs font-normal text-slate-400">xil tovar</span>
            </h2>
          </div>
        </div>

        {/* Zaxira Qiymati */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-emerald-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <DollarSign size={22} />
            </div>
            <span className="text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
              Baho
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Umumiy Zaxira Qiymati
            </p>
            <h2 className="text-2xl font-black text-emerald-400 tracking-tight mt-0.5">
              {formatCurrency(jamiQiymat)}
            </h2>
          </div>
        </div>

        {/* Kam Qolganlar */}
        <div
          onClick={() => setStatusFilter(statusFilter === "low" ? "all" : "low")}
          className={`p-5 rounded-2xl backdrop-blur-xl border shadow-xl transition-all duration-300 cursor-pointer group ${
            kamQolganlar.length > 0
              ? "bg-rose-950/20 border-rose-500/30 hover:border-rose-500"
              : "bg-slate-900/60 border-slate-800/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`p-2.5 rounded-xl border ${
                kamQolganlar.length > 0
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <AlertTriangle size={22} />
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                kamQolganlar.length > 0
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {kamQolganlar.length > 0 ? "Diqqat!" : "Hammasi joyida"}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Kam Qolgan Tovar
            </p>
            <h2
              className={`text-2xl font-black tracking-tight mt-0.5 ${
                kamQolganlar.length > 0 ? "text-rose-400" : "text-white"
              }`}
            >
              {kamQolganlar.length}{" "}
              <span className="text-xs font-normal text-slate-400">nomdagi</span>
            </h2>
          </div>
        </div>

        {/* Jami Harakatlar */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-indigo-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
              <History size={22} />
            </div>
            <span className="text-[11px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full">
              Jurnal
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Amallar Tarixi
            </p>
            <h2 className="text-2xl font-black text-indigo-400 tracking-tight mt-0.5">
              {history.length}{" "}
              <span className="text-xs font-normal text-slate-400">operatsiya</span>
            </h2>
          </div>
        </div>
      </div>

      {/* 3. Kritik Zaxiralar Ogohlantirish Paneli (agar kam qolgan bo'lsa) */}
      {kamQolganlar.length > 0 && activeTab === "qoldiq" && (
        <div className="p-4 sm:p-5 rounded-3xl bg-rose-950/30 border border-rose-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-200">
                Diqqat: {kamQolganlar.length} ta mahsulot zaxirasi kritik darajada kam!
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Ta'minotchilarga buyurtma berish tavsiya etiladi:{" "}
                <span className="font-semibold text-white">
                  {kamQolganlar.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(", ")}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter("low")}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start md:self-auto shadow-md shadow-rose-600/30"
          >
            Faqat Kam Qolganlarni Ko'rish
          </button>
        </div>
      )}

      {/* ===================== TAB 1: ZAXIRA QOLDIQLARI ===================== */}
      {activeTab === "qoldiq" && (
        <div className="space-y-5">
          {/* Boshqaruv qatori: Qidiruv, Qo'shish, Ko'rinish */}
          <div className="p-4 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
              {/* Qidiruv */}
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Xom-ashyo yoki ta'minotchi qidiring..."
                className="order-3 sm:order-1 w-full sm:flex-1 sm:max-w-md"
              />

              {/* Ko'rinish almashtirgich (Grid / Table) */}
              <div className="order-2 flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Kartochkalar (Grid)"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Jadval (Table)"
                >
                  <TableIcon size={16} />
                </button>
              </div>

              {/* Yangi Xom-ashyo Qo'shish */}
              <HeaderAddButton
                text="Xom-ashyo Qo'shish"
                onClick={() => setIsAddModalOpen(true)}
                className="order-1 sm:order-3 !bg-amber-600 hover:!bg-amber-500 shadow-amber-600/20"
              />
            </div>

            {/* Filtrlar: Kategoriyalar va Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/70">
              {/* Kategoriya pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                        : "bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Holat filtri */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter size={14} className="text-slate-500" />
                {[
                  { id: "all", label: "Barchasi" },
                  { id: "low", label: "Kam qolgan" },
                  { id: "ok", label: "Yetarli" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      statusFilter === st.id
                        ? "bg-slate-700 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mahsulotlar ro'yxati: Grid ko'rinishi */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.minStock && item.quantity > 0;
                const isEmpty = item.quantity <= 0;
                const percent = Math.min(
                  100,
                  Math.round((item.quantity / (item.minStock * 2 || 1)) * 100)
                );

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between p-5 rounded-3xl backdrop-blur-xl border transition-all duration-300 group hover:shadow-2xl ${
                      isEmpty
                        ? "bg-slate-900/60 border-rose-900/50 hover:border-rose-500/50"
                        : isLow
                        ? "bg-slate-900/60 border-amber-500/30 hover:border-amber-500/60"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      {/* Kategoriya va Status badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 truncate">
                          {item.category}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isEmpty
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : isLow
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {isEmpty ? "Tugagan" : isLow ? "Kam qoldi" : "Yetarli"}
                        </span>
                      </div>

                      {/* Tovar nomi */}
                      <h3 className="text-base font-bold text-white tracking-tight mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Ta'minotchi:{" "}
                        <span className="text-slate-300 font-medium">
                          {item.supplier || "Noma'lum"}
                        </span>
                      </p>

                      {/* Qoldiq miqdori (Katta raqam) */}
                      <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-400">Hozirgi qoldiq:</span>
                          <span
                            className={`text-2xl font-black font-mono ${
                              isEmpty
                                ? "text-rose-400"
                                : isLow
                                ? "text-amber-400"
                                : "text-white"
                            }`}
                          >
                            {item.quantity}{" "}
                            <span className="text-xs font-normal text-slate-400">
                              {item.unit}
                            </span>
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isEmpty
                                ? "bg-rose-500 w-0"
                                : isLow
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                          <span>Min: {item.minStock} {item.unit}</span>
                          <span>{formatCurrency(item.costPrice)} / {item.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pastki tezkor amallar (Kirim + / Chiqim -) */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => handleOpenActionModal(item, "kirim")}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                        title="Kirim qilish (+)"
                      >
                        <ArrowDownRight size={15} /> Kirim (+)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenActionModal(item, "chiqim")}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                        title="Chiqim / Sarf (-)"
                      >
                        <ArrowUpRight size={15} /> Chiqim (-)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRequestDelete(item)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Jadval (Table) ko'rinishi */
            <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Tovar Nomi</th>
                      <th className="p-4">Kategoriya</th>
                      <th className="p-4">Mavjud Qoldiq</th>
                      <th className="p-4">Min. Zaxira</th>
                      <th className="p-4">Birlik Narxi</th>
                      <th className="p-4">Jami Qiymat</th>
                      <th className="p-4 text-right">Tezkor Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/50">
                    {filteredItems.map((item) => {
                      const isLow = item.quantity <= item.minStock && item.quantity > 0;
                      const isEmpty = item.quantity <= 0;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="p-4 font-bold text-white">
                            <p>{item.name}</p>
                            <p className="text-[10px] text-slate-500 font-normal">
                              {item.supplier || "Noma'lum ta'minotchi"}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold uppercase bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-slate-400">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-mono font-bold text-sm ${
                                isEmpty
                                  ? "text-rose-400"
                                  : isLow
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {item.quantity} {item.unit}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 font-mono">
                            {item.minStock} {item.unit}
                          </td>
                          <td className="p-4 text-slate-300 font-mono">
                            {formatCurrency(item.costPrice)}
                          </td>
                          <td className="p-4 text-white font-bold font-mono">
                            {formatCurrency(item.quantity * item.costPrice)}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenActionModal(item, "kirim")}
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                                title="Kirim (+)"
                              >
                                <ArrowDownRight size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenActionModal(item, "chiqim")}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                                title="Chiqim (-)"
                              >
                                <ArrowUpRight size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRequestDelete(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs flex flex-col items-center justify-center gap-3">
              <Boxes size={32} className="text-slate-600" />
              <p>
                {items.length === 0
                  ? "Omborxona bazasida mahsulotlar mavjud emas."
                  : "Qidiruv bo'yicha mos keluvchi xom-ashyolar topilmadi"}
              </p>
              {items.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedData}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold transition-all cursor-pointer text-xs"
                >
                  Boshlang'ich 12 ta xom-ashyoni bazaga yuklash
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: HARAKATLAR TARIXI ===================== */}
      {activeTab === "tarix" && (
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl overflow-hidden animate-in fade-in duration-300">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History size={18} className="text-amber-400" />
                Kirim va Chiqim Jurnali
              </h3>
              <p className="text-xs text-slate-400">
                Omborda amalga oshirilgan barcha xaridlar va sarflar qaydlari
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Jami: {history.length} ta operatsiya
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Amal Turi</th>
                  <th className="p-4">Tovar Nomi</th>
                  <th className="p-4">Miqdori</th>
                  <th className="p-4">Sababi / Izoh</th>
                  <th className="p-4">Mas'ul Xodim</th>
                  <th className="p-4 text-right">Sana & Vaqt</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/50">
                {history.length > 0 ? (
                  history.map((record) => {
                    const isKirim = record.type === "kirim";
                    const dateObj = new Date(record.date);
                    const formattedDate = isNaN(dateObj.getTime())
                      ? "Yaqinda"
                      : dateObj.toLocaleString("uz-UZ", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                    return (
                      <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                              isKirim
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {isKirim ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                            {isKirim ? "Kirim (+)" : "Chiqim (-)"}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">{record.stockName}</td>
                        <td className="p-4 font-mono font-bold text-sm">
                          <span className={isKirim ? "text-emerald-400" : "text-rose-400"}>
                            {isKirim ? "+" : "-"}
                            {record.quantity} {record.unit}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">{record.reason}</td>
                        <td className="p-4 text-slate-400 flex items-center gap-1.5">
                          <User size={14} className="text-slate-500" />
                          {record.user || "Admin"}
                        </td>
                        <td className="p-4 text-right text-slate-400 font-mono">
                          {formattedDate}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                      Hozircha harakatlar tarixi mavjud emas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Yangi tovar qo'shish modali */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewStock}
      />

      {/* Tezkor Kirim / Chiqim modali */}
      <StockActionModal
        isOpen={actionModalData.isOpen}
        item={actionModalData.item}
        type={actionModalData.type}
        onClose={() => setActionModalData((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
      />

      {/* O'chirishni tasdiqlash ekrandagi modali */}
      <ConfirmModal
        isOpen={deleteModalData.isOpen}
        message={`Rostdan ham "${deleteModalData.item?.name}" xom-ashyosini ombor zaxirasidan o'chirmoqchimisiz? Ushbu amalni qaytarib bo'lmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Ortga"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalData({ isOpen: false, item: null })}
      />
    </div>
  );
}

export default Ombor;
