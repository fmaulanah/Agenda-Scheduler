import { Box, Chip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

function ScheduleCalendar({ month, calendarDays, agendas, holidaySet, onSelectAgenda, onShowMore }) {

    const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const [focusedDayIndex, setFocusedDayIndex] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            const key = e.key;
            const steps = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
            if (steps[key] !== undefined) {
                const active = document.activeElement?.getAttribute("role") === "gridcell";
                if (!active && focusedDayIndex === null) return;
                e.preventDefault();
                const base = focusedDayIndex ?? calendarDays.findIndex(d => d !== null);
                const newIdx = base + steps[key];
                if (newIdx >= 0 && newIdx < calendarDays.length) setFocusedDayIndex(newIdx);
            }
            if (key === "Enter" && focusedDayIndex !== null) {
                const dayNum = calendarDays[focusedDayIndex];
                if (dayNum) {
                    const date = month.date(dayNum).format("YYYY-MM-DD");
                    const dayAgendas = agendas.filter(item => date >= item.startDate && date <= item.endDate);
                    if (dayAgendas.length > 0) onSelectAgenda(dayAgendas[0]);
                }
            }
            if (key === "Escape") setFocusedDayIndex(null);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [focusedDayIndex, calendarDays, agendas, onSelectAgenda, month]);

    return (

        <Box
            sx={{
                p: 2,
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))"
            }}
        >

            {WEEKDAYS.map((day) => (

                <Box
                    key={day}
                    sx={{
                        // py: 1.5,
                        textAlign: "center",
                        bgcolor: "grey.50",
                        borderBottom: 1,
                        borderColor: "divider"
                    }}
                >

                    <Typography
                        variant="body2"
                        fontWeight={700}
                    >

                        {day}

                    </Typography>

                </Box>

            ))}

            {calendarDays.map((day, index) => {

                const date = day ? month.date(day).format("YYYY-MM-DD") : null;

                const dayAgendas = agendas.filter(item => date >= item.startDate && date <= item.endDate);

                const visibleAgendas = dayAgendas.slice(0, 2);
                const hiddenCount = dayAgendas.length - visibleAgendas.length;

                const isToday = date === dayjs().format("YYYY-MM-DD");
                const isHoliday = holidaySet.has(date);

                return (
                    <Box
                        key={`${day ?? "empty"}-${index}`}
                        tabIndex={day ? 0 : -1}
                        role="gridcell"
                        aria-current={isToday ? "date" : undefined}
                        aria-label={date ? dayjs(date).format("DD MMMM YYYY") : ""}
                        sx={{
                            minHeight: { xs: 80 },
                            p: 1,
                            borderRight: (index + 1) % 7 === 0 ? 0 : 1,
                            borderBottom: 1,
                            borderColor: "divider",
                            bgcolor: !day ? "grey.50" : isToday ? "background.paper" : isHoliday ? "#FFF5F5" : "background.paper",
                            boxShadow: isToday ? "inset 0 0 0 2px" : "none",
                            boxShadowColor: "primary.main",
                            outline: focusedDayIndex === index ? "2px solid" : "none",
                            outlineColor: "primary.main",
                            "&:focus": {
                                outline: "2px solid",
                                outlineColor: "primary.main"
                            }
                        }}
                    >
                        {day && (

                            <>
                                <Box
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        mb: .5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        bgcolor: isToday ? "primary.main" : "transparent",
                                        color: isToday ? "white" : isHoliday ? "error.main" : "text.primary"
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={isToday || isHoliday ? 700 : 400}
                                        color={isToday ? "white" : isHoliday ? "error.main" : "text.primary"}
                                    >
                                        {day}
                                    </Typography>

                                </Box>

                                {visibleAgendas.map(agenda => (
                                    <Box
                                        key={agenda.id}
                                        onClick={() => onSelectAgenda(agenda)}
                                        sx={{
                                            mb: 0.5,
                                            p: 0.75,
                                            borderRadius: 1,
                                            bgcolor: agenda.useYn === "Y" ? "primary.main" : "grey.500",
                                            color: "white",
                                            cursor: "pointer",
                                            "&:hover": { bgcolor: agenda.useYn === "Y" ? "primary.dark" : "grey.600" }
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ display: "block", fontWeight: 700 }}>{agenda.title}</Typography>
                                        <Typography variant="caption" sx={{ display: "block", opacity: .8 }}>{agenda.trainerName}</Typography>
                                    </Box>
                                ))}

                                {hiddenCount > 0 && (
                                    <Chip
                                        label={`+${hiddenCount} lainnya`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        onClick={() => onShowMore(date, dayAgendas)}
                                        sx={{
                                            mt: 0.5,
                                            fontSize: "0.65rem",
                                            height: 22,
                                            cursor: "pointer",
                                            "&:hover": {
                                                bgcolor: "primary.main",
                                                color: "white",
                                                borderColor: "primary.main"
                                            }
                                        }}
                                    />
                                )}

                            </>

                        )}

                    </Box>
                );

            })}

        </Box>

    );

}

export default ScheduleCalendar;