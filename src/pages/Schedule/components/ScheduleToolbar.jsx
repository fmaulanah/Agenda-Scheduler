import dayjs from "dayjs";
import { Box, IconButton, MenuItem, TextField, Typography } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

import AppButton from "../../../components/common/Button/AppButton";
import useResponsive from "../../../hooks/useResponsive";

import AppCard from "../../../components/common/Card/AppCard";

function ScheduleToolbar({ month, MONTHS, YEARS, setMonth, onAddAgenda, onRefresh }) 
{
    const { isMobile } = useResponsive();

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2
            }}
        >

            {isMobile ? (

                <AppCard sx={{ overflow: "visible", "& .MuiCardContent-root": { p: 2 } }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 1,
                            p: 0,
                            flexWrap: "wrap"
                        }}
                    >
                        <TextField
                            select
                            size="small"
                            label="Bulan"
                            value={month.month()}
                            onChange={(event) =>
                                setMonth(current =>
                                    current
                                        .month(Number(event.target.value))
                                        .startOf("month")
                                )
                            }
                            sx={{ flex: 1, minWidth: 110 }}
                        >
                            {MONTHS.map((monthName, index) => (
                                <MenuItem
                                    key={monthName}
                                    value={index}
                                >
                                    {monthName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            size="small"
                            label="Tahun"
                            value={month.year()}
                            onChange={(event) =>
                                setMonth(current =>
                                    current
                                        .year(Number(event.target.value))
                                        .startOf("month")
                                )
                            }
                            sx={{ flex: 1, minWidth: 80 }}
                        >
                            {YEARS.map((year) => (
                                <MenuItem
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>

                        <AppButton
                            variant="outlined"
                            onClick={onRefresh}
                            aria-label="Refresh"
                            sx={{ minWidth: 40, width: 40, height: 40, p: 0, boxShadow: "none", flexShrink: 0 }}
                        >
                            <RefreshIcon />
                        </AppButton>

                        <AppButton
                            onClick={onAddAgenda}
                            aria-label="Tambah Agenda"
                            sx={{
                                minWidth: 40,
                                width: 40,
                                height: 40,
                                p: 0,
                                boxShadow: "none",
                                flexShrink: 0
                            }}
                        >
                            <AddIcon />

                        </AppButton>

                    </Box>
                </AppCard>

            ) : (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2
                    }}
                >

                    <TextField
                        select
                        size="small"
                        label="Bulan"
                        value={month.month()}
                        onChange={(event) =>
                            setMonth(current =>
                                current
                                    .month(Number(event.target.value))
                                    .startOf("month")
                            )
                        }
                        sx={{ minWidth: 130 }}
                    >
                        {MONTHS.map((monthName, index) => (
                            <MenuItem
                                key={monthName}
                                value={index}
                            >
                                {monthName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Tahun"
                        value={month.year()}
                        onChange={(event) =>
                            setMonth(current =>
                                current
                                    .year(Number(event.target.value))
                                    .startOf("month")
                            )
                        }
                        sx={{ minWidth: 100 }}
                    >
                        {YEARS.map((year) => (
                            <MenuItem
                                key={year}
                                value={year}
                            >
                                {year}
                            </MenuItem>
                        ))}
                    </TextField>

                    <AppButton
                        variant="outlined"
                        onClick={onRefresh}
                        sx={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                            p: 0,
                            boxShadow: "none"
                        }}
                    >
                        <RefreshIcon />
                    </AppButton>

                    <AppButton
                        startIcon={<AddIcon />}
                        onClick={onAddAgenda}
                    >
                        Tambah Agenda
                    </AppButton>

                </Box>

            )}

        </Box>

    );

}

export default ScheduleToolbar;