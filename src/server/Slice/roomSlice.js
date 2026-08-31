import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://6a932d4125936d5660f09f8d.mockapi.io/api/xonalar"; //room api manzili
const TABLES_URL = "https://6a9410310e895b145e5f42ac.mockapi.io/api/tables"; // tables yani stollar jadvali api manzili

export const fetchTables = createAsyncThunk("rooms/fetchTables", async () => {
    const response = await axios.get(TABLES_URL);
    return response.data;
});

export const getRoom = createAsyncThunk("rooms/getRoom", async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addRoom = createAsyncThunk("rooms/addRoom", async (newRoomsList, { rejectWithValue }) => {
    try {
        const addedRooms = [];
        for (const roomObj of newRoomsList) {
            const response = await axios.post(API_URL, roomObj);
            addedRooms.push(response.data);
        }
        return addedRooms;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (roomId, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${roomId}`);
        return roomId;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const addTables = createAsyncThunk(
    "rooms/addTables",
    async ({ newTablesList, roomId, newTotalCount }, { rejectWithValue }) => {
        try {
            const addedTables = [];

            // Frontend-dan kelgan tayyor to'g'ri nomlangan array-ni aylanamiz
            for (const tableObj of newTablesList) {
                const response = await axios.post(TABLES_URL, tableObj);
                addedTables.push(response.data);
            }

            // Xonadagi stollar sonini yangilash
            const roomUpdateResponse = await axios.put(`${API_URL}/${roomId}`, {
                tableCount: newTotalCount
            });

            return {
                tables: addedTables,
                updatedRoom: roomUpdateResponse.data
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTable = createAsyncThunk(
    "rooms/deleteTable",
    async ({ tableId, roomId }, { getState, rejectWithValue }) => {
        try {
            await axios.delete(`${TABLES_URL}/${tableId}/`);

            const state = getState();
            const joriyXona = state.rooms.rooms.find(r => r.id === roomId);
            const yangiSoni = joriyXona ? Math.max(0, (joriyXona.tableCount || 0) - 1) : 0;

            const roomUpdateResponse = await axios.put(`${API_URL}/${roomId}`, {
                tableCount: yangiSoni
            });

            return { tableId, updatedRoom: roomUpdateResponse.data };
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            //xonalar uchun
            .addCase(getRoom.fulfilled, (state, action) => {
                state.rooms = action.payload;
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(room => room.id !== action.payload);
                state.tables = state.tables.filter(table => table.roomId !== action.payload);
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.rooms = [...state.rooms, ...action.payload];
            })

            //stollar uchun
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.tables = action.payload;
            })
            .addCase(addTables.fulfilled, (state, action) => {
                state.tables = [...state.tables, ...action.payload.tables];

                state.rooms = state.rooms.map(room =>
                    room.id === action.payload.updatedRoom.id ? action.payload.updatedRoom : room
                );
            })
            .addCase(deleteTable.pending, (state, action) => {
                const { tableId, roomId } = action.meta.arg;
                state.tables = state.tables.filter(t => t.id !== tableId);
                state.rooms = state.rooms.map(room =>
                    room.id === roomId
                        ? { ...room, tableCount: Math.max(0, (room.tableCount || 0) - 1) }
                        : room
                );
            })
            .addCase(deleteTable.fulfilled, (state, action) => {
                state.tables = state.tables.filter(t => t.id !== action.payload.tableId);
                state.rooms = state.rooms.map(room =>
                    room.id === action.payload.updatedRoom.id ? action.payload.updatedRoom : room
                );
            });
    },
});

export default dataSlice.reducer;
