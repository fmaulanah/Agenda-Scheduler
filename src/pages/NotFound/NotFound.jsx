import { Box, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";
import AppButton from "../../components/common/Button/AppButton";

function NotFound() {
    const navigate = useNavigate();
    return (
        <Box sx={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 2, py: 6 }}>
            <SearchOffIcon sx={{ fontSize: 64, color: "text.disabled" }} />
            <Typography variant="h4" fontWeight={700}>404 — Halaman tidak ditemukan</Typography>
            <Typography color="text.secondary">Halaman yang Anda cari tidak tersedia.</Typography>
            <AppButton onClick={() => navigate("/dashboard")}>Kembali ke Dashboard</AppButton>
        </Box>
    );
}

export default NotFound;
