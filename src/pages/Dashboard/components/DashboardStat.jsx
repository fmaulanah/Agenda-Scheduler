import { Typography, Box } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TodayIcon from "@mui/icons-material/Today";
import AppCard from "../../../components/common/Card/AppCard";

import useResponsive from "../../../hooks/useResponsive";

const ICON_MAP = {
    month: CalendarMonthIcon,
    today: TodayIcon,
};

function DashboardStat({
    title,
    value,
    icon,
    iconKey,
    color = "primary.main"
}) {

    const { isMobile } = useResponsive();

    return (

        <AppCard
            elevation={2}
            sx={{
                borderRadius: 3,
                height: "100%",
                "& .MuiCardContent-root": {
                    p: {
                        xs: 2,
                        md: 3
                    }
                }
            }}
        >


            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: {
                        xs: 1,
                        md: 2
                    }
                }}
            >

                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    color="text.primary"
                    fontWeight={700}
                >
                    {title}
                </Typography>

                <Box
                    sx={{
                        color: color
                    }}
                >
                    {(() => {
                        const IconComp = icon ? null : (ICON_MAP[iconKey] || CalendarMonthIcon);
                        return icon ? icon : <IconComp sx={{ fontSize: { xs: 28, md: 36 } }} />;
                    })()}
                </Box>

            </Box>

            <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={700}
            >
                {value}
            </Typography>


        </AppCard>

    );

}

export default DashboardStat;