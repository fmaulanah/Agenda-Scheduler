import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../common/ConfirmDialog/ConfirmDialog";

function SidebarFooter({ isMobile = false, isCollapsed = false }){
    
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [logoutOpen, setLogoutOpen] = useState(false);

    const handleLogout = () => setLogoutOpen(true);
    const handleConfirmLogout = () => {
        setLogoutOpen(false);
        logout();
        navigate("/login", { replace: true });
    };

    const showVersion = !isCollapsed;

    return(

        <Box
            sx={{
            mt: "auto",
            borderTop: 1,
            borderColor: "divider",
            textAlign:"center"
        }}
        >

            {isMobile && (
                <>
                    <List>
                        <ListItemButton
                            sx={{
                                mx:1,
                                my:.5,
                                borderRadius:2,
                                "&:hover":{
                                    bgcolor:"primary.light",
                                    color:"white",
                                    "& .MuiListItemIcon-root":{ color:"white" }
                                }
                            }}
                            onClick={handleLogout}
                        >
                            <ListItemIcon><LogoutIcon/></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton >
                    </List>
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
            )}

            {showVersion && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        mt: "auto",
                        py: 2,
                        textAlign:"center",
                        opacity:"30%"
                    }}
                >
                    v{import.meta.env.VITE_APP_VERSION} (Build {import.meta.env.VITE_APP_BUILD})
                </Typography>
            )}

        </Box>

    );

}

export default SidebarFooter;