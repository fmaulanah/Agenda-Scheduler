import { useState, useEffect, useCallback } from "react";

import {
    Grid,
    Box
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import AppCard from "../../components/common/Card/AppCard";
import AppButton from "../../components/common/Button/AppButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingOverlay from "../../components/common/Loading/LoadingOverlay";
import EmptyState from "../../components/common/Empty/EmptyState";

import useSnackbar from "../../hooks/useSnackbar";

import userManagementService from "../../services/userManagementService";

import UserManagementDialog from "./components/UserManagementDialog";
import UserManagementTable from "./components/UserManagementTable";

function UserManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const { showSnackbar } = useSnackbar();

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const result = await userManagementService.getUsers();
            if (Array.isArray(result)) {
                const safeUsers = result.map(u => ({
                    ...u,
                    USER_ID: u.USER_ID ?? "",
                    EMPID: u.EMPID ?? "",
                    EMP_NAME: u.EMP_NAME ?? "",
                    ROLE_ID: u.ROLE_ID ?? "",
                    PLANT_CD: u.PLANT_CD ?? "",
                    DEPT_NM: u.DEPT_NM ?? "",
                    REMARK: u.REMARK ?? "",
                    BLOCK_YN: u.BLOCK_YN ?? "N",
                    USE_YN: u.USE_YN ?? "Y",
                    ACCESS_TM: u.ACCESS_TM ?? "",
                    EMAIL: u.EMAIL ?? ""
                }));
                setUsers(safeUsers);
            }
        } catch (err) {
            console.error(err);
            showSnackbar("Gagal memuat data user.", "error");
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const handleAdd = () => {
        setEditingUser(null);
        setDialogOpen(true);
    };

    const handleEdit = (row) => {
        setEditingUser(row);
        setDialogOpen(true);
    };

    const handleResetPassword = (row) => {
        const newPassword = prompt("Masukkan password baru untuk " + row.USER_ID + ":");
        if (!newPassword) return;
        if (newPassword.length < 1) {
            showSnackbar("Password tidak boleh kosong.", "warning");
            return;
        }
        try {
            userManagementService.resetPassword(row.USER_ID, newPassword);
            showSnackbar("Password berhasil direset.", "success");
        } catch (err) {
            console.error(err);
            showSnackbar("Gagal mereset password.", "error");
        }
    };

    const handleToggleBlock = (row, action) => {
        setConfirmAction({ type: action, row });
        setConfirmOpen(true);
    };

    const confirmMessage = confirmAction?.type === "disable"
        ? `Apakah Anda ingin menonaktifkan user ${confirmAction?.row?.USER_ID}?`
        : `Apakah Anda ingin mengaktifkan user ${confirmAction?.row?.USER_ID}?`;

    const handleConfirmToggle = async () => {
        if (!confirmAction) return;
        const { type, row } = confirmAction;
        try {
            const newBlockYn = type === "disable" ? "Y" : "N";
            await userManagementService.updateUser({
                ...row,
                blockYn: newBlockYn
            });
            setUsers(prev => prev.map(u =>
                u.USER_ID === row.USER_ID ? { ...u, BLOCK_YN: newBlockYn } : u
            ));
            showSnackbar(
                `User ${row.USER_ID} ${type === "disable" ? "dinonaktifkan" : "diaktifkan"} berhasil.`,
                "success"
            );
        } catch (err) {
            console.error(err);
            showSnackbar("Gagal memperbarui status user.", "error");
        }
        setConfirmOpen(false);
        setConfirmAction(null);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingUser(null);
    };

    const handleSaved = (action) => {
        loadUsers();
        if (action === "delete") {
            showSnackbar("User berhasil dinonaktifkan.", "success");
        }
    };

    const filteredUsers = users;

    return (
        <>

            <PageHeader
                title="User Management"
                subtitle="Kelola data user dan hak akses."
            />

            <Box>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <AppCard
                            title=" "
                            action={
                                <AppButton
                                    startIcon={<AddIcon />}
                                    onClick={handleAdd}
                                >
                                    Tambah User
                                </AppButton>
                            }
                            sx={{
                                "& .MuiCardContent-root": {
                                    p: { xs: 2, md: 3 }
                                }
                            }}
                        >
                            {filteredUsers.length === 0 && !loading ? (
                                <EmptyState
                                    title="Tidak ada user"
                                    subtitle="Klik Tambah User untuk menambahkan user baru."
                                />
                            ) : (
                                <UserManagementTable
                                    rows={filteredUsers}
                                    loading={loading}
                                    onEdit={handleEdit}
                                    onToggleBlock={handleToggleBlock}
                                    onResetPassword={handleResetPassword}
                                />
                            )}
                        </AppCard>
                    </Grid>
                </Grid>
            </Box>

            <UserManagementDialog
                open={dialogOpen}
                editingUser={editingUser}
                existingUsers={users}
                onClose={handleCloseDialog}
                onSaved={handleSaved}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Konfirmasi"
                message={confirmMessage}
                confirmText="Ya"
                cancelText="Batal"
                onConfirm={handleConfirmToggle}
                onCancel={() => {
                    setConfirmOpen(false);
                    setConfirmAction(null);
                }}
            />
        </>
    );
}

export default UserManagement;
