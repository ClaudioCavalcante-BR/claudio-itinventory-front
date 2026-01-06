// src/routes/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import AdminRoute from "./AdminRoute";

import PublicLayout from "../components/Layout/PublicLayout";
import AppLayout from "../components/Layout/AppLayout";
import PrivateRoute from "./PrivateRoute";

import Landing from "../components/Landing/Landing";
import LoginPage from "../pages/Auth/LoginPage";

import Dashboard from "../pages/Dashboard/Dashboard";
import AssetList from "../forms/AssetList";
import UserListPage from "../pages/Users/UserListPage";
import RegisterUserPage from "../pages/Users/RegisterUserPage";
import UserEditPage from "../pages/Users/UserEditPage.jsx";

export default function Router() {
    return (
        <Routes>
            {/* Público (sem sidebar) */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Privado (com sidebar) - qualquer usuário logado */}
            <Route
                element={
                    <PrivateRoute>
                        <AppLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assets" element={<AssetList />} />

                {/* USUÁRIOS: somente ADMIN */}
                <Route
                    path="/users"
                    element={
                        <AdminRoute>
                            <UserListPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/users/:id/edit"
                    element={
                        <AdminRoute>
                            <UserEditPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/users/new"
                    element={
                        <AdminRoute>
                            <RegisterUserPage />
                        </AdminRoute>
                    }
                />
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
