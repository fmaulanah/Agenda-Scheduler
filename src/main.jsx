import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import SnackbarProvider from "./context/SnackbarContext";

import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>

        <HashRouter>

            <ThemeProvider theme={theme}>

                <CssBaseline />

                <AuthProvider>

                    <SnackbarProvider>

                        <App />

                    </SnackbarProvider>

                </AuthProvider>

            </ThemeProvider>

        </HashRouter>

    </StrictMode>
);