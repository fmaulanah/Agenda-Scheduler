import { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";

import { Typography, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import AppButton from "../../components/common/Button/AppButton";
import AttendanceSkeleton from "../../components/common/Loading/AttendanceSkeleton";

import AttendanceFilter from "./components/AttendanceFilter";
import AttendanceInfo from "./components/AttendanceInfo";
import AttendanceDialog from "./components/AttendanceDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import attendanceService from "../../services/attendanceService";

import attendanceQueue from "../../utils/attendanceQueue";

import useBeforeUnloadGuard from "../../hooks/useBeforeUnloadGuard";
import useSnackbar from "../../hooks/useSnackbar";

function Attendance() {

    const [month, setMonth] = useState(dayjs());
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [agendas, setAgendas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scanType, setScanType] = useState("IN");
    const [queueVersion, setQueueVersion] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmOpenStat, setConfirmOpenStat] = useState(false);
    const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);
    const [pendingAgenda, setPendingAgenda] = useState(null);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [attendanceSummary, setAttendanceSummary] = useState({ scanIn: 0, scanOut: 0 });

    const { showSnackbar } = useSnackbar();

    const isToday = selectedAgenda ? dayjs(selectedAgenda.startDate).isSame(dayjs(), "day") : false;

    const restoredRef = useRef(false);

    useBeforeUnloadGuard(

        attendanceQueue.hasPendingUpload()

    );

    const loadAgenda = async (showLoading = true) => {

        if (showLoading) {

            setLoading(true);

        }

        try {

            const result = await attendanceService.getAgendas(

                month.format("YYYYMM")

            );

            const data = result.map(item => ({

                id: item.SCHEDULE_ID,
                title: item.SCHEDULE_NM,
                startDate: dayjs(item.SCHEDULE_START_DT, "YYYYMMDD").format("YYYY-MM-DD"),
                endDate: dayjs(item.SCHEDULE_END_DT, "YYYYMMDD").format("YYYY-MM-DD"),
                room: item.ROOM_ID,
                roomName: item.ROOM_NAME,
                trainerId: item.TRAINER_EMPID,
                trainerName: item.TRAINER_EMP_NM,
                memo: item.MEMO,
                useYn: item.USE_YN,
                absentStatus: item.ABSENT_STATUS,
                scanOutYn: item.SCAN_OUT_YN ?? "Y"

            }));

            setAgendas(data);

            if (selectedAgenda) {

                const updatedAgenda = data.find(

                    item => item.id === selectedAgenda.id

                );

                setSelectedAgenda(updatedAgenda ?? null);

            }

        }
        finally {

            if (showLoading) {

                setLoading(false);

            }

        }

    };

    const loadAttendanceSummary = async () => {

        if (!selectedAgenda) {

            setAttendanceSummary({

                scanIn: 0,

                scanOut: 0

            });

            return;

        }

        try {
            const result = await attendanceService.getAttendanceSummary(selectedAgenda.id);

            const summary = result?.[0] ?? {};

            setAttendanceSummary({

                scanIn: Number(summary.SCAN_IN ?? 0),
                scanOut: Number(summary.SCAN_OUT ?? 0)

            });

        }
        catch (err) {

            console.error(err);

        }

    };

    const restoreAttendance = () => {

        const queue = attendanceQueue.getQueueInfo();

        if (!queue) {

            return;

        }

        const agenda = agendas.find(

            item => item.id === queue.scheduleId

        );

        if (!agenda) {



            attendanceQueue.clearQueue();

            return;

        }

        setSelectedAgenda(agenda);

        console.log("Status :", queue.status);
        setScanType(queue.status === "SCAN_IN" ? "IN" : "OUT");
        setDialogOpen(true);

        showSnackbar(

            "Attendance sebelumnya berhasil dipulihkan.",
            "info"

        );

    };

    const handleMonthChange = (event) => {

        if (attendanceQueue.hasPendingUpload()) {

            setConfirmOpen(true);
            return;

        }

        setMonth(current =>

            current.month(Number(event.target.value) - 1)

        );

    };

    const handleYearChange = (event) => {

        if (attendanceQueue.hasPendingUpload()) {

            setConfirmOpen(true);
            return;

        }

        setMonth(current =>

            current.year(Number(event.target.value))

        );

    };

    const handleDiscardQueue = () => {

        attendanceQueue.clearQueue();

        setQueueVersion(current => current + 1);

    };

    const handleRequestUpload = () => {

        const queue = attendanceQueue.getNotUploadedQueue();

        if (!queue.length) {

            showSnackbar(

                "Semua attendance sudah diupload.",

                "info"

            );

            return;

        }

        setConfirmUploadOpen(true);

    };

    const handleUpload = async () => {

        setConfirmUploadOpen(false);

        const queue = attendanceQueue.getNotUploadedQueue();

        const uploadedQueue = [];

        if (!queue.length) {

            showSnackbar(

                "Semua attendance sudah diupload.",
                "info"

            );

            return;

        }

        try {

            setUploading(true);
            console.log("Queue :", queue);

            for (const scan of queue) {

                try {

                    await attendanceService.saveScan(scan);
                    uploadedQueue.push(scan);

                }
                catch (error) {

                    console.error(

                        "Upload gagal :",
                        scan,
                        error

                    );

                }

            }

            attendanceQueue.removeUploaded(uploadedQueue);

            setQueueVersion(current => current + 1);

            const failedCount = queue.length - uploadedQueue.length;
            const uploadedCount = attendanceQueue.countAttendance(uploadedQueue);

            if (failedCount === 0) {

                showSnackbar(

                    `${uploadedCount} attendance berhasil diupload.`,

                    "success"

                );
            }
            else {

                showSnackbar(

                    `${uploadedQueue.length} berhasil, ${failedCount} gagal. Silakan upload kembali.`,

                    "warning"

                );

            }

        }
        catch (error) {

            console.error(error);

            showSnackbar(

                "Upload attendance gagal.",

                "error"

            );

        }
        finally {

            setUploading(false);

        }

    };

    const handleAgendaChange = (event) => {

        console.log("CHANGE", event.target.value);

        const agenda = agendas.find(

            item => item.id === event.target.value

        );

        if (!agenda) {

            return;

        }

        const queueInfo = attendanceQueue.getQueueInfo();

        if (

            attendanceQueue.hasPendingUpload() &&
            queueInfo?.scheduleId !== agenda.id

        ) {

            setPendingAgenda(agenda);
            setConfirmOpen(true);
            return;

        }

        setSelectedAgenda(agenda);



    };

    const handleRequestFinish = () => {

        const progress = attendanceQueue.getProgress({

            scheduleId: selectedAgenda.id,
            scanType

        });

        if (progress.uploaded !== progress.scanned) {

            showSnackbar(

                "Masih ada attendance yang belum diupload.",
                "warning"

            );

            return;

        }

        setPendingStatus(

            selectedAgenda.scanOutYn === "N"
                ? "F"
                : scanType === "IN"
                    ? "O"
                    : "F"

        );

        setConfirmOpenStat(true);

    };

    const handleFinishScan = async () => {

        try {

            console.log("agenda :", selectedAgenda.id);
            console.log("status :", pendingStatus);

            await attendanceService.setAbsentStatus(

                selectedAgenda.id,
                pendingStatus

            );

            setConfirmOpenStat(false);
            setDialogOpen(false);

            await loadAgenda();
            await loadAttendanceSummary();

            if (pendingStatus === "F") {

                attendanceQueue.clearQueue();
                setQueueVersion(current => current + 1);

            }

            showSnackbar(

                pendingStatus === "O"

                    ? "Scan IN berhasil diselesaikan."

                    : "Attendance berhasil diselesaikan.",

                "success"

            );

        }
        catch (error) {

            console.error(error);

            showSnackbar(

                "Gagal mengubah status attendance.",

                "error"

            );

        }

    };

    useEffect(() => {

        loadAgenda();

        const timer = setInterval(() => {

            if (!dialogOpen) {

                loadAgenda(false);

            }

        }, 30000);

        return () => clearInterval(timer);

    }, [month, dialogOpen]);



    useEffect(() => {

        if (restoredRef.current) {

            return;

        }

        if (!agendas.length) {

            return;

        }

        restoredRef.current = true;

        restoreAttendance();

    }, [agendas]);

    useEffect(() => {

        loadAttendanceSummary();

    }, [selectedAgenda, queueVersion]);

    if (loading) {

        return (

            <>

                <PageHeader
                    title="Attendance"
                    subtitle="Kelola absensi peserta."
                />

                <AttendanceSkeleton />

            </>

        );

    }

    return (

        <>

            <PageHeader
                title="Attendance"
                subtitle="Kelola absensi peserta."
            />

            <AttendanceFilter

                month={month.month() + 1}
                year={month.year()}
                agenda={selectedAgenda}
                agendas={agendas.filter(

                    item => item.useYn === "Y"

                )}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
                onAgendaChange={handleAgendaChange}

            />

            <AttendanceInfo

                agenda={selectedAgenda}
                scanInCount={attendanceSummary.scanIn}
                scanOutCount={attendanceSummary.scanOut}
                isToday={isToday}
                onScanIn={() => {

                    setScanType("IN");

                    setDialogOpen(true);

                }}
                onScanOut={() => {

                    setScanType("OUT");

                    setDialogOpen(true);

                }}
                onUpload={handleRequestUpload}

            />

            <AttendanceDialog

                open={dialogOpen}
                agenda={selectedAgenda}
                scanType={scanType}
                queueVersion={queueVersion}
                onClose={() => setDialogOpen(false)}
                onQueueChanged={() =>

                    setQueueVersion(current => current + 1)

                }
                onRequestFinish={handleRequestFinish}

            />

            <ConfirmDialog

                open={confirmOpen}
                title="Attendance Belum Diupload"
                message={`Masih ada attendance "${attendanceQueue.getScheduleName()}" yang belum diupload.`}
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={() => {

                    attendanceQueue.clearQueue();
                    setQueueVersion(current => current + 1);
                    setSelectedAgenda(pendingAgenda);
                    setPendingAgenda(null);
                    setConfirmOpen(false);

                }}
                onCancel={() => {

                    setPendingAgenda(null);
                    setConfirmOpen(false);

                }}

            />

            <ConfirmDialog

                open={confirmUploadOpen}
                title="Upload Attendance"
                message={`Upload ${attendanceQueue.getNotUploadedCount()} attendance ke server?`}
                confirmText="Upload"
                cancelText="Batal"
                onConfirm={handleUpload}
                onCancel={() =>

                    setConfirmUploadOpen(false)
                }

            />

            <ConfirmDialog

                open={confirmOpenStat}
                title={

                    pendingStatus === "O" ? "Selesaikan Scan Masuk" : "Selesaikan Attendance"

                }
                message={

                    pendingStatus === "O" ? "Attendance akan berpindah ke Scan Out." : "Attendance akan diselesaikan."

                }
                confirmText="Lanjutkan"
                cancelText="Batal"
                onCancel={() => setConfirmOpenStat(false)}
                onConfirm={handleFinishScan}

            />

        </>

    );

}

export default Attendance;