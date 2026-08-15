import dayjs from "dayjs";
import { useEffect, useState } from "react";

import {
    Box
} from "@mui/material";


import PageHeader from "../../components/common/PageHeader/PageHeader";
import SkeletonTable from "../../components/common/Loading/SkeletonTable";

import AttendanceHistoryFilter from "./components/AttendanceHistoryFilter";
import AttendanceHistoryToolbar from "./components/AttendanceHistoryToolbar.jsx";
import AttendanceHistoryTable from "./components/AttendanceHistoryTable";
import AttendanceHistoryList from "./components/AttendanceHistoryList";
import AttendanceHistoryDetailDialog from "./components/AttendanceHistoryDetailDialog";

import useResponsive from "../../hooks/useResponsive";

import attendanceHistoryService from "../../services/attendanceHistoryService";

function AttendanceHistory() {

    const { isMobile } = useResponsive();

    const [view, setView] = useState("table");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);

    const [filter, setFilter] = useState({

        fromDate: dayjs().format("YYYY-MM-DD"),
        toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
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

        setView(isMobile ? "list" : "table");

    }, [isMobile]);

    useEffect(() => {

        loadHistory(filter);

    }, []);

    return (

        <Box>

            <PageHeader

                title="Attendance History"
                subtitle="Riwayat attendance agenda."

            />

            <AttendanceHistoryFilter

                filter={filter}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                loading={loading}

            />

            <Box
                sx={{
                    mt: 3
                }}
            >

                {

                    loading

                        ? (

                            <SkeletonTable rows={8} />

                        )

                        : (

                            view === "table"

                                ? (

                                    <AttendanceHistoryTable

                                        rows={rows}
                                        onDetail={handleOpenDetail}

                                    />

                                )

                                : (

                                    <AttendanceHistoryList

                                        rows={rows}
                                        onDetail={handleOpenDetail}

                                    />

                                )

                        )

                }

            </Box>

            <AttendanceHistoryDetailDialog

                open={detailOpen}
                onClose={handleCloseDetail}
                agenda={selectedAgenda}

            />

        </Box>

    );

}

export default AttendanceHistory;