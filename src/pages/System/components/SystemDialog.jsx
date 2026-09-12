import { useEffect, useState } from "react";

import {
    Box,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import CircularProgress from "@mui/material/CircularProgress";

import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

import AppButton from "../../../components/common/Button/AppButton";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

import koreanService from "../../../services/koreanService";

function SystemDialog({
    open,
    onClose,
    onSaved,
    onSaveError,
    onDeleted,
    onDeleteError,

    form,
    setForm,

    onSearchEmployee,
    onEmployeeKeyDown,
}) {

    const [isDirty, setIsDirty] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteCoach, setDeleteCoach] = useState(null);
    const [rows, setRows] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [rowChangeConfirmOpen, setRowChangeConfirmOpen] = useState(false);
    const [pendingRow, setPendingRow] = useState(null);
    const nikError = form.empId.length > 0 && form.empId.trim().length !== 9 ? "NIK harus 9 digit." : "";

    const loadCoach = async () => {

        try {

            setLoadingTable(true);

            const result = await koreanService.refreshKoreans();

            setRows(result);

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setLoadingTable(false);

        }

    };

    const handleChange = (event) => {

        setIsDirty(true);

        const { name, value } = event.target;

        setForm(current => ({

            ...current,

            [name]: value

        }));

    };

    const handleClose = () => {

        if (!isDirty) {

            onClose();

            return;

        }

        setConfirmOpen(true);

    };

    const handleCancel = () => {

        setIsEdit(false);

        setEditingCoach(null);

        setIsDirty(false);

        setForm({

            empId: "",
            empName: "",
            rfid: ""

        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            if (form.empId.trim().length !== 9) {

                onSaveError?.(
                    "NIK Korean harus terdiri dari 9 digit."
                );

                return;

            }

            const isDuplicate = rows.some(row => row.EMPID === form.empId.trim());

            if (isDuplicate && !isEdit) {

                onSaveError?.(
                    "NIK Korean sudah terdaftar."
                );

                return;

            }

            setSaving(true);

            if (isEdit) {

                await koreanService.updateCoach(form);

            }
            else {

                await koreanService.saveCoach(form);

            }

            await loadCoach();

            setForm({

                empId: "",
                empName: "",
                rfid: ""

            });

            setIsDirty(false);
            setIsEdit(false);
            setEditingCoach(null);

            onSaved?.();


        }
        catch (err) {

            console.error(err);
            onSaveError?.("Simpan data gagal.");

        }
        finally {

            setSaving(false);

        }

    };

    const handleDelete = (row) => {

        setDeleteCoach(row);

        setDeleteOpen(true);

    };

    const handleConfirmDelete = async () => {

        if (!deleteCoach) {

            return;

        }

        try {

            setSaving(true);

            await koreanService.deleteCoach(

                deleteCoach.EMPID

            );

            await loadCoach();

            onDeleted?.();

        }
        catch (err) {

            console.error(err);

            onDeleteError?.();

        }
        finally {

            setSaving(false);

            setDeleteOpen(false);

            setDeleteCoach(null);

        }

    };

    const handleRowClick = (params) => {

        const row = params.row;

        if (isDirty) {

            setPendingRow(row);

            setRowChangeConfirmOpen(true);

            return;

        }

        selectRow(row);

    };

    const selectRow = (row) => {

        setEditingCoach(row);

        setIsEdit(true);

        setIsDirty(false);

        setForm({

            empId: row.EMPID,
            empName: row.EMP_NAME,
            rfid: row.RF_ID

        });

    };

    const columns = [

        {
            field: "EMPID",
            headerName: "NIK",
            width: 120
        },

        {
            field: "EMP_NAME",
            headerName: "Nama",
            flex: 1,
            minWidth: 250
        },

        {
            field: "RF_ID",
            headerName: "RFID",
            width: 180
        },

        {
            field: "action",
            headerName: "",
            width: 70,
            sortable: false,
            filterable: false,
            align: "center",

            renderCell: ({ row }) => (

                <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row)}
                >

                    <DeleteOutlineIcon />

                </IconButton>

            )

        }

    ];

    useEffect(() => {

        if (!open) {

            return;

        }

        loadCoach();

    }, [open]);

    return (

        <>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                component="form"
                onSubmit={handleSubmit}
                slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
            >

                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontWeight: 600
                    }}
                >

                    {isEdit ? "Update Data Korean Coach "
                        : "Input Data Korean Coach"
                    }

                    <IconButton
                        onClick={handleClose}
                        size="small"
                    >

                        <CloseIcon />

                    </IconButton>

                </DialogTitle>

                <DialogContent
                    sx={{
                        pt: "12px !important"
                    }}
                >

                    <Stack spacing={3}>

                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid size={{ xs: 12, md: 4 }}>

                                <TextField
                                    fullWidth
                                    label="NIK"
                                    name="empId"
                                    value={form.empId}
                                    onChange={handleChange}
                                    onBlur={!isEdit ? onSearchEmployee : undefined}
                                    onKeyDown={!isEdit ? onEmployeeKeyDown : undefined}
                                    required
                                    disabled={saving || isEdit}
                                    error={Boolean(nikError)}
                                    helperText={nikError}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>

                                <TextField
                                    fullWidth
                                    label="Nama"
                                    name="empName"
                                    value={form.empName}
                                    disabled={saving}
                                    slotProps={{
                                        input: {
                                            readOnly: true
                                        }
                                    }}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-readOnly": {
                                            bgcolor: "#F8F9FA"
                                        }
                                    }}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>

                                <TextField
                                    fullWidth
                                    label="RFID"
                                    name="rfid"
                                    value={form.rfid}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                />

                            </Grid>

                        </Grid>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2
                            }}
                        >

                            <AppButton
                                type="submit"
                                disabled={saving}
                                startIcon={
                                    saving
                                        ? <CircularProgress size={18} color="inherit" />
                                        : null
                                }
                            >

                                {
                                    saving
                                        ? (isEdit ? "Mengupdate..." : "Menyimpan...")
                                        : (isEdit ? "Update" : "Simpan")
                                }

                            </AppButton>

                            {isEdit && (

                                <AppButton
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </AppButton>

                            )}

                        </Box>

                        <Divider />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >

                            Daftar Korean Coach

                        </Typography>

                        <Box
                            sx={{
                                height: 420
                            }}
                        >

                            <DataGrid
                                rows={rows}
                                columns={columns}
                                loading={loadingTable}
                                getRowId={(row) => row.EMPID}
                                density="comfortable"
                                disableRowSelectionOnClick
                                pageSizeOptions={[5, 10]}
                                onRowClick={handleRowClick}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5
                                        }
                                    }
                                }}
                            />

                        </Box>

                    </Stack>

                </DialogContent>

            </Dialog>

            <ConfirmDialog

                open={confirmOpen}
                title="Perubahan Belum Disimpan"
                message="Perubahan yang sudah Anda lakukan akan hilang. Tetap keluar?"
                confirmText="Keluar"
                cancelText="Kembali"

                onConfirm={() => {

                    setConfirmOpen(false);

                    setIsDirty(false);

                    onClose();

                }}

                onCancel={() =>

                    setConfirmOpen(false)

                }

            />

            <ConfirmDialog

                open={deleteOpen}
                title="Hapus Korean Coach"
                message={`Yakin ingin menghapus ${deleteCoach?.EMP_NAME ?? ""}?`}
                confirmText="Hapus"
                cancelText="Batal"

                onConfirm={handleConfirmDelete}

                onCancel={() => {

                    setDeleteOpen(false);

                    setDeleteCoach(null);

                }}

            />

            <ConfirmDialog

                open={rowChangeConfirmOpen}
                title="Perubahan Belum Disimpan"
                message="Perubahan yang sudah Anda lakukan akan hilang. Tetap pindah ke data lain?"
                confirmText="Pindah"
                cancelText="Tetap"

                onConfirm={() => {

                    if (pendingRow) {

                        selectRow(pendingRow);

                    }

                    setPendingRow(null);

                    setRowChangeConfirmOpen(false);

                }}

                onCancel={() => {

                    setPendingRow(null);

                    setRowChangeConfirmOpen(false);

                }}

            />

        </>

    );

}

export default SystemDialog;