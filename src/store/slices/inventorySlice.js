import { createSlice } from "@reduxjs/toolkit";

const INITIAL_ITEMS = [
  {
    id: "stock-1",
    name: "Mol go'shti (Lahm)",
    category: "Go'sht & Parranda",
    unit: "kg",
    quantity: 45,
    minStock: 15,
    costPrice: 85000,
    lastUpdated: new Date().toISOString(),
    supplier: "Langar Go'sht Bozori",
  },
  {
    id: "stock-2",
    name: "Qo'y go'shti",
    category: "Go'sht & Parranda",
    unit: "kg",
    quantity: 12,
    minStock: 10,
    costPrice: 95000,
    lastUpdated: new Date().toISOString(),
    supplier: "Langar Go'sht Bozori",
  },
  {
    id: "stock-3",
    name: "Tovuq filesi",
    category: "Go'sht & Parranda",
    unit: "kg",
    quantity: 8,
    minStock: 12, // Kam qolgan!
    costPrice: 42000,
    lastUpdated: new Date().toISOString(),
    supplier: "Parranda Fabrikasi",
  },
  {
    id: "stock-4",
    name: "Kartoshka (Qizil)",
    category: "Sabzavot & Meva",
    unit: "kg",
    quantity: 180,
    minStock: 40,
    costPrice: 4500,
    lastUpdated: new Date().toISOString(),
    supplier: "Qo'yliq Ulgurji",
  },
  {
    id: "stock-5",
    name: "Piyoz (Sariq)",
    category: "Sabzavot & Meva",
    unit: "kg",
    quantity: 95,
    minStock: 30,
    costPrice: 3000,
    lastUpdated: new Date().toISOString(),
    supplier: "Qo'yliq Ulgurji",
  },
  {
    id: "stock-6",
    name: "Pomidor (Yusupov)",
    category: "Sabzavot & Meva",
    unit: "kg",
    quantity: 6,
    minStock: 15, // Kam qolgan!
    costPrice: 18000,
    lastUpdated: new Date().toISOString(),
    supplier: "Issiqxona Dehqon",
  },
  {
    id: "stock-7",
    name: "O'simlik yog'i (Zilol)",
    category: "Yog' & Ziravor",
    unit: "litr",
    quantity: 60,
    minStock: 20,
    costPrice: 18500,
    lastUpdated: new Date().toISOString(),
    supplier: "Yog'-Moy Zavodi",
  },
  {
    id: "stock-8",
    name: "Guruch (Alanga)",
    category: "Baqqollik & Don",
    unit: "kg",
    quantity: 75,
    minStock: 25,
    costPrice: 22000,
    lastUpdated: new Date().toISOString(),
    supplier: "Xorazm Guruch",
  },
  {
    id: "stock-9",
    name: "Sut (3.2%)",
    category: "Sut & Tuxum",
    unit: "litr",
    quantity: 4,
    minStock: 10, // Kam qolgan!
    costPrice: 11000,
    lastUpdated: new Date().toISOString(),
    supplier: "Musaffo Sut",
  },
  {
    id: "stock-10",
    name: "Pishloq (Mozzarella)",
    category: "Sut & Tuxum",
    unit: "kg",
    quantity: 14,
    minStock: 5,
    costPrice: 68000,
    lastUpdated: new Date().toISOString(),
    supplier: "Dairy Cheese",
  },
  {
    id: "stock-11",
    name: "Tuxum (1-toifa)",
    category: "Sut & Tuxum",
    unit: "dona",
    quantity: 360,
    minStock: 90,
    costPrice: 1400,
    lastUpdated: new Date().toISOString(),
    supplier: "Parranda Fabrikasi",
  },
  {
    id: "stock-12",
    name: "Qahva donalari (Arabica)",
    category: "Ichimliklar",
    unit: "kg",
    quantity: 2,
    minStock: 5, // Kam qolgan!
    costPrice: 240000,
    lastUpdated: new Date().toISOString(),
    supplier: "Coffee Roasters",
  },
];

