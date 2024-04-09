export const alertConstants = {
  LOADING: "ALERT_MESSAGE_LOADING",
  UPDATE: "ALERT_MESSAGE_UPDATE",
  SUCCESS: "ALERT_MESSAGE_SUCCESS",
  ERROR: "ALERT_MESSAGE_ERROR",
  WARNING: "ALERT_MESSAGE_WARNING",
  INFO: "ALERT_MESSAGE_INFO",
  CLEAR: "ALERT_MESSAGE_CLEAR",
};
export const alertActions = {
  loading,
  update,
  warning,
  success,
  error,
  info,
  clear,
};

function loading(message: any, key: any) {
  return { type: alertConstants.LOADING, message, key };
}
function update(message: any, key: any) {
  return { type: alertConstants.UPDATE, message, key };
}
function success(message: any, key: any) {
  return { type: alertConstants.SUCCESS, message, key };
}
function warning(message: any, key: any) {
  return { type: alertConstants.WARNING, message, key };
}
function error(message: any, key: any) {
  return { type: alertConstants.ERROR, message, key };
}
function info(message: any, key: any) {
  return { type: alertConstants.INFO, message, key };
}

function clear(key: any) {
  return { type: alertConstants.CLEAR, key };
}
