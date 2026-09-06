import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "@/services/firebase";
import { collection, addDoc, doc, deleteDoc, getDocs } from "firebase/firestore";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const list = [];
    querySnapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
    });
    return list;
});

export const addUser = createAsyncThunk("users/addUser", async (newUserData) => {
    const docRef = await addDoc(collection(db, "users"), newUserData);
    return { id: docRef.id, ...newUserData };
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    return userId;
});

const getInitialCurrentUser = () => {
    try {
        const saved = localStorage.getItem("current_user");
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        currentUser: getInitialCurrentUser(),
        loading: false,
        error: null,
    },
    reducers: {
        setUsersRealTime: (state, action) => {
            state.users = Array.isArray(action.payload) ? action.payload : [];
            state.loading = false;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            if (action.payload) {
                localStorage.setItem("current_user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("current_user");
            }
        },
        logoutUser: (state) => {
            state.currentUser = null;
            localStorage.removeItem("current_user");
        },
    },
    extraReducers: (builder) => {
        builder
            // get users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "Foydalanuvchilarni yuklab bo'lmadi";
            })

            // add user
            .addCase(addUser.pending, (state) => {
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.users)) {
                    state.users.push(action.payload);
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message;
            })

            // delete user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.users)) {
                    state.users = state.users.filter(user => user.id !== action.payload);
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message;
            });
    },
});

export const { setUsersRealTime, setCurrentUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;