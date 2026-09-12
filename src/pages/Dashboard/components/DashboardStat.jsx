import { Typography, Box } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AppCard from "../../../components/common/Card/AppCard";

import useResponsive from "../../../hooks/useResponsive";

const ICON_MAP = {
    month: CalendarMonthIcon,
    today: TodayIcon,
    upcoming: EventAvailableIcon,
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
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                    sx={{ fontSize: { xs: 13, md: 14 } }}
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