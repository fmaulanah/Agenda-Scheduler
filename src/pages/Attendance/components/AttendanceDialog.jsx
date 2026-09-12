import { useEffect, useRef, useState, useMemo  } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    TextField,
    Typography,
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Avatar,
    LinearProgress
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SensorsIcon from "@mui/icons-material/Sensors";

import AppButton from "../../../components/common/Button/AppButton";
import AppCard from "../../../components/common/Card/AppCard";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import attendanceQueue from "../../../utils/attendanceQueue";

import employeeService from "../../../services/employeeService"

import useSnackbar from "../../../hooks/useSnackbar";
import useResponsive from "../../../hooks/useResponsive";

import ScanSuccessSound from "../../../assets/sounds/beep.mp3";
import attendanceService from "../../../services/attendanceService";

function AttendanceDialog({ open, agenda, scanType, queueVersion, onClose, onQueueChanged, onRequestFinish }) 
{

    const [rfid, setRfid] = useState("");
    const [manualYn, setManualYn] = useState("N");
    const [lastEmployee, setLastEmployee] = useState(null);
    const [serverProgress, setServerProgress] = useState(0);

    const inputRef = useRef(null);
    const scanningRef = useRef(false);
    
    const { showSnackbar } = useSnackbar();
    const { isMobile } = useResponsive();

    const audioRef = useRef(new Audio(ScanSuccessSound));
    const isSingleScan = agenda?.scanOutYn === "N";

    const loadProgress = async () => {

        if (!agenda) {

            return;

        }

        try {

            const result = await attendanceService.getProgress(

                agenda.id,

                scanType

            );

            setServerProgress(

                Number(result[0].UPLOADED ?? 0)

            );

        }
        catch (error) {

            console.error(error);

            setServerProgress(0);

        }

    };

    const handleScan = async (event) => {

        if (event.key !== "Enter") {

            return;

        }

        event.preventDefault();

        if (scanningRef.current) {

            return;

        }

        const value = rfid.trim();

        if (!value) {

            return;

        }

        scanningRef.current = true;

        try {

            const employee = manualYn === "N" ? employeeService.findEmployeeByRFID(value) : employeeService.findEmployeeByEmpId(value);

            if (!employee) {

                showSnackbar("Employee tidak ditemukan.", "error");

                return;

            }

            if (agenda.scanOutYn === "N") {

                const { scanIn, scanOut } =
                    attendanceQueue.createSingleScanQueues({

                        employee,
                        agenda,
                        manualYn

                    });

                const resultIn = attendanceQueue.addQueue(scanIn);

                if (!resultIn.success) {

                    showSnackbar(resultIn.message, "warning");

                    return;

                }

                const resultOut = attendanceQueue.addQueue(scanOut);

                if (!resultOut.success) {

                    showSnackbar(resultOut.message, "warning");

                    return;

                }

            }
            else {

                const queue = attendanceQueue.createQueue({

                    employee,
                    agenda,
                    scanType,
                    manualYn

                });

                const result = attendanceQueue.addQueue(queue);

                if (!result.success) {

                    showSnackbar(result.message, "warning");

                    return;

                }

            }

            onQueueChanged?.();

            showSnackbar(

                `${employee.EMP_NAME} berhasil scan.`,

                "success"

            );

            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});

            setLastEmployee({

                empId: employee.EMPID,

                empName: employee.EMP_NAME

            });

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setRfid("");

            requestAnimationFrame(() => {

                inputRef.current?.focus();

            });

            setTimeout(() => {

                scanningRef.current = false;

            }, 300);

        }

    };

    const progress = useMemo(() => {

        if (!agenda) {

            return {

                uploaded: 0,

                scanned: 0

            };

        }

        const localProgress = attendanceQueue.getProgress({

            scheduleId: agenda.id,

            scanType

        });

        return {

            uploaded: serverProgress + localProgress.uploaded,

            scanned: serverProgress + localProgress.scanned

        };

    }, [

        agenda,

        scanType,

        queueVersion,

        serverProgress

    ]);

    useEffect(() => {

        if (!open) {

            return;

        }

        setManualYn("N");
        setRfid("");
        setLastEmployee(null);
        loadProgress();

        setTimeout(() => {

            inputRef.current?.focus();

        }, 150);

    }, [open]);

    if (!agenda) {

        return null;

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                Scan Attendance
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>

            </DialogTitle>

            <Box
                sx={{
                    px: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >

                <Typography
                    fontWeight={700}
                    color={
                        isSingleScan
                            ? "primary.main"
                            : scanType === "IN"
                                ? "success.dark"
                                : "warning.dark"
                    }
                >
                    {
                        isSingleScan
                            ? "🔵 ATTENDANCE"
                            : scanType === "IN"
                                ? "🟢 SCAN IN"
                                : "🟠 SCAN OUT"
                    }
                </Typography>

                <Typography
                    fontWeight={700}
                    variant="body"
                >

                     {progress.uploaded} / {progress.scanned}

                </Typography>

            </Box>
            <Box sx={{ px: 3, mt: 1 }}>
                <LinearProgress variant="determinate" value={progress.scanned ? Math.round((progress.uploaded / progress.scanned) * 100) : 0} sx={{ height: 6, borderRadius: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "right", mt: 0.5 }}>{progress.scanned ? Math.round((progress.uploaded / progress.scanned) * 100) : 0}% uploaded</Typography>
            </Box>

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={12}>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >

                            {agenda.title}

                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5
                            }}
                        >

                            👤 {agenda.trainerName}

                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            🏠 {agenda.roomName}

                        </Typography>

                    </Grid>

                    <Grid size={12}>

                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mb: 1
                            }}
                        >
                            Mode Input
                        </Typography>

                        <ToggleButtonGroup
                            exclusive
                            fullWidth
                            value={manualYn}
                            onChange={(event, value) => {

                                if (!value) {

                                    return;

                                }

                                setManualYn(value);

                                setRfid("");

                                requestAnimationFrame(() => {

                                    inputRef.current?.focus();

                                });

                            }}
                        >

                            <ToggleButton value="N">

                                Scan RFID

                            </ToggleButton>

                            <ToggleButton value="Y">

                                Manual

                            </ToggleButton>

                        </ToggleButtonGroup>

                    </Grid>

                    <Grid size={12}>

                        <Box
                            sx={{

                                mt: 1,

                                p: 3,

                                borderRadius: 2,

                                bgcolor: "grey.100",

                                textAlign: "center"

                            }}
                        >

                            {manualYn == "N" ?
                                <SensorsIcon
                                    color="primary"
                                    sx={{
                                        fontSize: 48
                                    }}
                                />
                                :
                                null
                            }

                            <Typography
                                sx={{
                                    mt: 1,
                                    mb: 2,
                                    fontWeight: 600
                                }}
                            >

                                {manualYn == "N" ? "Tempelkan RFID" : "Masukan NIK"}

                            </Typography>

                            <TextField
                                inputRef={inputRef}
                                fullWidth
                                autoComplete="off"
                                autoFocus
                                value={rfid}
                                label={ manualYn === "N" ? "RFID" : "NIK" }
                                placeholder={ manualYn === "N" ? "Tempelkan RFID..." : "Masukkan NIK..."}
                                onChange={(event) => {

                                    setRfid(event.target.value);

                                }}
                                onKeyDown={handleScan}
                            />

                        </Box>

                        {lastEmployee && (

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >

                                {/* <Avatar
                                    sx={{
                                        bgcolor: "primary.main"
                                    }}
                                >

                                    <PersonIcon />

                                </Avatar> */}

                                <Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Employee
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                    >
                                        {lastEmployee.empName}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {lastEmployee.empId}
                                    </Typography>

                                </Box>

                            </Stack>

                        )}

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <AppButton
                    fullWidth
                    disabled={progress.scanned === 0}
                    onClick={onRequestFinish}
                >

                    Selesai Scan

                </AppButton>

                <AppButton
                    
                    fullWidth
                    onClick={onClose}
                >

                    Tutup

                </AppButton>

            </DialogActions>

        </Dialog>

    );

}

export default AttendanceDialog;