import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Box, Chip, Stack, Typography, IconButton } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AppCard from "../../../components/common/Card/AppCard";

const PAGE_SIZE = 5;

function AgendaCard({ agenda, roomMap, onSelectAgenda }) {
    const isActive = agenda.useYn === "Y";
    return (
        <AppCard
            sx={{
                width: "100%",
                cursor: "pointer",
                borderRadius: 3,
                border: 1,
                borderColor: isActive ? "divider" : "grey.300",
                borderLeft: 4,
                borderLeftColor: isActive ? "primary.main" : "grey.400",
                transition: "all 0.2s",
                "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)",
                    borderColor: isActive ? "primary.light" : "grey.400"
                }
            }}
        >
            <Box
                onClick={() => onSelectAgenda(agenda)}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1.5
                }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        noWrap
                        color={isActive ? "text.primary" : "text.secondary"}
                        sx={{ lineHeight: 1.3 }}
                    >
                        {agenda.title}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1, flexWrap: "wrap" }}>
                        <CalendarMonthIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {dayjs(agenda.startDate).format("DD MMM YYYY")}
                        </Typography>
                        <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "grey.400", flexShrink: 0 }} />
                        <MeetingRoomIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {roomMap[agenda.room] ?? agenda.room}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.75 }}>
                        <PersonIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {agenda.trainerName || "-"}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, flexWrap: "wrap" }}>
                        <Chip
                            label={isActive ? "Aktif" : "Non Aktif"}
                            size="small"
                            color={isActive ? "success" : "default"}
                            sx={{ height: 22, fontSize: "0.7rem", fontWeight: 600 }}
                        />
                    </Stack>
                </Box>

                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: isActive ? "primary.main" : "grey.400",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        mt: 0.25
                    }}
                >
                    <ChevronRightIcon fontSize="small" />
                </Box>
            </Box>
        </AppCard>
    );
}

function ScheduleList({ agendas, roomMap, onSelectAgenda }) {
    const [page, setPage] = useState(1);

    useEffect(() => { setPage(1); }, [agendas]); // eslint-disable-line react-hooks/set-state-in-effect

    const totalPages = Math.ceil(agendas.length / PAGE_SIZE);

    const pagedAgendas = agendas.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    if (!agendas.length) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                    Belum ada agenda.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
            <Stack spacing={1.75} sx={{ flex: 1 }}>
                {pagedAgendas.map(agenda => (
                    <AgendaCard
                        key={agenda.id}
                        agenda={agenda}
                        roomMap={roomMap}
                        onSelectAgenda={onSelectAgenda}
                    />
                ))}
            </Stack>

            {totalPages > 1 && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        py: 0.75,
                        px: 1,
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        boxShadow: 1,
                        alignSelf: "center"
                    }}
                >
                    <IconButton
                        size="small"
                        disabled={page === 1}
                        onClick={() => setPage(current => current - 1)}
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: page === 1 ? "transparent" : "primary.main",
                            color: page === 1 ? "text.disabled" : "white",
                            "&:hover": { bgcolor: "primary.dark", color: "white" },
                            "&.Mui-disabled": { bgcolor: "grey.100" }
                        }}
                    >
                        <ChevronLeftIcon fontSize="small" />
                    </IconButton>

                    <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                            minWidth: 52,
                            textAlign: "center",
                            px: 1,
                            color: "text.primary"
                        }}
                    >
                        {page} / {totalPages}
                    </Typography>

                    <IconButton
                        size="small"
                        disabled={page === totalPages}
                        onClick={() => setPage(current => current + 1)}
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: page === totalPages ? "transparent" : "primary.main",
                            color: page === totalPages ? "text.disabled" : "white",
                            "&:hover": { bgcolor: "primary.dark", color: "white" },
                            "&.Mui-disabled": { bgcolor: "grey.100" }
                        }}
                    >
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}

export default ScheduleList;
