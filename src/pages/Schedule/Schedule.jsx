import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";

import AddIcon from "@mui/icons-material/Add";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import AppCard from "../../components/common/Card/AppCard";
import AppButton from "../../components/common/Button/AppButton";
import ScheduleSkeleton from "../../components/common/Loading/ScheduleSkeleton";

import ScheduleToolbar from "./components/ScheduleToolbar";
import ScheduleCalendar from "./components/ScheduleCalendar";
import ScheduleList from "./components/ScheduleList";

const ScheduleDayDialog = lazy(() => import("./components/ScheduleDayDialog"));
const ScheduleAgendaDialog = lazy(() => import("./components/ScheduleAgendaDialog"));
const ScheduleAgendaDetailDialog = lazy(() => import("./components/ScheduleAgendaDetailDialog"));

import calendarService from "../../services/calendarService";
import trainerService from "../../services/trainerService";
import roomService from "../../services/roomService";
import agendaService from "../../services/agendaService";

import useResponsive from "../../hooks/useResponsive";
import useSnackbar from "../../hooks/useSnackbar";


const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const CURRENT_YEAR = dayjs().year();
const YEARS = Array.from(
    { length: CURRENT_YEAR + 10 - 2000 + 1 },
    (_, index) => 2000 + index
);

const initialForm = {

    title: "",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    room: "TR01",
    trainerId: "",
    trainerName: "",
    memo: "",
    useYn: "Y",
    scanOutYn: "N"

};

