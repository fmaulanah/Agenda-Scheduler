import { Box, Divider, List, IconButton, Tooltip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { MENUS } from "../../constants/menu";
import { useAuth } from "../../context/AuthContext";

import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

import ConfirmDialog from "../../components/common/ConfirmDialog";

import useLeaveGuard from "../../hooks/useLeaveGuard";

import attendanceQueue from "../../utils/attendanceQueue";

function Sidebar({ isMobile, onClose, isCollapsed = false, onToggleCollapse }) {

    const navigate = useNavigate();
    const location = useLocation();
    const leaveGuard = useLeaveGuard();
    const { user } = useAuth();

    const visibleMenus = MENUS.filter(menu => !menu.adminOnly || user?.ROLE_ID === "ADMIN");

    const handleMenuClick = (path) => {

        console.log(location.pathname);

        if (

            location.pathname.startsWith("/attendance") &&
            attendanceQueue.getCount() > 0

        ) {

            leaveGuard.requestLeave(() => {

                attendanceQueue.clearQueue();

                navigate(path);

                if (isMobile) {

                    onClose();

                }

            });

            onClose();
            return;

        }

        navigate(path);
        onClose();

    };

    return(

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0
            }}
        >

            {!isMobile && onToggleCollapse && (
                <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
                    <IconButton
                        onClick={() => onToggleCollapse((prev) => !prev)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        size="small"
                        sx={{
                            alignSelf: isCollapsed ? "center" : "flex-end",
                            mb: 0.5,
                            border: 1,
                            borderColor: "divider",
                            bgcolor: "background.paper"
                        }}
                    >
                        {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            )}

            <SidebarHeader isCollapsed={!isMobile && isCollapsed}/>

            {!isCollapsed && <Divider/>}

            <List
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0
                }}
            >

                {visibleMenus.map((menu)=>(

                    <SidebarItem

                        key={menu.id}

                        title={menu.title}

                        icon={menu.icon}

                        selected={location.pathname===menu.path || location.pathname.startsWith(menu.path + "/")}

                        onClick={() => handleMenuClick(menu.path)}
                        isCollapsed={!isMobile && isCollapsed}

                    />

                ))}

            </List>

            <SidebarFooter isMobile={isMobile} isCollapsed={!isMobile && isCollapsed}/>

            <ConfirmDialog

                open={leaveGuard.open}
                title="Attendance Belum Diupload"
                message={`Masih ada attendance "${attendanceQueue.getScheduleName()}" yang belum diupload.`}
                confirmText="Hapus"
                cancelText="Batal"
                confirmColor="error"
                onConfirm={leaveGuard.confirmLeave}
                onCancel={leaveGuard.cancelLeave}

            />

        </Box>

    );

}

export default Sidebar;