import { useState, useEffect } from "react";

import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, FormControlLabel, Switch, Typography, IconButton,
    FormControl, Select, MenuItem, FormLabel, Grid, Box
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import AppButton from "../../../components/common/Button/AppButton";
import LoadingOverlay from "../../../components/common/Loading/LoadingOverlay";

import useSnackbar from "../../../hooks/useSnackbar";

import trainerService from "../../../services/trainerService";
import userManagementService from "../../../services/userManagementService";

const PLANT_OPTIONS = ["3110", "3120", "3220"];
const ROLE_OPTIONS = ["ADMIN", "USER"];

const initialForm = {
    userId: "",
    password: "",
    empid: "",
    empName: "",
    roleId: "USER",
    plantCd: "3110",
    deptNm: "",
    email: "",
    remark: "",
    useYn: "Y",
    blockYn: "N"
};

function UserManagementDialog({ open, editingUser, existingUsers = [], onClose, onSaved }) {

    const { showSnackbar } = useSnackbar();

    const [form, setForm] = useState({ ...initialForm });
    const [saving, setSaving] = useState(false);
    const [loadingEmp, setLoadingEmp] = useState(false);
    const [empError, setEmpError] = useState("");

    const isEditing = Boolean(editingUser);

    useEffect(() => {
        if (open) {
            if (editingUser) {
                setForm({
                    userId: editingUser.USER_ID || "",
                    empid: editingUser.EMPID || "",
                    empName: editingUser.EMP_NAME || "",
                    roleId: editingUser.ROLE_ID || "USER",
                    plantCd: editingUser.PLANT_CD || "",
                    deptNm: editingUser.DEPT_NM || "",
                    email: editingUser.EMAIL || "",
                    remark: editingUser.REMARK || "",
                    useYn: editingUser.USE_YN || "Y",
                    blockYn: editingUser.BLOCK_YN || "N"
                });
            } else {
                setForm({ ...initialForm });
            }
            setEmpError("");
        }
    }, [open, editingUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
        if (name === "empid") {
            setEmpError("");
        }
    };

    const handleSearchEmp = async () => {
        const empId = form.empid.trim();
        if (!empId) {
            setForm(current => ({ ...current, empName: "", deptNm: "" }));
            return;
        }
        try {
            setLoadingEmp(true);
            const result = await trainerService.getTrainer(empId);
            if (result && result.length > 0) {
                setForm(current => ({
                    ...current,
                    empName: result[0].EMP_NAME || result[0].EMP_NM || result[0].EMPLOYEE_NAME || "",
                    deptNm: result[0].DEPT_NM || result[0].DEPT_NAME || result[0].DEPARTMENT || result[0].DEPT || ""
                }));
                setEmpError("");
            } else {
                setEmpError("Data karyawan tidak ditemukan.");
                setForm(current => ({ ...current, empName: "", deptNm: "" }));
                showSnackbar("Data karyawan tidak ditemukan.", "warning");
            }
        } catch (err) {
            console.error(err);
            setEmpError("Gagal mencari data karyawan.");
        } finally {
            setLoadingEmp(false);
        }
    };

    const handleEmployeeKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearchEmp();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.userId.trim()) {
            showSnackbar("User ID harus diisi.", "warning");
            return;
        }
        if (!isEditing && existingUsers.some(item => String(item.USER_ID).toLowerCase() === form.userId.trim().toLowerCase())) {
            showSnackbar("User ID sudah terdaftar.", "warning");
            return;
        }
        if (!isEditing && !form.password.trim()) {
            showSnackbar("Password harus diisi.", "warning");
            return;
        }
        if (!form.empid.trim()) {
            showSnackbar("EMPID harus diisi.", "warning");
            return;
        }
        if (!form.empName.trim()) {
            showSnackbar("Nama karyawan harus diisi.", "warning");
            return;
        }
        if (!form.plantCd) {
            showSnackbar("Plant harus dipilih.", "warning");
            return;
        }

        setSaving(true);
        try {
            if (isEditing) {
                await userManagementService.updateUser({
                    ...form,
                    serviceId: editingUser?.SERVICE_ID || "JJ"
                });
                showSnackbar("User berhasil diperbarui.", "success");
            } else {
                await userManagementService.saveUser({
                    ...form,
                    serviceId: "JJ"
                });
                showSnackbar("User berhasil disimpan.", "success");
            }
            handleClose();
            if (onSaved) onSaved();
        } catch (err) {
            console.error(err);
            showSnackbar("Gagal menyimpan user.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setForm({ ...initialForm });
        setEmpError("");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            component="form"
            onSubmit={handleSubmit}
            slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 600,
                    variant: "h6"
                }}
            >
                {isEditing ? "Edit User" : "Tambah User"}

                <IconButton
                    onClick={handleClose}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: "16px !important", pb: 2 }}>
                <LoadingOverlay open={loadingEmp} />

                <Grid container spacing={2}>
                    {!isEditing && (
                        <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    name="userId"
                                    label="User ID"
                                    value={form.userId}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    size="small"
                                    disabled={saving}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    size="small"
                                    disabled={saving}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="empid"
                            label="NIK / EMPID"
                            value={form.empid}
                            onChange={handleChange}
                            onBlur={handleSearchEmp}
                            onKeyDown={handleEmployeeKeyDown}
                            required
                            fullWidth
                            size="small"
                            error={Boolean(empError)}
                            helperText={empError || "Tekan Enter atau klik di luar untuk mencari"}
                            disabled={saving || isEditing}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="empName"
                            label="Nama Karyawan"
                            value={form.empName}
                            onChange={handleChange}
                            required
                            fullWidth
                            size="small"
                            disabled
                            sx={{ bgcolor: "grey.50" }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12 }}>
                        <TextField
                            name="deptNm"
                            label="Departemen"
                            value={form.deptNm}
                            fullWidth
                            size="small"
                            disabled
                            sx={{ bgcolor: "grey.50" }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth size="small" required>
                            <FormLabel sx={{ mb: 0.5, fontSize: "0.875rem" }}>Role</FormLabel>
                            <Select
                                name="roleId"
                                value={form.roleId}
                                onChange={handleChange}
                                disabled={saving || isEditing}
                            >
                                {ROLE_OPTIONS.map(r => (
                                    <MenuItem key={r} value={r}>{r}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth size="small" required>
                            <FormLabel sx={{ mb: 0.5, fontSize: "0.875rem" }}>Plant</FormLabel>
                            <Select
                                name="plantCd"
                                value={form.plantCd}
                                onChange={handleChange}
                                disabled={saving || isEditing}
                            >
                                {PLANT_OPTIONS.map(p => (
                                    <MenuItem key={p} value={p}>{p}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>



                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            disabled={saving}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="remark"
                            label="Keterangan"
                            value={form.remark}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            disabled={saving}
                        />
                    </Grid>

                    {isEditing && (
                        <>
                            <Grid size={{ xs: 6 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.useYn === "Y"}
                                            onChange={(e) => handleChange({
                                                target: { name: "useYn", value: e.target.checked ? "Y" : "N" }
                                            })}
                                            disabled={saving}
                                        />
                                    }
                                    label="Aktif"
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.blockYn === "Y"}
                                            onChange={(e) => handleChange({
                                                target: { name: "blockYn", value: e.target.checked ? "Y" : "N" }
                                            })}
                                            disabled={saving}
                                        />
                                    }
                                    label="Blokir"
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <AppButton variant="outlined" onClick={handleClose} disabled={saving}>
                    Batal
                </AppButton>
                <AppButton
                    type="submit"
                    disabled={saving}
                    startIcon={saving ? null : <SaveIcon />}
                >
                    {saving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan User"}
                </AppButton>
            </DialogActions>
        </Dialog>
    );
}

export default UserManagementDialog;
