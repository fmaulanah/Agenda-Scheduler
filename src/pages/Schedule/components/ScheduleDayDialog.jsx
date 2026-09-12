import dayjs from "dayjs";
import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

function ScheduleDayDialog({ open, date, agendas, roomMap = {}, onClose, onSelectAgenda }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: { sx: { borderRadius: 3, overflow: "hidden" } }
            }}
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 600,
                    variant: "h6"
                }}
            >

                Detail Agenda

                <IconButton
                    onClick={onClose}
                    size="small"
                >

                    <CloseIcon />

                </IconButton>

            </DialogTitle>

            <DialogContent sx={{ p: 2, bgcolor: "grey.50" }}>
                <Stack
                    spacing={1.5}
                    sx={{
                        maxHeight: 440,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { width: 4 },
                        "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 2 }
                    }}
                >
                    {agendas.map((agenda) => (
                        <Box
                            key={agenda.id}
                            onClick={() => {
                                onClose();
                                onSelectAgenda(agenda);
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: agenda.useYn === "Y" ? "background.paper" : "grey.100",
                                border: 1,
                                borderColor: agenda.useYn === "Y" ? "divider" : "grey.300",
                                borderLeft: 4,
                                borderLeftColor: agenda.useYn === "Y" ? "primary.main" : "grey.400",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                "&:hover": {
                                    boxShadow: 2,
                                    borderColor: agenda.useYn === "Y" ? "primary.light" : "grey.400",
                                    transform: "translateY(-1px)"
                                }
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={700} noWrap color={agenda.useYn === "Y" ? "text.primary" : "text.secondary"}>
                                    {agenda.title}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}>
                                    <PersonIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {agenda.trainerName || "-"}
                                    </Typography>
                                    <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "grey.400", flexShrink: 0 }} />
                                    <MeetingRoomIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {roomMap[agenda.room] ?? agenda.room}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: "wrap" }}>
                                    <Chip label={agenda.useYn === "Y" ? "Aktif" : "Non Aktif"} size="small" color={agenda.useYn === "Y" ? "success" : "default"} sx={{ height: 20, fontSize: "0.65rem" }} />
                                </Stack>
                            </Box>
                            <ChevronRightIcon fontSize="small" color="action" />
                        </Box>
                    ))}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ScheduleDayDialog;
