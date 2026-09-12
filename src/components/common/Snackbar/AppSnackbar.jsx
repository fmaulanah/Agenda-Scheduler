import { Snackbar, Alert } from "@mui/material";

function AppSnackbar({
    open,
    message,
    severity,
    onClose
}) {

    return (

        <Snackbar
            open={open}
            autoHideDuration={severity === "error" ? 5000 : 3000}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
        >

            <Alert
                severity={severity}
                variant="filled"
                elevation={6}
                onClose={onClose}
                sx={{
                    width: "100%"
                }}
            >

                {message}

            </Alert>

        </Snackbar>

    );

}

export default AppSnackbar;