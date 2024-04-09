import axiosClient from "./axiosClient";
import { GET_KYB, UPLOAD_KYB } from "./endpoint";

export const kybServices = {
  uploadKYB: async (bodyParams: any) => {
    return axiosClient.post(UPLOAD_KYB, bodyParams);
  },
  getInfoKyb: async (id: string) => {
    return axiosClient.get(`${GET_KYB}/${id}`);
  },
};
