import { Box, Typography } from "@mui/material";

import Logo from "../../assets/logo/logo.png";

import { useAuth } from "../../context/AuthContext";

function SidebarHeader({ isCollapsed = false }) {
    
    const { user } = useAuth();

    return (

        <Box
            sx={{
                textAlign: "center",
                py: isCollapsed ? 2 : 4,
                px: 2,
                display: isCollapsed ? "none" : "block"
            }}
        >

            <Box
                component="img"
                src={Logo}
                alt="CSG Logo"
                sx={{
                    width: 80,
                    height: "auto",
                    mb: 2
                }}
            />

            <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
            >

                {user?.EMP_NAME}

            </Typography>

            <Typography
                variant="body"
                color="text.secondary"
            >

                {user?.EMPID}

            </Typography>

        </Box>

    );

}

export default SidebarHeader;