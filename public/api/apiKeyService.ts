import axiosClient from "./axiosClient";
import { USER_API_KEY, USER_CALLBACK_URL } from "./endpoint";

export const ApiKeyServices = {
  createApiKey: (params: any) => {
    return axiosClient.post(USER_API_KEY, params);
  },
  getApiKeys: (params: any) => {
    return axiosClient.get(USER_API_KEY, { params });
  },
  deleteApiKey: (params: any) => {
    return axiosClient.delete(`${USER_API_KEY}/${params}`);
  },
  updateApiKey: (params: any) => {
    return axiosClient.put(`${USER_API_KEY}/${params._id}`, params);
  },
  updateURLCallBack: (params: any) => {
    return axiosClient.post(USER_CALLBACK_URL, params);
  },
};
