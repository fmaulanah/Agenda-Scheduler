import { useEffect, useRef } from "react";

import employeeService from "../services/employeeService";
import koreanService from "../services/koreanService";

import { setStorage } from "../utils/storage";
import STORAGE_KEYS from "../utils/storageKeys";

// const POLLING_INTERVAL = 30 * 60 * 1000;
const POLLING_INTERVAL = 10 * 60 * 1000;

function useMasterDataPolling() {

    const refreshingRef = useRef(false);

    useEffect(() => {

        const refreshMasterData = async () => {

            if (refreshingRef.current) {

                return;

            }

            try {

                refreshingRef.current = true;

                await Promise.all([

                    employeeService.refreshEmployees(),
                    koreanService.refreshKoreans()

                ]);

                setStorage(

                    STORAGE_KEYS.USER_LAST_SYNC,
                    new Date().toISOString()

                );

                console.log("Master data refreshed.");

            }
            catch (error) {

                console.error(
                    "Master data refresh failed:",
                    error
                );

            }
            finally {

                refreshingRef.current = false;

            }

        };

        const interval = setInterval(

            refreshMasterData,

            POLLING_INTERVAL

        );

        return () => {

            clearInterval(interval);

        };

    }, []);

}

export default useMasterDataPolling;