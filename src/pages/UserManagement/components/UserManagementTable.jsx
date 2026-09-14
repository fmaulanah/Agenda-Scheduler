import { useState } from "react";

import {
    Box,
    Chip,
    IconButton,
    Typography,
    Pagination
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";

import EmptyState from "../../../components/common/Empty/EmptyState";
import SkeletonTable from "../../../components/common/Loading/SkeletonTable";

import useResponsive from "../../../hooks/useResponsive";

function UserManagementTable({ rows, loading, onEdit, onToggleBlock, onResetPassword }) {
    const { isMobile } = useResponsive();
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const filteredRows = rows;
    const mobileRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

    if (loading) {
        return <SkeletonTable rows={6} />;
    }

    const columns = [
        {
            field: "USER_ID",
            headerName: "User ID",
            flex: 1,
            minWidth: 120,
            headerAlign: "left",
            align: "left"
        },
        {
            field: "EMPID",
            headerName: "NIK / EMPID",
            flex: 1,
            minWidth: 100,
            headerAlign: "left",
            align: "left"
        },
        {
            field: "EMP_NAME",
            headerName: "Nama",
            flex: 1,
            minWidth: 150,
            headerAlign: "left",
            align: "left"
        },
        {
            field: "ROLE_ID",
            headerName: "Role",
            flex: 0.8,
            minWidth: 90,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === "ADMIN" ? "primary" : "default"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                />
            )
        },
        {
            field: "PLANT_CD",
            headerName: "Plant",
            flex: 0.6,
            minWidth: 80,
            headerAlign: "center",
            align: "center"
        },
        {
            field: "DEPT_NM",
            headerName: "Departemen",
            flex: 1,
            minWidth: 120,
            headerAlign: "left",
            align: "left"
        },
        {
            field: "EMAIL",
            headerName: "Email",
            flex: 1,
            minWidth: 150,
            headerAlign: "left",
            align: "left"
        },
        {
            field: "USE_YN",
            headerName: "Aktif",
            flex: 0.6,
            minWidth: 80,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Chip
                    label={params.value === "Y" ? "Ya" : "Tidak"}
                    color={params.value === "Y" ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                />
            )
        },
        {
            field: "BLOCK_YN",
            headerName: "Blokir",
            flex: 0.6,
            minWidth: 80,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Chip
                    label={params.value === "Y" ? "Ya" : "Tidak"}
                    color={params.value === "Y" ? "error" : "default"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                />
            )
        },
        {
            field: "actions",
            headerName: "Aksi",
            flex: 1.2,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => {

                const isActive = params.row.USE_YN === "Y";

                return (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            width: "100%",
                            height: "100%"
                        }}
                    >

                        <IconButton
                            size="small"
                            onClick={() => onEdit(params.row)}
                            sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                "&:hover": {
                                    bgcolor: "primary.dark"
                                }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => onResetPassword(params.row)}
                            sx={{
                                bgcolor: "info.main",
                                color: "white",
                                "&:hover": {
                                    bgcolor: "info.dark"
                                }
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => {

                                const action = isActive
                                    ? "disable"
                                    : "enable";

                                const message = isActive
                                    ? `Apakah Anda ingin menonaktifkan user ${params.row.USER_ID}?`
                                    : `Apakah Anda ingin mengaktifkan user ${params.row.USER_ID}?`;

                                onToggleBlock(
                                    params.row,
                                    action,
                                    message
                                );

                            }}
                            sx={{
                                bgcolor: isActive
                                    ? "warning.main"
                                    : "success.main",
                                color: "white",
                                "&:hover": {
                                    bgcolor: isActive
                                        ? "warning.dark"
                                        : "success.dark"
                                }
                            }}
                        >

                            {

                                isActive

                                    ? <BlockIcon fontSize="small" />

                                    : <CheckCircleIcon fontSize="small" />

                            }

                        </IconButton>

                    </Box>

                );

            }
        }
    ];

    if (filteredRows.length === 0 && !loading) {
        return (
            <EmptyState
                title="Tidak ada user"
                subtitle="Klik Tambah User untuk menambahkan user baru."
            />
        );
    }

    if (isMobile) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {mobileRows.map((row) => (
                    <Box
                        key={row.USER_ID}
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                            borderLeft: 4,
                            borderLeftColor: row.USE_YN === "Y" ? "primary.main" : "grey.400",
                            bgcolor: "background.paper"
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle2" fontWeight={700}>{row.USER_ID}</Typography>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                                <Chip label={row.ROLE_ID} size="small" color={row.ROLE_ID === "ADMIN" ? "primary" : "default"} />
                                <Chip label={row.USE_YN === "Y" ? "Aktif" : "Non Aktif"} size="small" color={row.USE_YN === "Y" ? "success" : "default"} />
                                {row.BLOCK_YN === "Y" && <Chip label="Blokir" size="small" color="error" />}
                            </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{row.EMP_NAME}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.DEPT_NM} • {row.PLANT_CD}</Typography>
                    </Box>
                ))}
                {filteredRows.length > pageSize && (
                    <Pagination
                        count={Math.ceil(filteredRows.length / pageSize)}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        sx={{ alignSelf: "center", mt: 1 }}
                    />
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>
            {/* <Box sx={{ px: { xs: 2, md: 3 }, pt: 2, pb: 1.5, bgcolor: "grey.50", borderBottom: 1, borderColor: "divider" }}>
                <TextField
                    placeholder="Cari User ID, Nama, atau NIK..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    size="small"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box> */}
            <Box sx={{ width: "100%" }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    getRowId={(row) => row.USER_ID}
                    density="comfortable"
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5 }
                        }
                    }}
                    slots={{
                        noRowsOverlay: () => (
                            <EmptyState title="Tidak ada user" subtitle="Klik Tambah User untuk menambahkan user baru." />
                        )
                    }}
                />
            </Box>
        </Box>
    );
}

export default UserManagementTable;