function Schedule() {

    const [month, setMonth] = useState(dayjs().startOf("month"));
    const [agendas, setAgendas] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [trainerError, setTrainerError] = useState("");
    const [holidays, setHolidays] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);

    const [isDirty, setIsDirty] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { isMobile } = useResponsive();
    const { showSnackbar } = useSnackbar();

    const dndSensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const draggedAgenda = active.data.current?.agenda;
        const targetDate = over.data.current?.date;
        if (!draggedAgenda || !targetDate) return;
        const oldDate = draggedAgenda.startDate;
        if (oldDate === targetDate) return;
        const diffDays = dayjs(draggedAgenda.endDate).diff(dayjs(draggedAgenda.startDate), "day");
        const newEndDate = dayjs(targetDate).add(diffDays, "day").format("YYYY-MM-DD");
        setAgendas(prev => prev.map(a => a.id === draggedAgenda.id ? { ...a, startDate: targetDate, endDate: newEndDate } : a));
        try {
            await agendaService.updateAgenda(draggedAgenda.id, { ...draggedAgenda, startDate: targetDate, endDate: newEndDate }, roomMap[draggedAgenda.room]);
            showSnackbar("Agenda berhasil dipindahkan.", "success");
        } catch {
            setAgendas(prev => prev.map(a => a.id === draggedAgenda.id ? { ...a, startDate: oldDate, endDate: draggedAgenda.endDate } : a));
            showSnackbar("Gagal memindahkan agenda.", "error");
        }
    };

    const [dayDialog, setDayDialog] = useState({

        open: false,
        date: "",
        agendas: []

    });

    const calendarDays = useMemo(() => {
        const leadingDays = month.day();
        const daysInMonth = month.daysInMonth();

        return [
            ...Array.from({ length: leadingDays }, () => null),
            ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
        ];
    }, [month]);

    const holidaySet = useMemo(() => {
        return new Set(
            holidays.map(item => dayjs(item.CAL_DATE, "YYYYMMDD").format("YYYY-MM-DD"))
        );
    }, [holidays]);

    const roomMap = useMemo(() => (

        Object.fromEntries(

            rooms.map(room => [

                room.ROOM_ID,

                room.ROOM_NM

            ])

        )

    ), [rooms]);

    const monthlyAgendas = useMemo(() => (

        agendas.filter(agenda =>

            dayjs(agenda.startDate).format("YYYY-MM") ===
            month.format("YYYY-MM")

        )

    ), [agendas, month]);

    const loadHoliday = async () => {

        try {

            const result = await calendarService.getHoliday(month.year());

            setHolidays(result);

        }
        catch (err) {

            console.error(err);

        }

    };

    const loadRoom = async () => {

        try {

            const result = await roomService.getRooms();

            setRooms(result);

            if (result.length > 0) {

                setForm(current => ({

                    ...current,

                    room: current.room || result[0].ROOM_ID

                }));

            }

        }
        catch (err) {

            console.error(err);

        }

    };

    const loadAgenda = async (showLoading = true) => {

        if (showLoading) {

            setLoading(true);

        }

        try {

            const result = await agendaService.getAgendas(

                month.format("YYYYMM")

            );

            setAgendas(

                result.map(item => ({

                    id: item.SCHEDULE_ID,
                    title: item.SCHEDULE_NM,
                    startDate: dayjs(item.SCHEDULE_START_DT, "YYYYMMDD").format("YYYY-MM-DD"),
                    endDate: dayjs(item.SCHEDULE_END_DT, "YYYYMMDD").format("YYYY-MM-DD"),
                    room: item.ROOM_ID,
                    trainerId: item.TRAINER_EMPID,
                    trainerName: item.TRAINER_EMP_NM,
                    memo: item.MEMO,
                    useYn: item.USE_YN,
                    absentStatus: item.ABSENT_STATUS,
                    scanOutYn: item.SCAN_OUT_YN ?? "Y"

                }))

            );

        }
        catch (err) {

            console.error(err);

        }
        finally {

            if (showLoading) {

                setLoading(false);

            }

        }

    };

    const handleChange = (event) => {

        setIsDirty(true);

        const { name, value } = event.target;

        setForm((current) => {

            const next = {
                ...current,
                [name]: value
            };

            // Khusus Trainer
            if (name === "trainerId") {

                setTrainerError("");

                next.trainerId = value;
                next.trainerName = "";

            }

            // Jika Start Date lebih besar dari End Date
            if (
                name === "startDate" &&
                next.endDate &&
                value > next.endDate
            ) {

                next.endDate = value;

            }

            // Jika End Date lebih kecil dari Start Date
            if (
                name === "endDate" &&
                next.startDate &&
                value < next.startDate
            ) {

                next.startDate = value;

            }

            return next;

        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            if (editingId) {

                await agendaService.updateAgenda(

                    editingId,

                    form,

                    roomMap[form.room]

                );

            }
            else {

                await agendaService.saveAgenda(

                    form,

                    roomMap[form.room]

                );

            }

            await loadAgenda();

            closeFormDialog();

            showSnackbar(

                editingId
                    ? "Agenda berhasil diperbarui."
                    : "Agenda berhasil disimpan.",

                "success"

            );

            setIsDirty(false);

        }
        catch (err) {

            console.error(err);

            showSnackbar(

                "Gagal menyimpan agenda.",
                "error"

            );

        }
        finally {

            setSaving(false);

        }

    };

    const handleSearchTrainer = async () => {

        if (!form.trainerId.trim()) {

            setForm(current => ({
                ...current,
                trainerName: ""
            }));

            return;
        }

        try {

            const result = await trainerService.getTrainer(form.trainerId);

            if (!result || result.length === 0) {

                setTrainerError("PIC tidak ditemukan.");

                showSnackbar(

                    "PIC tidak ditemukan.",
                    "warning"

                );

                setForm(current => ({
                    ...current,
                    trainerName: ""
                }));

                return;

            }

            setTrainerError("");

            setForm(current => ({
                ...current,
                trainerName: result[0].EMP_NAME
            }));

        }
        catch (err) {

            console.error(err);

        }

    };

    const handleTrainerKeyDown = async (event) => {

        if (event.key !== "Enter") {

            return;

        }

        event.preventDefault();

        await handleSearchTrainer();

    };

    const handleUseYnChange = (event) => {

        setForm(current => ({

            ...current,

            useYn: event.target.checked ? "Y" : "N"

        }));

    };

    const openCreateDialog = () => {
        setEditingId(null);
        setForm(initialForm);
        setDialogOpen(true);
    };

    const closeFormDialog = () => {
        setDialogOpen(false);
        setEditingId(null);
        setForm(initialForm);
    };

    const openEditDialog = () => {

        if (!selectedAgenda) {

            return;

        }

        if (selectedAgenda.absentStatus === "F") {

            showSnackbar(
                "Agenda yang sudah selesai tidak dapat diedit.",
                "warning"
            );

            return;

        }

        setEditingId(selectedAgenda.id);

        setForm({
            title: selectedAgenda.title,
            startDate: selectedAgenda.startDate,
            endDate: selectedAgenda.endDate,
            room: selectedAgenda.room,
            trainerId: selectedAgenda.trainerId ?? "",
            trainerName: selectedAgenda.trainerName ?? "",
            memo: selectedAgenda.memo ?? "",
            useYn: selectedAgenda.useYn ?? "Y",
            scanOutYn: selectedAgenda.scanOutYn ?? "Y"
        });

        setSelectedAgenda(null);
        setDialogOpen(true);
    };

    useEffect(() => {

        const loadSchedule = async () => {

            setLoading(true);

            try {

                await Promise.all([

                    loadHoliday(),
                    loadRoom(),
                    loadAgenda(false)

                ]);

            }
            finally {

                setLoading(false);

            }

        };

        loadSchedule();

    }, [month]);

    if (loading) {

        return (

            <>

                <PageHeader
                    title="Agenda Schedule"
                    subtitle="Kelola jadwal dan agenda."
                />

                <ScheduleSkeleton />

            </>

        );

    }

    return (
        <>
            <PageHeader
                title="Agenda Schedule"
                subtitle="Kelola jadwal dan agenda."
            />

            {isMobile ? (

                <Box
                    sx={{
                        // display: "flex",
                        // flexDirection: "column",
                        // minHeight: "calc(100vh - 180px)"
                    }}
                >

                    <Box
                        sx={{
                            position: "sticky",
                            top: 72,
                            zIndex: 1,
                            bgcolor: "#F5F7FA",
                            py: 1,
                            mx: -3,
                            px: 3,
                            mb: 1.5
                        }}
                    >

                        <ScheduleToolbar
                            month={month}
                            MONTHS={MONTHS}
                            YEARS={YEARS}
                            setMonth={setMonth}
                            onAddAgenda={openCreateDialog}
                            onRefresh={loadAgenda}
                        />

                    </Box>

                    <Box
                        sx={{
                            mt: 0
                        }}
                    >

                        <ScheduleList
                            agendas={monthlyAgendas}
                            roomMap={roomMap}
                            onSelectAgenda={setSelectedAgenda}
                        />

                    </Box>

                </Box>

            ) : (

                <DndContext sensors={dndSensors} onDragEnd={handleDragEnd}>
                    <Box
                        sx={{
                            position: "sticky",
                            top: 72,
                            zIndex: 1,
                            bgcolor: "#F5F7FA",
                            py: 1,
                            mb: 1.5
                        }}
                    >
                        <ScheduleToolbar
                            month={month}
                            MONTHS={MONTHS}
                            YEARS={YEARS}
                            setMonth={setMonth}
                            onAddAgenda={openCreateDialog}
                            onRefresh={loadAgenda}
                        />
                    </Box>
                    <AppCard
                        sx={{
                            "& .MuiCardContent-root": {
                                p: 0
                            }
                        }}
                    >
                        <ScheduleCalendar
                            month={month}
                            calendarDays={calendarDays}
                            agendas={monthlyAgendas}
                            holidaySet={holidaySet}
                            onSelectAgenda={setSelectedAgenda}
                            onShowMore={(date, agendas) =>
                                setDayDialog({
                                    open: true,
                                    date,
                                    agendas
                                })
                            }
                        />
                    </AppCard>
                </DndContext>

            )}

            <Suspense fallback={<ScheduleSkeleton />}>
                <ScheduleAgendaDialog
                    open={dialogOpen}
                    editingId={editingId}
                    form={form}
                    rooms={rooms}
                    trainerError={trainerError}
                    confirmOpen={confirmOpen}
                    setConfirmOpen={setConfirmOpen}
                    isDirty={isDirty}
                    setIsDirty={setIsDirty}
                    onChange={handleChange}
                    onSearchTrainer={handleSearchTrainer}
                    onTrainerKeyDown={handleTrainerKeyDown}
                    onSubmit={handleSubmit}
                    onUseYnChange={handleUseYnChange}
                    onClose={closeFormDialog}
                />

                <ScheduleAgendaDetailDialog
                    agenda={selectedAgenda}
                    rooms={rooms}
                    open={Boolean(selectedAgenda)}
                    onClose={() => setSelectedAgenda(null)}
                    onEdit={openEditDialog}
                />

                <ScheduleDayDialog

                    open={dayDialog.open}

                    date={dayDialog.date}

                    agendas={dayDialog.agendas}

                    roomMap={roomMap}

                    onClose={() =>

                        setDayDialog({

                            open: false,

                            date: "",

                            agendas: []

                        })

                    }

                    onSelectAgenda={setSelectedAgenda}

                />
            </Suspense>
        </>
    );
}

export default Schedule;
