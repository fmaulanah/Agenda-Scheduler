import {
    Card,
    CardContent,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";

import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";

function AttendanceHistoryToolbar({

    view,
    onChange

}) {

    const handleChange = (_, newView) => {

        if (!newView) {

            return;

        }

        onChange(newView);

    };

    return (

        <Card
            sx={{
                mb: 3
            }}
        >

            <CardContent
                sx={{
                    py: 2,
                    px: {
                        xs: 2,
                        md: 3
                    }
                }}
            >

                <Stack

                    direction={{
                        xs: "column",
                        sm: "row"
                    }}

                    justifyContent="space-between"

                    alignItems={{
                        xs: "stretch",
                        sm: "center"
                    }}

                    spacing={2}

                >

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                    >

                        View

                    </Typography>

                    <ToggleButtonGroup

                        value={view}

                        exclusive

                        onChange={handleChange}

                        color="primary"

                        size="small"

                        fullWidth={false}

                    >

                        <ToggleButton value="table">

                            <TableRowsIcon
                                sx={{
                                    mr: 1
                                }}
                            />

                            Table

                        </ToggleButton>

                        <ToggleButton value="list">

                            <ViewAgendaIcon
                                sx={{
                                    mr: 1
                                }}
                            />

                            List

                        </ToggleButton>

                    </ToggleButtonGroup>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AttendanceHistoryToolbar;