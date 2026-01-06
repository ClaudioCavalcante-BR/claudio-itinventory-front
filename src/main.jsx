import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/globals.css";


import { Provider } from "react-redux";
import { store } from "./store/index.js";

import { AuthProvider } from "./context/AuthContext.jsx";
import AssetsProvider from "./context/AssetsContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <AssetsProvider>
                            <App />
                        </AssetsProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
