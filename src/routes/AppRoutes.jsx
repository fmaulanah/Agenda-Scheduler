import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/dashboard/dashboard";
import Schedule from "../pages/Schedule/Schedule";
import Attendt from "../pages/Attendance/Attendance";
import AttendanceHist from "../pages/AttendanceHistory/AttendanceHistory"
import System from "../pages/System/System";
import UserManagement from "../pages/UserManagement/UserManagement";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { AdminRoute } from "./ProtectedRoute";

function AppRoutes() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            <Route
                path="/login"
                element={
                    <PublicRoute>

                        <Login />

                    </PublicRoute>
                }
            />

            <Route
                element={
                    <ProtectedRoute>

                        <MainLayout />

                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/schedule"
                    element={<Schedule />}
                />

                <Route
                    path="/attendance"
                    element={<Attendt />}
                />

                <Route
                    path="/attendance-history"
                    element={<AttendanceHist />}
                />

                <Route
                    path="/attendant"
                    element={<Navigate to="/attendance" replace />}
                />

                <Route
                    path="/attendancehistory"
                    element={<Navigate to="/attendance-history" replace />}
                />

                <Route
                    path="/system"
                    element={<System />}
                />

                <Route
                    path="/user-management"
                    element={
                        <AdminRoute>
                            <UserManagement />
                        </AdminRoute>
                    }
                />

            </Route>

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}

export default AppRoutes;
