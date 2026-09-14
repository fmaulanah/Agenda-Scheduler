import {
    Avatar,
    Box,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
    IconButton,
    Divider
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAuth } from "../../../context/AuthContext";
import userManagementService from "../../../services/userManagementService";
import useSnackbar from "../../../hooks/useSnackbar";
import AppButton from "../Button/AppButton";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

function UserProfile() {
    
    const getInitials = (name = "") => {

        const words = name.trim().split(/\s+/);

        if (words.length === 1) {

            return words[0].charAt(0).toUpperCase();

        }

        return (

            words[0].charAt(0) +
            words[1].charAt(0)

        ).toUpperCase();

    };

    const avatarColors = [
        "#3949AB",
        "#00897B",
        "#F57C00",
        "#8E24AA",
        "#039BE5",
        "#D81B60"
    ];

    const getAvatarColor = (name = "") => {

        const index = [...name].reduce(

            (sum, char) => sum + char.charCodeAt(0),

            0

        ) % avatarColors.length;

        return avatarColors[index];

    };

    const { user, logout } = useAuth();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [resetOpen, setResetOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const newPassError = newPassword.length > 0 && newPassword.length < 6;
    const confirmError = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleOpenReset = () => {
        handleMenuClose();
        setNewPassword("");
        setConfirmPassword("");
        setResetOpen(true);
    };
    const handleCloseReset = () => {
        if (saving) return;
        setResetOpen(false);
    };
    const handleOpenLogout = () => {
        handleMenuClose();
        setLogoutOpen(true);
    };
    const handleConfirmLogout = () => {
        setLogoutOpen(false);
        logout();
        navigate("/login", { replace: true });
    };
    const handleResetPassword = async () => {
        if (!newPassword.trim()) {
            showSnackbar("Password baru harus diisi.", "warning");
            return;
        }
        if (newPassword.length < 6) {
            showSnackbar("Password minimal 6 karakter.", "warning");
            return;
        }
        if (newPassword !== confirmPassword) {
            showSnackbar("Konfirmasi password tidak cocok.", "warning");
            return;
        }
        const userId = user?.USER_ID || user?.userId;
        if (!userId) {
            showSnackbar("User ID tidak ditemukan.", "error");
            return;
        }
        setSaving(true);
        try {
            await userManagementService.resetPassword(userId, newPassword);
            showSnackbar("Password berhasil direset.", "success");
            setResetOpen(false);
        } catch (err) {
            showSnackbar(err?.response?.data?.message || "Gagal mereset password.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (

        <>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >

                <Avatar
                    onClick={handleAvatarClick}
                    sx={{
                        bgcolor: getAvatarColor(user?.EMP_NAME),
                        color: "#fff",
                        fontWeight:700,
                        cursor: "pointer"
                    }}
                >

                    {getInitials(user?.EMP_NAME)}

                </Avatar>

                <Box sx={{ cursor: "pointer" }} onClick={handleAvatarClick}>

                    <Typography
                        fontWeight={600}
                    >

                        {user?.EMP_NAME}

                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            color:"rgba(255,255,255,.75)"
                        }}
                    >

                        {user?.DEPT_NM}

                    </Typography>

                </Box>

            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={handleOpenReset}>
                    <ListItemIcon><LockResetIcon fontSize="small" /></ListItemIcon>
                    Reset Password
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpenLogout}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <Dialog open={resetOpen} onClose={handleCloseReset} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
                    <TextField
                        label="Password Baru"
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        size="small"
                        disabled={saving}
                        autoFocus
                        error={newPassError}
                        helperText={newPassError ? "Password minimal 6 karakter." : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNew((v) => !v)} edge="end" size="small">
                                        {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Konfirmasi Password"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        size="small"
                        disabled={saving}
                        error={confirmError}
                        helperText={confirmError ? "Konfirmasi password tidak cocok." : ""}
                        onKeyDown={(e) => { if (e.key === "Enter") handleResetPassword(); }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end" size="small">
                                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <AppButton variant="outlined" onClick={handleCloseReset} disabled={saving}>Batal</AppButton>
                    <AppButton onClick={handleResetPassword} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</AppButton>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={logoutOpen}
                title="Logout"
                message="Apakah Anda yakin ingin keluar dari aplikasi?"
                confirmText="Logout"
                cancelText="Batal"
                confirmColor="error"
                onConfirm={handleConfirmLogout}
                onCancel={() => setLogoutOpen(false)}
            />

        </>

    );

}

export default UserProfile;