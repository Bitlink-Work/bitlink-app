import axiosClient from "./axiosClient";
import { GET_KYC, UPLOAD_KYC } from "./endpoint";

export const kycServices = {
  uploadKYC: async (bodyParams: any) => {
    return axiosClient.post(UPLOAD_KYC, bodyParams);
  },
  getKYC: async (params: any) => {
    return axiosClient.get(`${GET_KYC}/${params}`);
  },
};
