import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton
} from "@mui/material";

import {

    formatCompletion,
    formatStatus,
    formatAgendaDate,
    displayValue

} from "../../../utils/formatter/attendanceHistoryFormatter";

import { DataGrid } from "@mui/x-data-grid";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";

import EmptyState from "../../../components/common/Empty/EmptyState";

function AttendanceHistoryTable({ rows, loading, onDetail }) {


    const columns = [

        {
            field: "TRAINING_DATE",
            headerName: "Date",
            width: 120
        },

        {
            field: "TRAINING_NAME",
            headerName: "Agenda",
            minWidth: 250,
            flex: 1,
            valueGetter: (_, row) => displayValue(row.TRAINING_NAME)
        },

        {
            field: "TRAINER_NAME",
            headerName: "PIC",
            width: 180,
            valueGetter: (_, row) => displayValue(row.TRAINER_NAME)
        },

        {
            field: "ROOM_NAME",
            headerName: "Room",
            width: 150,
            valueGetter: (_, row) => displayValue(row.ROOM_NAME)
        },

        {
            field: "ABSENT_STATUS",
            headerName: "Status",
            width: 130,

            renderCell: ({ row }) => {

                const status = formatStatus(row.ABSENT_STATUS);

                return (

                    <Chip

                        label={status.label}
                        color={status.color}
                        size="small"

                    />

                );

            }

        },

        {
            field: "SCAN_IN",

            headerName: "Scan In",

            width: 110,

            align: "center",

            headerAlign: "center"

        },

        {
            field: "SCAN_OUT",

            headerName: "Scan Out",

            width: 110,

            align: "center",

            headerAlign: "center"

        },

        {
            field: "completion",

            headerName: "Completion",

            width: 120,

            align: "center",

            headerAlign: "center",

            valueGetter: (_, row) =>

                formatCompletion(

                    row.SCAN_IN,

                    row.SCAN_OUT

                )

        },

        {
            field: "action",

            headerName: "",

            width: 80,

            sortable: false,

            filterable: false,

            disableColumnMenu: true,

            align: "center",

            renderCell: (params) => (

                <IconButton

                    size="small"
                    onClick={() =>

                        onDetail(params.row)

                    }
                >

                    <VisibilityOutlinedIcon />

                </IconButton>

            )

        }

    ];

    return (

        <Card
            sx={{
                borderRadius: 3
            }}
        >

            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        md: 3
                    }
                }}
            >

                {

                    rows.length === 0 && !loading

                        ? (

                            <EmptyState

                                icon={

                                    <TableRowsOutlinedIcon
                                        sx={{
                                            fontSize: 60
                                        }}
                                    />

                                }

                                title="Belum ada riwayat attendance"

                                subtitle="Data attendance tidak ditemukan sesuai filter yang dipilih."

                                sx={{
                                    py: 8
                                }}

                            />

                        )

                        : (

                            <Box
                                sx={{
                                    width: "100%",
                                    overflowX: "auto"
                                }}
                            >

                                <Box
                                    sx={{
                                        minWidth: 1250
                                    }}
                                >

                                    <DataGrid

                                        rows={rows}
                                        loading={loading}
                                        columns={columns}
                                        getRowId={(row) => row.SCHEDULE_ID}
                                        autoHeight
                                        disableRowSelectionOnClick
                                        pageSizeOptions={[5, 10, 25]}
                                        initialState={{
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: 5
                                                }
                                            }
                                        }}

                                    />

                                </Box>

                            </Box>

                        )

                }

            </CardContent>

        </Card>

    );

}

export default AttendanceHistoryTable;