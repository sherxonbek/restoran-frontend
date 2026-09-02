import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";


export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    const response = await getDoc(collection(db, "products"));
    return response.data;
});

export const getProduct = createAsyncThunk("products/getProduct", async (productId, { rejectWithValue }) => {
    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return rejectWithValue("Mahsulot topilmadi");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, updatedData }) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, updatedData);
    return { id, ...updatedData };
});

export const addProduct = createAsyncThunk("products/addProduct", async (newProductData) => {
    const docRef = await addDoc(collection(db, "products"), newProductData);
    return { id: docRef.id, ...newProductData };
});

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (productId) => {
    await deleteDoc(doc(db, "products", productId));
    return productId;
});

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProductsRealTime: (state, action) => {
            state.products = action.payload;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(addProduct.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = action.payload;

            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.error = action.payload;
            })

            //maxsulotni id orqali olish
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.error = action.payload;
            })

            //maxsulotni yangilash
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { setProductsRealTime } = productSlice.actions;
export default productSlice.reducer;
