import axiosClient from "./axiosClient";
import {
  CHECK_INVOICE_PAYMENT,
  CREATE_INVOICE,
  CREATE_PARTNER,
  DELETE_INVOICE,
  DELETE_INVOICE_ITEM,
  GET_CREATED_DATA,
  GET_CREATED_INVOICE,
  GET_CURRENCY,
  GET_INVOICE_DETAIL,
  GET_PARTNER,
  GET_PARTNER_BILLING,
  GET_RECEIVED_DATA,
  GET_RECEIVED_INVOICE,
  SEND_MAIL,
  UPDATE_INVOICE,
  UPDATE_INVOICE_STATUS,
  UPDATE_PARTNER,
  UPLOAD_LOGO_INVOICE,
  VERIFY_WALLET_ADDRESS,
} from "./endpoint";

export const invoiceServices = {
  createInvoice: async (bodyParams: any) => {
    return axiosClient.post(CREATE_INVOICE, bodyParams);
  },
  updateInvoice: async (bodyParams: any) => {
    return axiosClient.put(UPDATE_INVOICE, bodyParams);
  },
  deleteInvoice: async (bodyParams: any) => {
    return axiosClient.delete(DELETE_INVOICE, { data: bodyParams });
  },
  deleteInvoiceItem: async (params: any) => {
    return axiosClient.delete(DELETE_INVOICE_ITEM, { params });
  },
  uploadLogo: async (bodyParams: any) => {
    return axiosClient.post(UPLOAD_LOGO_INVOICE, bodyParams);
  },
  getCreatedInvoice: async (params: any) => {
    return axiosClient.get(GET_CREATED_INVOICE, { params });
  },
  getCreatedData: async () => {
    return axiosClient.get(GET_CREATED_DATA);
  },
  checkInvoicePayment: async (bodyParams: any) => {
    return axiosClient.post(CHECK_INVOICE_PAYMENT, bodyParams);
  },
  getAllCreatedInvoice: async (params: any) => {
    return axiosClient.get(GET_CREATED_INVOICE, {
      params,
    });
  },
  getReceivedInvoice: async (params: any) => {
    return axiosClient.get(GET_RECEIVED_INVOICE, { params });
  },
  getReceivedData: async () => {
    return axiosClient.get(GET_RECEIVED_DATA);
  },
  getAllReceivedInvoice: async (params: any) => {
    return axiosClient.get(GET_RECEIVED_INVOICE, {
      params,
    });
  },
  getInvoiceDetail: async (id: string) => {
    return axiosClient.get(GET_INVOICE_DETAIL, { params: { invoice_id: id } });
  },
  updateInvoiceStatus: async (bodyParams: any) => {
    return axiosClient.post(UPDATE_INVOICE_STATUS, bodyParams);
  },
  verifyWalletAddress: async (params: any) => {
    return axiosClient.get(VERIFY_WALLET_ADDRESS, {
      params: {
        public_address: params.public_address,
      },
    });
  },
  sendMail: async (bodyParams: any) => {
    return axiosClient.post(SEND_MAIL, bodyParams);
  },
  createPartner: async (bodyParams: any) => {
    return axiosClient.post(CREATE_PARTNER, bodyParams);
  },
  updatePartner: async (bodyParams: any) => {
    return axiosClient.put(UPDATE_PARTNER, bodyParams);
  },
  getPartner: async () => {
    return axiosClient.get(GET_PARTNER);
  },
  getPartnerBilling: async (params: any) => {
    return axiosClient.get(GET_PARTNER_BILLING, {
      params: {
        partner_id: params.partner_id,
        page: params.page,
        page_size: params.page_size,
      },
    });
  },
  getCurrency: async () => {
    return axiosClient.get(GET_CURRENCY);
  },
};
