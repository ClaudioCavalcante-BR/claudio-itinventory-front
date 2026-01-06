import { configureStore, createSlice } from "@reduxjs/toolkit";

const assetsSlice = createSlice({
    name: "assets",
    initialState: {
        items: [], // lista de equipamentos vinda do backend
        filter: "", // texto de busca (nome, TAG, categoria, local)
    },
    reducers: {
        setItems: (state, action) => {
            state.items = Array.isArray(action.payload) ? action.payload : [];
        },
        addItem: (state, action) => {
            if (action.payload) state.items.push(action.payload);
        },
        updateItem: (state, action) => {
            const updated = action.payload;
            state.items = state.items.map((item) =>
                item.id === updated.id ? updated : item
            );
        },
        removeItem: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
        },
        setFilter: (state, action) => {
            state.filter = action.payload ?? "";
        },
        clearFilter: (state) => {
            state.filter = "";
        },
    },
});

export const {
    setItems,
    addItem,
    updateItem,
    removeItem,
    setFilter,
    clearFilter,
} = assetsSlice.actions;

export const store = configureStore({
    reducer: {
        assets: assetsSlice.reducer,
    },
});
