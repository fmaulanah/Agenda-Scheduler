import { Box, Container, Paper, Typography } from "@mui/material";
import Logo from "../../assets/logo/logo.png";
import LoginForm from "./LoginForm";

function Login() {

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // background: "linear-gradient(135deg,#0F005F 0%,#24126A 100%)",
                p: 2
            }}
        >

            <Container maxWidth="md">

                <Paper
                    elevation={5}
                    sx={{
                        borderRadius: 5,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" }
                    }}
                >

                    <Box
                        sx={{
                            flex: 1,
                            bgcolor: "primary.main",
                            color: "white",
                            p: 5,
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 2
                        }}
                    >
                        <Box component="img" src={Logo} alt="CSG Logo" sx={{ width: 80, height: "auto", bgcolor: "white", borderRadius: 2, p: 1 }} />
                        <Typography variant="h4" fontWeight={700}>CSG Agenda Scheduler</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.85 }}>Kelola agenda &amp; attendance dengan mudah.</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6, mt: 2 }}>v{import.meta.env.VITE_APP_VERSION} (Build {import.meta.env.VITE_APP_BUILD})</Typography>
                    </Box>

                    <Box sx={{ flex: 1, p: 5 }}>
                        <LoginForm />
                    </Box>

                </Paper>

            </Container>

        </Box>

    );

}

export default Login;