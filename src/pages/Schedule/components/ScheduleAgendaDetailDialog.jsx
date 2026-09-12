import dayjs from "dayjs";

import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, Chip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useAuth } from "../../../context/AuthContext";

import AppButton from "../../../components/common/Button/AppButton";

const DetailItem = ({ label, value }) => (

    <Box
        sx={{
            mb: 2.5
        }}
    >

        <Typography
            variant="h6"
            fontWeight={200}
            sx={{
                mb: .5
            }}
        >

            {label}

        </Typography>

        <Typography
            variant="body1"
        >

            {value || "-"}

        </Typography>

    </Box>

);

function ScheduleAgendaDetailDialog({ agenda, rooms, open, onClose, onEdit }) {

    const { user } = useAuth();

    const roomName = agenda
        ? rooms.find(
            room => room.ROOM_ID === agenda.room
        )?.ROOM_NM ?? agenda.room
        : "";

    const canEdit =
        agenda &&
        String(user?.EMPID ?? "") === String(agenda.trainerId);

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600 }}>Detail Agenda<IconButton onClick={onClose} size="small"><CloseIcon /></IconButton></DialogTitle>
            {agenda && (

                <DialogContent>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {agenda.title}
                    </Typography>

                    <Divider
                        sx={{
                            my: 2
                        }}
                    />

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            mb: 3,
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            textTransform: "uppercase"
                        }}
                    >
                        Informasi Agenda
                    </Typography>

                    <DetailItem
                        label="Tanggal"
                        value={
                            agenda.startDate === agenda.endDate
                                ? dayjs(agenda.startDate).format("DD MMMM YYYY")
                                : `${dayjs(agenda.startDate).format("DD MMMM YYYY")} - ${dayjs(agenda.endDate).format("DD MMMM YYYY")}`
                        }
                    />

                    <DetailItem
                        label="Ruangan"
                        value={roomName}
                    />

                    <DetailItem
                        label="NIK"
                        value={agenda.trainerId}
                    />

                    <DetailItem
                        label="Nama PIC"
                        value={agenda.trainerName}
                    />

                    <DetailItem
                        label="Keterangan"
                        value={agenda.memo}
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                        Status
                    </Typography>

                    <Chip
                        label={agenda.useYn === "Y" ? "Aktif" : "Non Aktif"}
                        color={agenda.useYn === "Y" ? "success" : "default"}
                        size="small"
                    />

                </DialogContent>

            )}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3
                }}
            >

                <AppButton
                    variant="outlined"
                    sx={{
                        boxShadow: "none"
                    }}
                    onClick={onClose}
                >

                    Tutup

                </AppButton>

                <AppButton
                    onClick={onEdit}
                    disabled={
                        !canEdit ||
                        agenda?.absentStatus === "F"
                    }
                >
                    Edit Agenda
                </AppButton>

            </DialogActions>

        </Dialog>

    );

}

export default ScheduleAgendaDetailDialog;
