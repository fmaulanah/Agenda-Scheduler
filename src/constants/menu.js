import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const MENUS = [
    {
        id: 1,
        title: "Dashboard",
        icon: DashboardIcon,
        path: "/dashboard"
    },
    {
        id: 2,
        title: "Schedule",
        icon: CalendarMonthIcon,
        path: "/schedule"
    },
    {
        id: 3,
        title: "Attendance",
        icon: AssignmentOutlinedIcon,
        children: [
            { title: "Scan", path: "/attendance", icon: AssignmentOutlinedIcon },
            { title: "History", path: "/attendance-history", icon: HistoryEduIcon }
        ]
    },
    {
        id: 5,
        title: "System",
        icon: SettingsIcon,
        children: [
            { title: "Overview", path: "/system", icon: SettingsIcon },
            { title: "User Management", path: "/user-management", icon: ManageAccountsIcon, adminOnly: true }
        ]
    }
];