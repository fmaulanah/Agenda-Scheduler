import { useState } from "react";
import dayjs from "dayjs";

import {
    Box,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import RefreshIcon from "@mui/icons-material/Refresh";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import SystemDialog from "./components/SystemDialog"

import PageHeader from "../../components/common/PageHeader/PageHeader";
import AppButton from "../../components/common/Button/AppButton";
import AppCard from "../../components/common/Card/AppCard";

import useSnackbar from "../../hooks/useSnackbar";

import employeeService from "../../services/employeeService";
import koreanService from "../../services/koreanService";

import { getStorage, setStorage } from "../../utils/storage";
import STORAGE_KEYS from "../../utils/storageKeys";

function System() {

    const [coachDialogOpen, setCoachDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { showSnackbar } = useSnackbar();

    const [form, setForm] = useState({

        empId: "",
        empName: "",
        rfid: ""

    });

    const employees = getStorage(

        STORAGE_KEYS.EMPLOYEE,
        []

    );

    const totalUser = employees.length;

    const lastSync = getStorage(

        STORAGE_KEYS.USER_LAST_SYNC,
        null

    );

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm(current => ({

            ...current,

            [name]: value

        }));

    };

    const handleSearchEmployee = () => {

        if (form.empId.trim().length !== 9) {

            showSnackbar(
                "NIK Korean coach harus terdiri dari 9 digit.",
                "warning"
            );

            return;

            
        }

        if (!form.empId.trim()) {

            setForm(current => ({

                ...current,

                empName: ""

            }));

            return;

        }

        const employee = employeeService.findEmployeeByEmpId(form.empId);

        if (!employee) {

            setForm(current => ({

                ...current,

                empName: ""

            }));

            showSnackbar(
                "Data Korean coach tidak ditemukan.",
                "warning"
            );

            return;

        }

        setForm(current => ({

            ...current,

            empName: employee.EMP_NAME

        }));

    };

    const handleEmployeeKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            handleSearchEmployee();

        }

    };

    const handleRefreshUser = async () => {

        try {

            setLoading(true);

            await employeeService.refreshEmployees();
            await koreanService.refreshKoreans();

            showSnackbar(

                "Data user berhasil diperbarui.",

                "success"

            );

            setStorage(

                STORAGE_KEYS.USER_LAST_SYNC,

                new Date().toISOString()

            );

        }
        catch (error) {

            console.error(error);

            showSnackbar(

                "Gagal memperbarui data user.",

                "error"

            );

        }
        finally {

            setLoading(false);

        }

    };

    const handleCloseCoachDialog = () => {

        setCoachDialogOpen(false);

        setForm({

            empId: "",
            empName: "",
            rfid: ""

        });

    };

    return (

        <>

            <PageHeader
                title="System"
                subtitle="Maintenance dan sinkronisasi data aplikasi."
            />

            <Box>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <AppCard
                            title="Data User"
                            action={
                                <Chip
                                    label={loading ? "Updating..." : "Ready"}
                                    color={loading ? "warning" : "success"}
                                    size="small"
                                />
                            }
                            sx={{
                                height: "100%"
                            }}
                        >

                            <Stack spacing={2}>

                                <PersonIcon
                                    color="primary"
                                    sx={{
                                        fontSize: 42
                                    }}
                                />

                                <Stack spacing={1}>

                                    <Typography color="text.secondary">

                                        Total User : {totalUser.toLocaleString()} | Last Sync : {lastSync 
                                                                                              ? dayjs(lastSync).format("DD MMM YYYY HH:mm")
                                                                                              : "-"}

                                    </Typography>

                                </Stack>

                                <Divider />

                                <AppButton
                                    fullWidth
                                    startIcon={<RefreshIcon />}
                                    onClick={handleRefreshUser}
                                    disabled={loading}
                                >

                                    Update Data User

                                </AppButton>

                            </Stack>

                        </AppCard>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <AppCard
                            title="Input Data Korean Coach"
                            action={
                                <Chip
                                    label="Master"
                                    color="secondary"
                                    size="small"
                                />
                            }
                            sx={{
                                height: "100%"
                            }}
                        >

                            <Stack spacing={2}>

                                <GroupIcon
                                    color="primary"
                                    sx={{
                                        fontSize: 42
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Menambahkan data master Korean Coach.

                                </Typography>

                                <Divider />

                                <AppButton
                                    fullWidth
                                    onClick={() => setCoachDialogOpen(true)}
                                >

                                    Input Data

                                </AppButton>

                            </Stack>

                        </AppCard>

                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>

                        <AppCard
                            title="Informasi Aplikasi"
                            action={
                                <Chip
                                    label="Development"
                                    color="info"
                                    size="small"
                                />
                            }
                            sx={{
                                height: "100%"
                            }}
                        >

                            <Stack spacing={2}>

                                {/* <InfoOutlinedIcon
                                    color="primary"
                                    sx={{
                                        fontSize: 42
                                    }}
                                />

                                <Divider /> */}

                                <Typography>

                                    v{import.meta.env.VITE_APP_VERSION} | (Build {import.meta.env.VITE_APP_BUILD})

                                </Typography>

                                <Divider />

                                <Stack spacing={2}>

                                    <Typography
                                        variant="Caption"
                                        fontWeight={500}
                                        color="text.secondary"
                                    >
                                        IT Contact
                                    </Typography>

                                    <Grid
                                        container
                                        spacing={2}
                                    >

                                                            {[
                                            { name: "IT. Karjono", ext: "294" },
                                            { name: "IT. Irfan", ext: "297" },
                                            { name: "IT. Deny", ext: "294" },
                                            { name: "IT. Fikri", ext: "297" }
                                        ].map((it) => (
                                            <Grid key={it.name} size={{ xs: 12, md: 6 }}>
                                                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <SupportAgentOutlinedIcon color="primary" />
                                                        <Box>
                                                            <Typography fontWeight={600}>{it.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary">IT - Back Task &amp; Operation Technology</Typography>
                                                            <Typography variant="body2" color="text.secondary">Ext. {it.ext}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Box
                                                        component="span"
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-label={`Copy ${it.ext}`}
                                                        onClick={() => { navigator.clipboard.writeText(it.ext); showSnackbar(`Ext ${it.ext} copied`, "success"); }}
                                                        onKeyDown={(e) => { if (e.key === "Enter") { navigator.clipboard.writeText(it.ext); showSnackbar(`Ext ${it.ext} copied`, "success"); }}}
                                                        sx={{ display: "inline-flex", p: 0.5, borderRadius: 1, cursor: "pointer", "&:hover": { bgcolor: "grey.100" } }}
                                                    >
                                                        <ContentCopyIcon fontSize="small" color="action" />
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                        ))}

                                    </Grid>

                                </Stack>

                            </Stack>

                        </AppCard>

                    </Grid>

                </Grid>

            </Box>

            <SystemDialog

                open={coachDialogOpen}
                onClose={handleCloseCoachDialog}

                onSaved={() =>

                    showSnackbar(

                        "Data Korean Coach berhasil disimpan.",

                        "success"

                    )

                }

                onSaveError={(message) =>
                    showSnackbar(
                        message,
                        "warning"
                    )
                }

                onDeleted={() =>

                    showSnackbar(

                        "Data Korean Coach berhasil dihapus.",

                        "success"

                    )

                }

                onDeleteError={() =>

                    showSnackbar(

                        "Gagal menghapus Data Korean Coach.",

                        "error"

                    )

                }

                form={form}
                setForm={setForm}
                onChange={handleChange}
                onSearchEmployee={handleSearchEmployee}
                onEmployeeKeyDown={handleEmployeeKeyDown}

            />

        </>

    );

}

export default System;