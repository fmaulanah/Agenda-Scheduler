import dayjs from "dayjs";

import { Avatar, Box, Card, CardContent, Chip, Divider, 
         List, ListItem, ListItemAvatar, Typography 
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import EmptyState from "../../../components/common/Empty/EmptyState";
import AppButton from "../../../components/common/Button/AppButton";

function DashboardUpcomingTable({ rows }) {
    const navigate = useNavigate();

    return (

        <Card
            sx={{
                borderRadius: 3,
                height: "100%"
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                >

                    Agenda Hari Ini

                </Typography>

                {

                    rows.length === 0

                        ?

                        (

                            <Box
                                sx={{
                                    py: 4,
                                    textAlign: "center"
                                }}
                            >

                                <EmptyState

                                    icon={

                                        <EventBusyIcon

                                            sx={{

                                                fontSize:64

                                            }}

                                        />

                                    }

                                    title="Tidak ada agenda"
                                    subtitle="Belum ada agenda mendatang pada bulan ini."

                                />

                            </Box>

                        )

                        :

                        (
                            <Box
                                sx={{
                                    maxHeight: 360,
                                    overflowY: "auto",
                                    pr: 1,

                                    "&::-webkit-scrollbar": {
                                        width: 8
                                    },

                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "#BDBDBD",
                                        borderRadius: 4
                                    },

                                    "&::-webkit-scrollbar-thumb:hover": {
                                        backgroundColor: "#9E9E9E"
                                    }
                                }}
                            >

                                <List disablePadding>

                                    {

                                        rows.slice(0, 5).map((row, index) => (

                                            <Box
                                                key={row.id}
                                            >

                                                <ListItem
                                                    sx={{
                                                        alignItems: "flex-start",
                                                        py: 2
                                                    }}
                                                >

                                                    <ListItemAvatar>

                                                        <Avatar
                                                            sx={{
                                                                bgcolor: "primary.main"
                                                            }}
                                                        >

                                                            <CalendarMonthIcon />

                                                        </Avatar>

                                                    </ListItemAvatar>

                                                    <Box
                                                        sx={{
                                                            flex: 1
                                                        }}
                                                    >

                                                        <Typography
                                                            fontWeight={600}
                                                        >

                                                            {row.title}

                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 0.5
                                                            }}
                                                        >

                                                            {dayjs(row.startDate).format("DD MMM YYYY")}

                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                mt: 1.5,
                                                                display: "flex",
                                                                gap: 1,
                                                                flexWrap: "wrap"
                                                            }}
                                                        >

                                                            <Chip
                                                                icon={<MeetingRoomIcon />}
                                                                label={row.roomName}
                                                                size="small"
                                                                variant="outlined"
                                                            />

                                                            <Chip
                                                                icon={<PersonIcon />}
                                                                label={row.trainerName}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{
                                                                    maxWidth: {
                                                                        xs: 180,
                                                                        md: "100%"
                                                                    }
                                                                }}
                                                            />

                                                        </Box>

                                                    </Box>

                                                </ListItem>

                                                {

                                                    index !== Math.min(rows.length, 5) - 1 &&

                                                    <Divider />

                                                }

                                            </Box>

                                        ))

                                    }

                                </List>

                                {rows.length > 5 && (
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                        <AppButton variant="outlined" size="small" onClick={() => navigate("/schedule")}>Lihat semua</AppButton>
                                    </Box>
                                )}

                            </Box>

                        )

                }

            </CardContent>

        </Card>

    );

}

export default DashboardUpcomingTable;