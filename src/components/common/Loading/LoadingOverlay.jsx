import {
    Backdrop,
    CircularProgress,
    Typography,
    Stack
} from "@mui/material";

function LoadingOverlay({

    open,
    message = "Loading..."

}) {

    return (

        <Backdrop
            open={open}
            sx={{
                zIndex: theme => theme.zIndex.modal + 1,
                bgcolor: "rgba(255,255,255,.65)",
                backdropFilter: "blur(2px)"
            }}
        >

            <Stack
                spacing={2}
                alignItems="center"
            >

                <CircularProgress />

                <Typography
                    fontWeight={600}
                    color="text.primary"
                >

                    {message}

                </Typography>

            </Stack>

        </Backdrop>

    );

}

export default LoadingOverlay;