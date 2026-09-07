import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const INITIAL_ITEMS = [
  {
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
    name: "Tovuq filesi",
    category: "Go'sht & Parranda",
    unit: "kg",
    quantity: 8,
    minStock: 12,
    costPrice: 42000,
    lastUpdated: new Date().toISOString(),
    supplier: "Parranda Fabrikasi",
  },
  {
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
    name: "Pomidor (Yusupov)",
    category: "Sabzavot & Meva",
    unit: "kg",
    quantity: 6,
    minStock: 15,
    costPrice: 18000,
    lastUpdated: new Date().toISOString(),
    supplier: "Issiqxona Dehqon",
  },
  {
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
    name: "Sut (3.2%)",
    category: "Sut & Tuxum",
    unit: "litr",
    quantity: 4,
    minStock: 10,
    costPrice: 11000,
    lastUpdated: new Date().toISOString(),
    supplier: "Musaffo Sut",
  },
  {
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
    name: "Qahva donalari (Arabica)",
    category: "Ichimliklar",
    unit: "kg",
    quantity: 2,
    minStock: 5,
    costPrice: 240000,
    lastUpdated: new Date().toISOString(),
    supplier: "Coffee Roasters",
  },
];

// 1. Bazadan barcha ombor mahsulotlarini olish
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const list = [];
      querySnapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      return list;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Bazadan harakatlar tarixini olish
export const fetchInventoryHistory = createAsyncThunk(
  "inventory/fetchInventoryHistory",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "inventory_history"));
      const list = [];
      querySnapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      return list;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Yangi tovar qo'shish (Firestore "inventory" kolleksiyasiga)
export const addStockItem = createAsyncThunk(
  "inventory/addStockItem",
  async (newItem, { rejectWithValue }) => {
    try {
      const stockData = {
        name: newItem.name,
        category: newItem.category || "Boshqa",
        unit: newItem.unit || "kg",
        quantity: Number(newItem.quantity) || 0,
        minStock: Number(newItem.minStock) || 0,
        costPrice: Number(newItem.costPrice) || 0,
        supplier: newItem.supplier || "Noma'lum ta'minotchi",
        lastUpdated: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "inventory"), stockData);

      // Harakat tarixiga ham yozish
      if (stockData.quantity > 0) {
        await addDoc(collection(db, "inventory_history"), {
          stockId: docRef.id,
          stockName: stockData.name,
          type: "kirim",
          quantity: stockData.quantity,
          unit: stockData.unit,
          reason: "Yangi tovar ro'yxatga olindi",
          user: newItem.user || "Admin",
          date: new Date().toISOString(),
        });
      }

      return { id: docRef.id, ...stockData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Omborga kirim qilish (+)
export const stockIn = createAsyncThunk(
  "inventory/stockIn",
  async ({ id, quantity, reason, user }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const item = state.inventory.items.find((i) => i.id === id);
      if (!item) return rejectWithValue("Mahsulot topilmadi");

      const addedQty = Number(quantity) || 0;
      const newQty = (Number(item.quantity) || 0) + addedQty;

      await updateDoc(doc(db, "inventory", id), {
        quantity: newQty,
        lastUpdated: new Date().toISOString(),
      });

      await addDoc(collection(db, "inventory_history"), {
        stockId: id,
        stockName: item.name,
        type: "kirim",
        quantity: addedQty,
        unit: item.unit,
        reason: reason || "Kirim (Omborni to'ldirish)",
        user: user || "Admin",
        date: new Date().toISOString(),
      });

      return { id, quantity: newQty };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Ombordan chiqim qilish (-)
export const stockOut = createAsyncThunk(
  "inventory/stockOut",
  async ({ id, quantity, reason, user }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const item = state.inventory.items.find((i) => i.id === id);
      if (!item) return rejectWithValue("Mahsulot topilmadi");

      const removedQty = Number(quantity) || 0;
      const newQty = Math.max(0, (Number(item.quantity) || 0) - removedQty);

      await updateDoc(doc(db, "inventory", id), {
        quantity: newQty,
        lastUpdated: new Date().toISOString(),
      });

      await addDoc(collection(db, "inventory_history"), {
        stockId: id,
        stockName: item.name,
        type: "chiqim",
        quantity: removedQty,
        unit: item.unit,
        reason: reason || "Oshxonaga sarflandi",
        user: user || "Oshpaz",
        date: new Date().toISOString(),
      });

      return { id, quantity: newQty };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 6. Tovarni yangilash
export const updateStockItem = createAsyncThunk(
  "inventory/updateStockItem",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const cleanData = {
        ...updatedData,
        lastUpdated: new Date().toISOString(),
      };
      await updateDoc(doc(db, "inventory", id), cleanData);
      return { id, ...cleanData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 7. Tovarni bazadan o'chirish
export const deleteStockItem = createAsyncThunk(
  "inventory/deleteStockItem",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "inventory", id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 8. Baza bo'sh bo'lganda boshlang'ich mahsulotlarni kiritish (seed)
export const seedInitialStock = createAsyncThunk(
  "inventory/seedInitialStock",
  async (_, { rejectWithValue }) => {
    try {
      for (const item of INITIAL_ITEMS) {
        await addDoc(collection(db, "inventory"), item);
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  history: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventoryRealTime: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    setInventoryHistoryRealTime: (state, action) => {
      state.history = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchInventoryHistory
      .addCase(fetchInventoryHistory.fulfilled, (state, action) => {
        state.history = Array.isArray(action.payload) ? action.payload : [];
      })

      // addStockItem
      .addCase(addStockItem.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.items)) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addStockItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // stockIn
      .addCase(stockIn.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })

      // stockOut
      .addCase(stockOut.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })

      // updateStockItem
      .addCase(updateStockItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })

      // deleteStockItem
      .addCase(deleteStockItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { setInventoryRealTime, setInventoryHistoryRealTime } =
  inventorySlice.actions;

export default inventorySlice.reducer;
