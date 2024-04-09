const ROUTER_DAPP = "core";

export const PREFIX = "api";
export const UPLOAD_ENDPOINT = "uploader";
export const UPLOAD_IMAGE_ENDPOINT = "/upload/collection";
export const UPLOAD_IMAGE_SECURE_ENDPOINT = `${UPLOAD_ENDPOINT}/secure/image`;

const routerAuth = "auth";
export const AUTH_GET_SIGN_MESSAGE_ENDPOINT = `${ROUTER_DAPP}/${routerAuth}/sign`;
export const AUTH_SIGN_IN_ENDPOINT = `${ROUTER_DAPP}/${routerAuth}/sign_in`;
export const AUTH_SIGN_IN_GOOGLE_ENDPOINT = `${ROUTER_DAPP}/${routerAuth}/sign_in_email`;

const routerUser = "user";
export const GET_PROFILE = `${ROUTER_DAPP}/${routerAuth}/profile`;
export const CREATE_USER = `${ROUTER_DAPP}/${routerAuth}/user`;
export const UPDATE_PROFILE = `${ROUTER_DAPP}/${routerAuth}/user`;
export const UPDATE_USER_TYPE = `${ROUTER_DAPP}/${routerAuth}/update_type`;
export const GET_ENS_NAME_USER = `${ROUTER_DAPP}/user/ens_name/list`;
export const UPDATE_ENS_NAME_USER = `${ROUTER_DAPP}/user/ens_name/update`;
export const USER_API_KEY = `${ROUTER_DAPP}/${routerUser}/api_key`;

export const USER_CALLBACK_URL = `${ROUTER_DAPP}/${routerUser}/callback`;

// INVOICE

export const CREATE_INVOICE = `${ROUTER_DAPP}/invoice/`;
export const UPDATE_INVOICE = `${ROUTER_DAPP}/invoice/invoice`;
export const DELETE_INVOICE = `${ROUTER_DAPP}/invoice/invoice`;
export const DELETE_INVOICE_ITEM = `${ROUTER_DAPP}/invoice/invoice_item`;
export const UPLOAD_LOGO_INVOICE = `${ROUTER_DAPP}/invoice/upload_logo`;
export const GET_CREATED_INVOICE = `${ROUTER_DAPP}/invoice/created_invoices`;
export const GET_CREATED_DATA = `${ROUTER_DAPP}/invoice/created_data`;
export const CHECK_INVOICE_PAYMENT = `${ROUTER_DAPP}/invoice/tx_hash`;
export const GET_INVOICE_DETAIL = `${ROUTER_DAPP}/invoice/detail`;
export const UPDATE_INVOICE_STATUS = `${ROUTER_DAPP}/invoice/update_status`;
export const VERIFY_WALLET_ADDRESS = `${ROUTER_DAPP}/invoice/wallet_address`;
export const GET_RECEIVED_INVOICE = `${ROUTER_DAPP}/invoice/get_received_invoices`;
export const GET_RECEIVED_DATA = `${ROUTER_DAPP}/invoice/received_data`;
export const CREATE_PARTNER = `${ROUTER_DAPP}/partner/partners`;
export const UPDATE_PARTNER = `${ROUTER_DAPP}/partner/partners`;
export const GET_PARTNER = `${ROUTER_DAPP}/partner/partners`;
export const GET_PARTNER_BILLING = `${ROUTER_DAPP}/partner/billing_history`;
export const SEND_MAIL = `${ROUTER_DAPP}/mail/send_invoice`;
export const GET_CURRENCY = `${ROUTER_DAPP}/chain/currencies`;

// KYC

export const UPLOAD_KYC = `${ROUTER_DAPP}/kyc/kyc`;
export const GET_KYC = `${ROUTER_DAPP}/kyc`;

//KYB

export const UPLOAD_KYB = `${ROUTER_DAPP}/kyb/kyb`;
export const GET_KYB = `${ROUTER_DAPP}/kyb`;
