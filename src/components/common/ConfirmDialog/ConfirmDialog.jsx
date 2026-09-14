import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from "@mui/material";

import AppButton from "../Button/AppButton";

function ConfirmDialog({

    open,

    title = "Konfirmasi",

    message,

    confirmText = "Ya",

    cancelText = "Batal",

    confirmColor = "error",

    onConfirm,

    onCancel

}) {

    return (

        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="xs"
            slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
        >

            <DialogTitle>

                {title}

            </DialogTitle>

            <DialogContent>

                <Typography>

                    {message}

                </Typography>

            </DialogContent>

            <DialogActions>

                <AppButton
                    variant="outlined"
                    onClick={onCancel}
                >

                    {cancelText}

                </AppButton>

                <AppButton
                    color={confirmColor}
                    onClick={onConfirm}
                >

                    {confirmText}

                </AppButton>

            </DialogActions>

        </Dialog>

    );

}

export default ConfirmDialog;