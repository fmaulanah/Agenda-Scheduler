import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

function Clock() {

    const [now, setNow] = useState(new Date());

    useEffect(() => {

        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end"
            }}
        >

            <Typography
                variant="body1"
                fontWeight={600}
            >
                {now.toLocaleTimeString()}
            </Typography>

            <Typography
                variant="caption"
                sx={{
                    color:"rgba(255,255,255,.8)"
                }}
            >
                {now.toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}
            </Typography>

        </Box>

    );

}

export default Clock;