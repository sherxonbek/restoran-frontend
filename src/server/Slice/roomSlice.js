import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { 
    collection, 
    addDoc, 
    doc, 
    deleteDoc, 
    runTransaction 
} from "firebase/firestore";

export const addRoom = createAsyncThunk("rooms/addRoom", async (newRoomsList, { rejectWithValue }) => {
    try {
        const addedRooms = [];
        for (const roomObj of newRoomsList) {
            const docRef = await addDoc(collection(db, "rooms"), roomObj);
            addedRooms.push({ id: docRef.id, ...roomObj });
        }
        return addedRooms;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (roomId, { rejectWithValue }) => {
    try {
        await deleteDoc(doc(db, "rooms", roomId));
        return roomId;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const addTables = createAsyncThunk(
    "rooms/addTables",
    async ({ newTablesList, roomId, newTotalCount }, { rejectWithValue }) => {
        try {
            await runTransaction(db, async (transaction) => {
                for (const tableObj of newTablesList) {
                    const newTableRef = doc(collection(db, "tables"));
                    transaction.set(newTableRef, tableObj);
                }

                const roomRef = doc(db, "rooms", roomId);
                transaction.update(roomRef, {
                    tableCount: newTotalCount
                });
            });

            return { roomId, newTotalCount };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTable = createAsyncThunk(
    "rooms/deleteTable",
    async ({ tableId, roomId }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const joriyXona = state.rooms.rooms.find(r => r.id === roomId);
            const yangiSoni = joriyXona ? Math.max(0, (joriyXona.tableCount || 0) - 1) : 0;

            await runTransaction(db, async (transaction) => {
                const tableRef = doc(db, "tables", tableId);
                transaction.delete(tableRef);

                const roomRef = doc(db, "rooms", roomId);
                transaction.update(roomRef, {
                    tableCount: yangiSoni
                });
            });

            return { tableId, roomId, yangiSoni };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const dataSlice = createSlice({
    name: "rooms",
    initialState: {
        rooms: [],
        tables: [],
        loading: false,
        error: null,
    },
    reducers: {
        setRoomsRealTime: (state, action) => {
            state.rooms = action.payload;
            state.loading = false;
        },
        setTablesRealTime: (state, action) => {
            state.tables = action.payload;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addRoom.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(addTables.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteTable.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { setRoomsRealTime, setTablesRealTime } = dataSlice.actions;
export default dataSlice.reducer;
