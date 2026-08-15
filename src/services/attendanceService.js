import dayjs from "dayjs";

import systemApiService from "./systemApiService";

const attendanceService = {

    async getAgendas(month) {

        const loginUser = JSON.parse(

            localStorage.getItem("csg_user")

        );

        return await systemApiService.execute({

            apiCd: "COMBO_TRAINING",
            type: "SEARCH",
            param01: month,
            param02: loginUser?.EMPID ?? ""

        });

    },

    async getProgress(scheduleId, scanType) {

        return await systemApiService.execute({

            apiCd: "GET_ATTENDANCE_PROGRESS",
            type: "SEARCH",
            param01: scheduleId,
            param02: scanType

        });

    },

    async getAttendanceSummary(scheduleId) {

        return await systemApiService.execute({

            apiCd: "GET_ATTENDANCE_SUMMARY",
            type: "SEARCH",
            param01: scheduleId

        });

    },

    async saveScan(scan) {

        const loginUser = JSON.parse(

            localStorage.getItem("csg_user")

        );

        return await systemApiService.execute({

            apiCd: "SAVE_SCAN",
            type: "SAVE",
            param01: scan.SCAN_DATE,
            param02: dayjs(scan.SCAN_DTTM).format("YYYY-MM-DD HH:mm:ss"),
            param03: scan.SCAN_TYPE,
            param04: scan.SCAN_RF_ID,
            param05: scan.SCAN_EMPID,
            param06: scan.SCAN_EMP_NM,
            param07: scan.SCAN_POSITION,
            param08: scan.SCAN_DEPT_NM,
            param09: scan.SCHEDULE_ID,
            param10: scan.SCHEDULE_NM,
            param11: scan.ROOM_ID,
            param12: scan.ROOM_NAME,
            param13: scan.TRAINER_EMPID,
            param14: scan.TRAINER_EMP_NM,
            param15: scan.MANUAL_YN,
            param16: scan.MEMO,
            param17: loginUser?.EMPID ?? ""

        });

    },

    async setAbsentStatus(scheduleId, status) {

        const loginUser = JSON.parse(

            localStorage.getItem("csg_user")

        );

        return await systemApiService.execute({

            apiCd: "SET_ABSENT_STATUS",
            type: "SAVE",
            param01: scheduleId,
            param02: status,
            param03: loginUser?.EMPID ?? ""

        });

    },

};

export default attendanceService;