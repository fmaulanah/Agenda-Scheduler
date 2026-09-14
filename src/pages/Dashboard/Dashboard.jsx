import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";



import PageHeader from "../../components/common/PageHeader/PageHeader";
import DashboardSkeleton from "../../components/common/Loading/DashboardSkeleton";

import DashboardStat from "./components/DashboardStat";
import DashboardMonthlyChart from "./components/DashboardMonthlyChart";
import DashboardUpcomingTable from "./components/DashboardUpcomingTable";

import roomService from "../../services/roomService";
import agendaService from "../../services/agendaService";
import dashboardService from "../../services/dashboardService";

import useResponsive from "../../hooks/useResponsive";

function Dashboard() {

    const today = dayjs().format("YYYY-MM-DD");
    const currentMonth = dayjs().format("YYYYMM");

    const [rooms, setRooms] = useState([]);
    const [agendas, setAgendas] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({

        thisMonth: 0,
        today: 0

    });

    const { isMobile } = useResponsive();

    const upcomingAgendas = agendas.filter(agenda => agenda.useYn === "Y" &&
        agenda.startDate == today && agenda.status == null)
        .sort((a, b) => a.startDate.localeCompare(b.startDate));

    const loadMonthlyChart = async () => {

        try {

            const result = await dashboardService.getMonthlyChart(

                dayjs().format("YYYY")

            );

            setChartData(

                result.map(item => ({

                    month: item.MONTH,

                    total: Number(item.TOTAL)

                }))

            );

        }
        catch (err) {

            console.error(err);

        }

    };

    const loadSummary = async () => {

        try {

            const result = await dashboardService.getSummary();

            const summary = result?.[0] ?? {};

            setSummary({

                thisMonth: Number(summary.THIS_MONTH ?? 0),
                today: Number(summary.TODAY ?? 0)

            });

        }
        catch (err) {

            console.error(err);

        }

    };

    const loadRooms = async () => {

        try {

            const result = await roomService.getRooms();
            setRooms(result);

        }
        catch (err) {
            console.error(err);
        }

    };

    const loadAgenda = async () => {

        try {

            const result = await agendaService.getAgendas(currentMonth);

            setAgendas(

                result.map(item => ({

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
                    status: item.ABSENT_STATUS //2026.08.24 it.fikri

                }))

            );

        }
        catch (err) {

            console.error(err);

        }

    };

    const filteredAgendas = upcomingAgendas;

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                await Promise.all([

                    loadRooms(),
                    loadAgenda(),
                    loadMonthlyChart(),
                    loadSummary()

                ]);

            }
            finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    if (loading) {

        return (

            <>

                <PageHeader

                    title="Dashboard"

                    subtitle="Ringkasan agenda."

                />

                <DashboardSkeleton />

            </>

        );

    }

    return (
        <>
            <PageHeader
                title="Dashboard"
                subtitle="Ringkasan agenda."
            />

            <Grid
                container
                spacing={{
                    xs: 2,
                    md: 3
                }}
            >
                <Grid size={{ xs: 12, md: 6 }}>
                    <DashboardStat
                        title="Schedule Bulan Ini"
                        value={summary.thisMonth}
                        iconKey="month"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <DashboardStat
                        title="Agenda Hari Ini"
                        value={summary.today}
                        iconKey="today"
                        color="info.main"
                    />
                </Grid>

            </Grid>

            <Box
                sx={{
                    mt: {
                        xs: 4,
                        md: 3
                    }
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        size={{
                            xs: 12,
                            xl: 6
                        }}
                    >

                        <DashboardMonthlyChart

                            data={chartData}
                            isMobile={isMobile}

                        />

                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            xl: 6
                        }}
                    >

                        <DashboardUpcomingTable

                            rows={filteredAgendas}

                        />

                    </Grid>


                </Grid>

            </Box>
        </>
    );
}

export default Dashboard;
