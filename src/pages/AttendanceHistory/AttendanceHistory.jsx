import dayjs from "dayjs";
import { useEffect, useState } from "react";

import {
    Box
} from "@mui/material";


import PageHeader from "../../components/common/PageHeader/PageHeader";
import SkeletonTable from "../../components/common/Loading/SkeletonTable";

import AttendanceHistoryFilter from "./components/AttendanceHistoryFilter";
import AttendanceHistoryTable from "./components/AttendanceHistoryTable";
import AttendanceHistoryList from "./components/AttendanceHistoryList";
import AttendanceHistoryDetailDialog from "./components/AttendanceHistoryDetailDialog";

import useResponsive from "../../hooks/useResponsive";
import useSnackbar from "../../hooks/useSnackbar";

import attendanceHistoryService from "../../services/attendanceHistoryService";

function AttendanceHistory() {

    const { isMobile } = useResponsive();
    const { showSnackbar } = useSnackbar();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);

    const [filter, setFilter] = useState({

        fromDate: dayjs().format("YYYY-MM-DD"),
        toDate: dayjs().format("YYYY-MM-DD"),
        agenda: "",
        trainer: "",
        status: ""

    });

    const loadHistory = async (currentFilter = filter) => {

        try {

            setLoading(true);

            const result = await attendanceHistoryService.getHistory(currentFilter);

            setRows(result);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    };

    const handleSearch = () => {
        if (filter.fromDate && filter.toDate && filter.fromDate > filter.toDate) {
            showSnackbar("From Date tidak boleh melebihi To Date.", "warning");
            return;
        }
        loadHistory(filter);
    };

    const handleFilterChange = (field, value) => {

        setFilter(current => ({

            ...current,

            [field]: value

        }));

    };

    const handleOpenDetail = (agenda) => {

        console.log("Handle Detail :", agenda);
        setSelectedAgenda(agenda);
        setDetailOpen(true);

    };

    const handleCloseDetail = () => {

        setDetailOpen(false);
        setSelectedAgenda(null);

    };

    useEffect(() => {

        loadHistory(filter);

    }, []);

    return (

        <Box>

            <PageHeader

                title="Attendance History"
                subtitle="Riwayat attendance agenda."

            />

            <Box sx={{ position: "sticky", top: 72, zIndex: 1, bgcolor: "#F5F7FA", py: 1, mx: -3, px: 3, mb: 2 }}>
                <AttendanceHistoryFilter
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    loading={loading}
                />
            </Box>

            {isMobile ? (
                loading ? (
                    <SkeletonTable rows={5} />
                ) : (
                    <AttendanceHistoryList rows={rows} onDetail={handleOpenDetail} />
                )
            ) : loading ? (
                <SkeletonTable rows={8} />
            ) : (
                <AttendanceHistoryTable rows={rows} onDetail={handleOpenDetail} />
            )}

            <AttendanceHistoryDetailDialog

                open={detailOpen}
                onClose={handleCloseDetail}
                agenda={selectedAgenda}

            />

        </Box>

    );

}

export default AttendanceHistory;