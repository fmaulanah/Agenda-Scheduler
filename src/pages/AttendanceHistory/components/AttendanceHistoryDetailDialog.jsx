import { useEffect, useState } from "react";

import { Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography, Tooltip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";

import { displayValue, formatStatus, formatAgendaDate, formatYesNo } from "../../../utils/formatter/attendanceHistoryFormatter";
import { exportAttendance } from "../../../utils/export/attendanceExport";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import attendanceHistoryService from "../../../services/attendanceHistoryService";

import AppButton from "../../../components/common/Button/AppButton";

function AttendanceHistoryDetailDialog({ open, onClose, agenda }) {

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const status = formatStatus(

        agenda?.ABSENT_STATUS

    );

    const loadDetail = async () => {

        console.log("Detail :", agenda);

        if (!agenda?.SCHEDULE_ID) {

            return;

        }

        try {

            setLoading(true);

            const result = await attendanceHistoryService.getHistoryDetail(agenda.SCHEDULE_ID);

            console.log(result);

            setRows(result);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    };

    const handleExportExcel = async () => {

        try {

            await exportAttendance(

                agenda,
                rows

            );

        }
        catch (error) {

            console.error(error);

        }

    };

    const columns = [

        {
            field: "EMPID",
            headerName: "EMPID",
            width: 130
        },

        {
            field: "EMP_NAME",
            headerName: "Employee Name",
            flex: 1,
            minWidth: 220
        },

        {
            field: "SCAN_IN",
            headerName: "Scan In",
            width: 110,
            align: "center",
            headerAlign: "center",
            valueGetter: (_, row) => formatYesNo(row.SCAN_IN)
        },

        {
            field: "SCAN_IN_TIME",
            headerName: "Scan In Time",
            width: 150,
            align: "center",
            headerAlign: "center"
        },


        {
            field: "SCAN_OUT",
            headerName: "Scan Out",
            width: 110,
            align: "center",
            headerAlign: "center",
            valueGetter: (_, row) => formatYesNo(row.SCAN_OUT)
        },

        {
            field: "SCAN_OUT_TIME",
            headerName: "Scan Out Time",
            width: 150,
            align: "center",
            headerAlign: "center"
        },

        {
            field: "PHONE_NO",
            headerName: "Phone",
            flex: 1,
            minWidth: 150
        },

        {
            field: "MEMO",
            headerName: "Memo",
            flex: 1,
            minWidth: 200
        }

    ];

    useEffect(() => {

        if (open) {

            loadDetail();

        }

    }, [open, agenda]);

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"
            slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}

        >

            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600 }}>
                Attendance Detail
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2}>

                    <Stack spacing={2}>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                {displayValue(agenda?.TRAINING_NAME)}
                            </Typography>

                            <Tooltip
                                title="Export Excel"
                                arrow
                            >

                                <span>

                                    <AppButton

                                        color="success"

                                        onClick={handleExportExcel}

                                        disabled={rows.length === 0}

                                        sx={{

                                            minWidth: 42,
                                            width: 42,
                                            height: 42,
                                            p: 0,
                                            boxShadow: "none"

                                        }}

                                    >

                                        <FileDownloadIcon />

                                    </AppButton>

                                </span>

                            </Tooltip>

                        </Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >

                            <CalendarTodayOutlinedIcon
                                color="action"
                                fontSize="small"
                            />

                            <Typography
                                color="text.secondary"
                            >

                                {formatAgendaDate(agenda?.TRAINING_DATE)}

                            </Typography>

                        </Stack>

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row"
                            }}
                            spacing={3}
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >

                                <PersonOutlineOutlinedIcon
                                    color="primary"
                                    fontSize="small"
                                />

                                <Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >

                                        PIC

                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                    >

                                        {displayValue(agenda?.TRAINER_NAME)}

                                    </Typography>

                                </Box>

                            </Stack>

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >

                                <MeetingRoomOutlinedIcon
                                    color="primary"
                                    fontSize="small"
                                />

                                <Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >

                                        Room

                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                    >

                                        {displayValue(agenda?.ROOM_NAME)}

                                    </Typography>

                                </Box>

                            </Stack>

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >

                                    Status

                                </Typography>

                                <Box mt={0.5}>

                                    <Chip

                                        label={status.label}

                                        color={status.color}

                                        size="small"

                                    />

                                </Box>

                            </Box>

                        </Stack>

                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <DataGrid

                        rows={rows}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.EMPID}
                        density="comfortable"
                        disableRowSelectionOnClick
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                        slots={{ noRowsOverlay: () => <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><Typography color="text.secondary">Tidak ada peserta.</Typography></Box> }}
                        autoHeight

                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <AppButton

                    onClick={onClose}

                >

                    Tutup

                </AppButton>

            </DialogActions>

        </Dialog>

    );

}

export default AttendanceHistoryDetailDialog;