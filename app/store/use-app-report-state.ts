import getBackendUrl from "@/utils/get-backend-url";
const apiBase = await getBackendUrl();
import axios, { AxiosError } from "axios";
import { IErrorResponse } from "@/types/backend-error-types";
import { create } from "zustand";

interface AppReportState {
    isReporting: boolean;
    sendReport:(data:FormData)=>Promise<{success:boolean,error?:string}>;
}

export const useAppReportStore = create<AppReportState>((set) => ({
    isReporting: false,
    sendReport: async (data) => {
        set({
            isReporting: true,
          });
        try {
            await axios.post(
              `${apiBase}/api/app-history/create`,
              data,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                withCredentials: true
              }
            );
            set({
              isReporting: false,
            });
            return { success: true };
          } catch (error) {
            const { response } = error as AxiosError<IErrorResponse>;
            set({
              isReporting: false,
            });
            return { success: false, error: response?.data.errorMessage ?? "Server is not connected" };
          }
    }
}));