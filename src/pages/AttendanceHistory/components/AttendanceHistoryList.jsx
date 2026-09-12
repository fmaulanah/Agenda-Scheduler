import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography, IconButton } from "@mui/material";

import {

    formatCompletion,
    formatStatus,
    formatAgendaDate,
    displayValue

} from "../../../utils/formatter/attendanceHistoryFormatter";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function AttendanceHistoryList({ rows, loading, onDetail }) 
{
    const PAGE_SIZE = 5;

    const [page, setPage] = useState(1);

    useEffect(() => {

        setPage(1);

    }, [rows]);

    const totalPages = Math.ceil(rows.length / PAGE_SIZE);

    const pagedRows = rows.slice(

        (page - 1) * PAGE_SIZE,

        page * PAGE_SIZE

    );

    if (!rows.length && !loading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Belum ada riwayat.</Typography></Box>
        );
    }

    if (loading) {

        return (

            <Card
                sx={{
                    mt:2
                }}
            >

                <CardContent>

                    <Typography align="center">

                        Loading...

                    </Typography>

                </CardContent>

            </Card>

        );

    }



    return (

<Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>

            <Stack spacing={1.75} sx={{ flex: 1 }}>

            
                {pagedRows.map(row => (

                        <Card key={row.SCHEDULE_ID}>

                            <CardContent>

                                <Stack spacing={2}>

                                    <Box>

                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                        >

                                            {displayValue(row.TRAINING_NAME)}

                                        </Typography>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            mt={0.5}
                                        >

                                            <CalendarTodayIcon
                                                fontSize="inherit"
                                                color="action"
                                            />

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >

                                                {formatAgendaDate(row.TRAINING_DATE)}

                                            </Typography>

                                        </Stack>

                                    </Box>

                                    <Divider />

                                    <Stack spacing={2}>

                                        <Box>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >

                                                <PersonIcon
                                                    color="primary"
                                                    fontSize="small"
                                                />

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >

                                                    Trainer

                                                </Typography>

                                            </Stack>

                                            <Typography
                                                fontWeight={600}
                                            >

                                                {displayValue(row.TRAINER_NAME)}

                                            </Typography>

                                        </Box>

                                        <Box>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >

                                                <MeetingRoomIcon
                                                    color="primary"
                                                    fontSize="small"
                                                />

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >

                                                    Room

                                                </Typography>

                                            </Stack>

                                            <Typography
                                                fontWeight={600}
                                            >

                                                {displayValue(row.ROOM_NAME)}

                                            </Typography>

                                        </Box>

                                    </Stack>

                                    <Divider />

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                    >

                                        <Card
                                            variant="outlined"
                                            sx={{
                                                flex: 1
                                            }}
                                        >

                                            <CardContent
                                                sx={{
                                                    py: 2
                                                }}
                                            >

                                                <Stack
                                                    spacing={1}
                                                    alignItems="center"
                                                >

                                                    <LoginIcon color="success" />

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >

                                                        Scan In

                                                    </Typography>

                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={700}
                                                    >

                                                        {row.SCAN_IN}

                                                    </Typography>

                                                </Stack>

                                            </CardContent>

                                        </Card>

                                        <Card
                                            variant="outlined"
                                            sx={{
                                                flex: 1
                                            }}
                                        >

                                            <CardContent
                                                sx={{
                                                    py: 2
                                                }}
                                            >

                                                <Stack
                                                    spacing={1}
                                                    alignItems="center"
                                                >

                                                    <LogoutIcon color="error" />

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >

                                                        Scan Out

                                                    </Typography>

                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={700}
                                                    >

                                                        {row.SCAN_OUT}

                                                    </Typography>

                                                </Stack>

                                            </CardContent>

                                        </Card>

                                        <Card
                                            variant="outlined"
                                            sx={{
                                                flex: 1
                                            }}
                                        >

                                            <CardContent
                                                sx={{
                                                    py: 2
                                                }}
                                            >

                                                <Stack
                                                    spacing={1}
                                                    alignItems="center"
                                                >

                                                    <CheckCircleIcon color="primary" />

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >

                                                        Complete

                                                    </Typography>

                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={700}
                                                    >

                                                        {formatCompletion(

                                                            row.SCAN_IN,

                                                            row.SCAN_OUT

                                                        )}

                                                    </Typography>

                                                </Stack>

                                            </CardContent>

                                        </Card>

                                    </Stack>

                                    <Button

                                        variant="contained"
                                        startIcon={<VisibilityOutlinedIcon />}
                                        fullWidth
                                        onClick={() =>

                                            onDetail(row)

                                        }

                                    >

                                        Detail

                                    </Button>

                                </Stack>

                            </CardContent>

                        </Card>

                    ))

                }


            </Stack>
            {totalPages > 1 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, py: 0.75, px: 1, borderRadius: 3, bgcolor: "background.paper", border: 1, borderColor: "divider", boxShadow: 1, alignSelf: "center", mt: 2 }}>
                    <IconButton size="small" disabled={page === 1} onClick={() => setPage(c => c - 1)} sx={{ width: 32, height: 32, bgcolor: page === 1 ? "transparent" : "primary.main", color: page === 1 ? "text.disabled" : "white", "&:hover": { bgcolor: "primary.dark", color: "white" }, "&.Mui-disabled": { bgcolor: "grey.100" } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                    <Typography variant="body2" fontWeight={700} sx={{ minWidth: 52, textAlign: "center", px: 1, color: "text.primary" }}>{page} / {totalPages}</Typography>
                    <IconButton size="small" disabled={page === totalPages} onClick={() => setPage(c => c + 1)} sx={{ width: 32, height: 32, bgcolor: page === totalPages ? "transparent" : "primary.main", color: page === totalPages ? "text.disabled" : "white", "&:hover": { bgcolor: "primary.dark", color: "white" }, "&.Mui-disabled": { bgcolor: "grey.100" } }}><ChevronRightIcon fontSize="small" /></IconButton>
                </Box>
            )}
        </Box>
    );

}

export default AttendanceHistoryList;