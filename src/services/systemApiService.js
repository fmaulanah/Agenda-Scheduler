import api from "../api/apiClient";

const SERVICE_ID = "JJ";

const systemApiService = {

    async execute({

        apiCd,

        type = "",

        plantCd = "",

        dt = "",

        param01 = "",
        param02 = "",
        param03 = "",
        param04 = "",
        param05 = "",
        param06 = "",
        param07 = "",
        param08 = "",
        param09 = "",
        param10 = "",
        param11 = "",
        param12 = "",
        param13 = "",
        param14 = "",
        param15 = "",
        param16 = "",
        param17 = "",
        param18 = "",
        param19 = "",
        param20 = "",

        remark = ""

    }) {

        const user = JSON.parse(
            localStorage.getItem("csg_user") || "{}"
        );
        const params = {

            serviceId: SERVICE_ID,

            userId: user?.USER_ID ?? "",

            apiCd,

            type,

            plantCd: plantCd || user?.PLANT_CD || "",

            dt,

            param01,
            param02,
            param03,
            param04,
            param05,
            param06,
            param07,
            param08,
            param09,
            param10,
            param11,
            param12,
            param13,
            param14,
            param15,
            param16,
            param17,
            param18,
            param19,
            param20,

            remark,

            token: user?.TOKEN ?? ""

        };

        console.log(params);

        const { data } = await api.get(
            "/systemAPI",
            {
                params
            }
        );

        return data;

    }

};

export default systemApiService;