const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Storage save error:", err);
  }
};

const initialState = {
  items: loadFromStorage("app_inventory_stock", INITIAL_ITEMS),
  history: loadFromStorage("app_inventory_history", [
    {
      id: "hist-1",
      stockId: "stock-1",
      stockName: "Mol go'shti (Lahm)",
      type: "kirim",
      quantity: 50,
      unit: "kg",
      reason: "Yangi partiya xaridi",
      user: "Admin",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "hist-2",
      stockId: "stock-1",
      stockName: "Mol go'shti (Lahm)",
      type: "chiqim",
      quantity: 5,
      unit: "kg",
      reason: "Oshxonaga topshirildi (Sho'rva va Kabob uchun)",
      user: "Oshpaz Elyor",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "hist-3",
      stockId: "stock-6",
      stockName: "Pomidor (Yusupov)",
      type: "chiqim",
      quantity: 2,
      unit: "kg",
      reason: "Brak / Yaroqsiz (Chirigan)",
      user: "Omborchi",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ]),
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addStockItem: (state, action) => {
      const newItem = {
        id: `stock-${Date.now()}`,
        quantity: Number(action.payload.quantity) || 0,
        minStock: Number(action.payload.minStock) || 0,
        costPrice: Number(action.payload.costPrice) || 0,
        lastUpdated: new Date().toISOString(),
        ...action.payload,
      };
      state.items.unshift(newItem);
      saveToStorage("app_inventory_stock", state.items);

      // Harakat tarixiga yozish
      const historyEntry = {
        id: `hist-${Date.now()}`,
        stockId: newItem.id,
        stockName: newItem.name,
        type: "kirim",
        quantity: newItem.quantity,
        unit: newItem.unit,
        reason: "Yangi tovar ro'yxatga olindi",
        user: action.payload.user || "Admin",
        date: new Date().toISOString(),
      };
      state.history.unshift(historyEntry);
      saveToStorage("app_inventory_history", state.history);
    },

    stockIn: (state, action) => {
      const { id, quantity, reason, user } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        const addedQty = Number(quantity) || 0;
        item.quantity += addedQty;
        item.lastUpdated = new Date().toISOString();
        saveToStorage("app_inventory_stock", state.items);

        state.history.unshift({
          id: `hist-${Date.now()}`,
          stockId: item.id,
          stockName: item.name,
          type: "kirim",
          quantity: addedQty,
          unit: item.unit,
          reason: reason || "Kirim (Omborni to'ldirish)",
          user: user || "Admin",
          date: new Date().toISOString(),
        });
        saveToStorage("app_inventory_history", state.history);
      }
    },

    stockOut: (state, action) => {
      const { id, quantity, reason, user } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        const removedQty = Number(quantity) || 0;
        item.quantity = Math.max(0, item.quantity - removedQty);
        item.lastUpdated = new Date().toISOString();
        saveToStorage("app_inventory_stock", state.items);

        state.history.unshift({
          id: `hist-${Date.now()}`,
          stockId: item.id,
          stockName: item.name,
          type: "chiqim",
          quantity: removedQty,
          unit: item.unit,
          reason: reason || "Oshxonaga sarflandi",
          user: user || "Oshpaz",
          date: new Date().toISOString(),
        });
        saveToStorage("app_inventory_history", state.history);
      }
    },

    updateStockItem: (state, action) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          quantity: Number(action.payload.quantity) ?? state.items[index].quantity,
          minStock: Number(action.payload.minStock) ?? state.items[index].minStock,
          costPrice: Number(action.payload.costPrice) ?? state.items[index].costPrice,
          lastUpdated: new Date().toISOString(),
        };
        saveToStorage("app_inventory_stock", state.items);
      }
    },

    deleteStockItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToStorage("app_inventory_stock", state.items);
    },
  },
});

export const {
  addStockItem,
  stockIn,
  stockOut,
  updateStockItem,
  deleteStockItem,
} = inventorySlice.actions;

export default inventorySlice.reducer;
