import {
    Dialog, DialogActions, DialogContent, DialogTitle, MenuItem,
    TextField, FormControlLabel, Checkbox, Switch, Typography, IconButton,
    Radio, RadioGroup, FormLabel, FormControl
} from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";

import AppButton from "../../../components/common/Button/AppButton";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import LoadingOverlay from "../../../components/common/Loading/LoadingOverlay";

function ScheduleAgendaDialog({ open, editingId, form, rooms, trainerError, saving,
    confirmOpen, setConfirmOpen, isDirty, setIsDirty,
    onChange, onSearchTrainer, onTrainerKeyDown, onClose,
    onSubmit, onUseYnChange, }) {
    const handleClose = () => {

        if (!isDirty) {

            onClose();

            return;

        }

        setConfirmOpen(true);

    };

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            component="form"
            onSubmit={onSubmit}
            slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
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
                    onClick={handleClose}
                    size="small"
                >

                    <CloseIcon />

                </IconButton>

            </DialogTitle>

            <DialogContent
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr"
                    },
                    gap: 2,
                    pt: "12px !important"
                }}
            >

                <TextField
                    name="title"
                    label="Nama Agenda"
                    value={form.title}
                    onChange={onChange}
                    disabled={saving}
                    required
                    sx={{
                        gridColumn: "1 / -1"
                    }}
                />

                <TextField
                    name="startDate"
                    label="Tanggal Mulai"
                    type="date"
                    value={form.startDate}
                    onChange={onChange}
                    disabled={saving}
                    required
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                    inputProps={{
                        max: form.endDate
                    }}
                />

                <TextField
                    name="endDate"
                    label="Tanggal Selesai"
                    type="date"
                    value={form.endDate}
                    onChange={onChange}
                    disabled={saving}
                    required
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                    inputProps={{
                        min: form.startDate
                    }}
                />

                <TextField
                    name="trainerId"
                    label="NIK PIC"
                    value={form.trainerId}
                    onChange={onChange}
                    onBlur={onSearchTrainer}
                    onKeyDown={onTrainerKeyDown}
                    error={Boolean(trainerError)}
                    helperText={trainerError}
                    disabled={saving}
                    required
                />

                <TextField
                    name="trainerName"
                    label="Nama PIC"
                    value={form.trainerName}
                    disabled={saving}
                    slotProps={{
                        input: {
                            readOnly: true
                        }
                    }}
                    sx={{
                        "& .MuiInputBase-input.Mui-readOnly": {
                            bgcolor: "#F8F9FA"
                        }
                    }}
                />

                <TextField
                    name="room"
                    label="Ruangan"
                    select
                    value={form.room}
                    disabled={saving}
                    onChange={onChange}
                    required
                >

                    {rooms.map((room) => (

                        <MenuItem
                            key={room.ROOM_ID}
                            value={room.ROOM_ID}
                        >

                            {room.ROOM_NM}

                        </MenuItem>

                    ))}

                </TextField>

                <FormControl
                    sx={{
                        gridColumn: "1 / -1"
                    }}
                >
                    <FormLabel>
                        Metode Attendance
                    </FormLabel>

                    <RadioGroup
                        row
                        name="scanOutYn"
                        value={form.scanOutYn}
                        onChange={onChange}
                    >

                        <FormControlLabel
                            value="N"
                            control={<Radio />}
                            label="Sekali Scan"
                            disabled={saving}
                        />

                        <FormControlLabel
                            value="Y"
                            control={<Radio />}
                            label="Scan In & Scan Out"
                            disabled={saving}
                        />

                    </RadioGroup>
                </FormControl>

                <TextField
                    name="memo"
                    label="Keterangan"
                    value={form.memo}
                    onChange={onChange}
                    disabled={saving}
                    multiline
                    rows={3}
                    sx={{
                        gridColumn: "1 / -1"
                    }}
                />

                <FormControlLabel

                    sx={{
                        gridColumn: "1 / -1"
                    }}

                    control={

                        <Switch

                            checked={form.useYn === "Y"}
                            onChange={onUseYnChange}
                            disabled={!editingId}

                        />

                    }
                    title={!editingId ? "Aktif/non-aktif hanya saat edit" : undefined}

                    label={
                        <Typography
                            fontWeight={600}
                            color={
                                form.useYn === "Y" ? "success.main" : "text.secondary"
                            }
                        >
                            {form.useYn === "Y" ? "Agenda Aktif" : "Agenda Non Aktif"}
                        </Typography>
                    }

                />

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3
                }}
            >
                <AppButton
                    type="submit"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Agenda"}

                </AppButton>

            </DialogActions>

            <ConfirmDialog

                open={confirmOpen}

                title="Perubahan Belum Disimpan"

                message="Perubahan yang sudah Anda lakukan akan hilang. Tetap keluar?"

                confirmText="Keluar"

                cancelText="Kembali"

                onConfirm={() => {

                    setConfirmOpen(false);

                    setIsDirty(false);

                    onClose();

                }}

                onCancel={() =>

                    setConfirmOpen(false)

                }

            />

        </Dialog>

    );

}

export default ScheduleAgendaDialog;