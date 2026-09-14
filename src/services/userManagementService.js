import systemApiService from "./systemApiService";

const userManagementService = {

    async getUsers() {

        return await systemApiService.execute({

            apiCd: "USER_LIST",
            type: "SEARCH"

        });

    },

    async saveUser(form) {

        console.log(form);

        return await systemApiService.execute({

            apiCd: "USER_SAVE",
            type: "SAVE",
            param01: form.serviceId,
            param02: form.userId,
            param03: form.password,
            param04: form.empid,
            param05: form.empName,
            param06: form.roleId,
            param07: form.plantCd,
            param08: form.deptNm,
            param09: form.remark,
            param10: form.email

        });

    },

    async updateUser(form) {

        return await systemApiService.execute({

            apiCd: "USER_UPDATE",
            type: "SAVE",
            param01: form.userId,
            param02: form.empid,
            param03: form.empName,
            param04: form.roleId,
            param05: form.plantCd,
            param06: form.deptNm,
            param07: form.remark,
            param08: form.email,
            param09: form.blockYn,
            param10: form.useYn

        });

    },

    async deleteUser(userId) {

        return await systemApiService.execute({

            apiCd: "USER_DELETE",
            type: "SAVE",
            param01: userId

        });

    },

    async resetPassword(userId, newPassword) {

        return await systemApiService.execute({

            apiCd: "USER_RESET_PASSWORD",
            type: "SAVE",
            param01: userId,
            param02: newPassword

        });

    }

};

export default userManagementService;
