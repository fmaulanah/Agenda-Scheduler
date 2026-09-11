import MenuIcon from "@mui/icons-material/Menu";
import { Paper, Box, IconButton, Typography } from "@mui/material";

import Clock from "../common/Clock/Clock";
import UserProfile from "../common/User/UserProfile";

function Header({

    isMobile,
    onMenuClick,
    sx

}) {

    const desktopLeft = sx?.left ?? 260;
    const desktopWidth = sx?.width ?? `calc(100% - 260px)`;

    return (

        <Paper
            elevation={1}
            sx={{
                position: "fixed",
                top: 0,
                left: isMobile ? 0 : desktopLeft,
                right: 0,
                width: isMobile ? "100%" : desktopWidth,
                zIndex: (theme) => theme.zIndex.drawer - 1,
                px: 4,
                py: 3,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 0
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    {isMobile && (

                        <IconButton
                            color="inherit"
                            onClick={onMenuClick}
                        >
                            <MenuIcon />
                        </IconButton>

                    )}

                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        fontWeight={300}
                    >
                        CSG Agenda Scheduler
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "flex"
                        },
                        alignitems: "center",
                        gap: 4
                    }}
                >

                    <Clock />

                    <UserProfile />

                </Box>

            </Box>

        </Paper>

    );

}

export default Header;
