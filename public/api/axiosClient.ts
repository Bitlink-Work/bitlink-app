import { LocalStorage } from "@/public/utils/LocalStorage";
import axios, { AxiosResponse } from "axios";

const defaultHeader = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  Accept: "application/json",
};
// for multiple requests
let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// @ts-ignore

const baseURL: string = process.env.NEXT_PUBLIC_HOST || "";

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config: any) => {
    const token = LocalStorage.getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  (error: any) => {
    Promise.reject(error);
  },
);

//Add a response interceptor
axiosClient.interceptors.response.use(
  (response: any) => {
    return handleResponse(response);
  },
  (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient.request(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = LocalStorage.getRefreshToken();
      return axios
        .post("/auth/refresh-token", {
          refreshToken,
        })
        .then((res) => {
          if (res.status === 200) {
            LocalStorage.setToken(res.data);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + res.data.accessToken;
            processQueue(null, res.data.accessToken);
            return axiosClient(originalRequest);
          }
        })
        .catch((err) => {
          processQueue(err, null);
          clearAuthToken();
          window.location.href = "/login";
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(handleError(error));
  },
);

const handleResponse = (res: AxiosResponse<any>) => {
  if (res && res.data) {
    return res.data;
  }

  return res;
};

const handleError = (error: { response: { data: any } }) => {
  const { data } = error?.response;

  console.error(error);

  return data;
};

const clearAuthToken = () => {
  LocalStorage.clearToken();
};

export default axiosClient;
