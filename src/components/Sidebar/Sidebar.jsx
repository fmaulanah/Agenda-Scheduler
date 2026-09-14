import { Box, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Tooltip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

    const isPathActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
    const visibleMenus = MENUS.map(menu => {
        if (!menu.children) return (!menu.adminOnly || user?.ROLE_ID === "ADMIN") ? menu : null;
        const children = menu.children.filter(c => !c.adminOnly || user?.ROLE_ID === "ADMIN");
        if (!children.length) return null;
        return { ...menu, children };
    }).filter(Boolean);
    const [openMap, setOpenMap] = useState(() => {
        const init = {};
        visibleMenus.forEach(m => { if (m.children?.some(c => isPathActive(c.path))) init[m.id] = true; });
        return init;
    });
    const toggle = (id) => setOpenMap(prev => ({ ...prev, [id]: !prev[id] }));

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

    return (

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

            <SidebarHeader isCollapsed={!isMobile && isCollapsed} />

            {!isCollapsed && <Divider />}

            <List
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0
                }}
            >

                {visibleMenus.map((menu) => {
                    if (!menu.children) {
                        return (
                            <SidebarItem
                                key={menu.id}
                                title={menu.title}
                                icon={menu.icon}
                                selected={isPathActive(menu.path)}
                                onClick={() => handleMenuClick(menu.path)}
                                isCollapsed={isCollapsed}
                            />
                        );
                    }
                    const isParentActive = menu.children.some(c => isPathActive(c.path));
                    const open = !!openMap[menu.id];
                    const ParentIcon = menu.icon;
                    return (
                        <Box key={menu.id}>
                            <ListItemButton
                                selected={isParentActive}
                                aria-expanded={open}
                                aria-current={isParentActive ? "page" : undefined}
                                onClick={() => toggle(menu.id)}
                                sx={{
                                    mx: 1, my: 0.5, borderRadius: 2,
                                    "&.Mui-selected": { bgcolor: "primary.main", color: "white", "& .MuiListItemIcon-root": { color: "white" } },
                                    "&:hover:not(.Mui-selected)": { bgcolor: "primary.light", color: "white", "& .MuiListItemIcon-root": { color: "white" } }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}><ParentIcon /></ListItemIcon>
                                {!isCollapsed && <ListItemText primary={menu.title} />}
                                {!isCollapsed && (open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                            </ListItemButton>
                            <Collapse in={open && !isCollapsed} timeout="auto" unmountOnExit>
                                <List dense disablePadding sx={{ pl: 1 }}>
                                    {menu.children.map((child) => {
                                        const ChildIcon = child.icon;
                                        const selected = isPathActive(child.path);
                                        return (
                                            <ListItemButton
                                                key={child.path}
                                                selected={selected}
                                                aria-current={selected ? "page" : undefined}
                                                onClick={() => handleMenuClick(child.path)}
                                                sx={{
                                                    mx: 1, my: 0.25, borderRadius: 2, pl: 4,
                                                    "&.Mui-selected": { bgcolor: "primary.main", color: "white", "& .MuiListItemIcon-root": { color: "white" } },
                                                    "&:hover:not(.Mui-selected)": { bgcolor: "primary.light", color: "white", "& .MuiListItemIcon-root": { color: "white" } }
                                                }}
                                            >
                                                {ChildIcon && <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}><ChildIcon fontSize="small" /></ListItemIcon>}
                                                <ListItemText primary={child.title} primaryTypographyProps={{ variant: "body2", fontWeight: selected ? 600 : 400 }} />
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </Box>
                    );
                })}

            </List>

            <SidebarFooter isMobile={isMobile} isCollapsed={!isMobile && isCollapsed} />

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