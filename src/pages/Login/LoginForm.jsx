import {
    Box,
    TextField,
    Typography
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import authService from "../../services/authService";
import employeeService from "../../services/employeeService";
import koreanService from "../../services/koreanService";

import AppButton from "../../components/common/Button/AppButton";
import Logo from "../../assets/logo/logo.png";

import useSnackbar from "../../hooks/useSnackbar";

function LoginForm() {

    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const userIdError = userId.length > 0 && userId.trim().length === 0;
    const passwordError = password.length > 0 && password.trim().length === 0;
    
    const { login } = useAuth();
    const { showSnackbar } = useSnackbar();

    const handleLogin = async () => {

        if (!userId || !password) {

            showSnackbar(

                    "User ID dan Password harus diisi.",

                    "warning"

                );

            return;

        }

        try {

            setLoading(true);

            const user = await authService.login(userId, password);

            if (user == null) {

                //alert("User ID atau Password salah.");
                
                showSnackbar(

                    "User ID atau Password salah.",

                    "warning"

                );

                return;

            }

            delete user.PASSWORD;

            login(user);

            await employeeService.refreshEmployees();
            await koreanService.refreshKoreans();
            
            navigate("/dashboard", { replace: true });

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    return (

        <Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 2, mb: 3 }}>
                <Box component="img" src={Logo} alt="CSG Logo" sx={{ width: 44, height: "auto", display: "block" }} />
                <Typography variant="h6" fontWeight={700}>CSG Agenda Scheduler</Typography>
            </Box>

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    mb: 0.5,
                }}
            >
                Login
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: "text.secondary",
                    mb: 3
                }}
            >
                Masukkan akun Anda untuk melanjutkan.
            </Typography>

            <TextField
                fullWidth
                label="User ID"
                margin="normal"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                autoComplete="username"
                disabled={loading}
                required
                error={userIdError}
                helperText={userIdError ? "User ID tidak boleh kosong." : ""}
            />

            <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                autoComplete="current-password"
                disabled={loading}
                required
                error={passwordError}
                helperText={passwordError ? "Password tidak boleh kosong." : ""}
            />

            <AppButton
                fullWidth
                onClick={handleLogin}
                loading={loading}
                disabled={loading}
                sx={{
                    mt: 3
                }}
            >
                Login
            </AppButton>

        </Box>

    );

}

export default LoginForm;
