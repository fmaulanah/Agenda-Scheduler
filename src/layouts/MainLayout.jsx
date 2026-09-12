import { Outlet, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import useMasterDataPolling from "../hooks/useMasterDataPolling";

import {
    Drawer,
    Box,
    Breadcrumbs,
    Link,
    Typography,
    CssBaseline
} from "@mui/material";

const DRAWER_WIDTH_EXPANDED = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

function MainLayout() {

    useMasterDataPolling();

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [hoverExpanded, setHoverExpanded] = useState(false);

    const isHoverPreview = !isMobile && sidebarCollapsed && hoverExpanded;

    const effectiveDrawerWidth = useMemo(() => {
        if (isMobile) return DRAWER_WIDTH_EXPANDED;
        return isHoverPreview ? DRAWER_WIDTH_EXPANDED : (sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED);
    }, [isMobile, sidebarCollapsed, isHoverPreview]);

    const headerLeft = useMemo(() => {
        if (isMobile) return 0;
        return effectiveDrawerWidth;
    }, [isMobile, effectiveDrawerWidth]);

    const sidebarIsCollapsed = !isMobile && sidebarCollapsed && !isHoverPreview;
    const location = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
    const breadcrumbMap = {
        "/dashboard": "Dashboard",
        "/schedule": "Schedule",
        "/attendance": "Attendance",
        "/attendance-history": "Attendance History",
        "/system": "System",
        "/user-management": "User Management",
    };
    const currentTitle = breadcrumbMap[location.pathname] || "";
    useEffect(() => {
        document.title = currentTitle ? `${currentTitle} — CSG Agenda Scheduler` : "CSG Agenda Scheduler";
    }, [currentTitle]);

    return (

        <Box sx={{ display: "flex" }}>

            <CssBaseline />

            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? drawerOpen : true}
                onClose={() => setDrawerOpen(false)}
                ModalProps={{
                    keepMounted: true
                }}
                onMouseEnter={() => {
                    if (!isMobile && sidebarCollapsed) setHoverExpanded(true);
                }}
                onMouseLeave={() => {
                    if (!isMobile && sidebarCollapsed) setHoverExpanded(false);
                }}
                PaperProps={{
                    elevation: isHoverPreview ? 8 : 0
                }}
                sx={{
                    width: effectiveDrawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: effectiveDrawerWidth,
                        boxSizing: "border-box",
                        overflowX: "hidden",
                        transition: (theme) =>
                            theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen
                            }),
                        ...(isHoverPreview && {
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            transition: (theme) =>
                                theme.transitions.create("width", {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen
                                })
                        })
                    }
                }}
            >

                <Box p={2}>

                    <Sidebar
                        isMobile={isMobile}
                        onClose={() => setDrawerOpen(false)}
                        isCollapsed={sidebarIsCollapsed}
                        onToggleCollapse={setSidebarCollapsed}
                    />

                </Box>

            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: {
                        xs: "100%",
                        sm: `calc(100% - ${effectiveDrawerWidth}px)`
                    },
                    bgcolor: "#F5F7FA",
                    minHeight: "100vh"
                }}
            >
                <Header
                    isMobile={isMobile}
                    onMenuClick={() => setDrawerOpen(true)}
                    sx={{
                        left: headerLeft,
                        width: `calc(100% - ${headerLeft}px)`
                    }}
                />

                <Box
                    sx={{
                        mt: 12,
                        p:3
                    }}
                >
                    {currentTitle && (
                        <Breadcrumbs sx={{ mb: 2 }} separator="›">
                            <Link underline="hover" color="inherit" href="#/dashboard">Home</Link>
                            <Typography color="text.primary" fontWeight={600}>{currentTitle}</Typography>
                        </Breadcrumbs>
                    )}

                    <Outlet />

                </Box>

            </Box>

        </Box>

    );

}

export default MainLayout;