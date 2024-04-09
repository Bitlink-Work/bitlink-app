import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export const toastMessage = (msg: string) => {
  toast(msg);
};

export const invalidKeyInterger = (key: string) => {
  return [".", "-", "+", "e", "E"].includes(key);
};

export const invalidKeyFloat = (key: string) => {
  return ["-", "+", "e", "E"].includes(key);
};

export const addressWalletCompact = (address: string) => {
  return `${address?.slice(0, 6)}...${address?.slice(
    address.length - 4,
    address.length,
  )}`;
};
export const condensedAddress = (address: string) => {
  return `${address?.slice(address.length - 6, address.length)}`;
};
export const domainCompact = (address: string) => {
  return `${address.slice(0, 8)}[...]${address.slice(
    address.length - 15,
    address.length,
  )}`;
};
export const shortenedPath = (address: any) => {
  return `${address.slice(0, 12)}[...]`;
};
export const userNameCompact = (username: string) => {
  return `${username.slice(0, 8)}...${username.slice(
    username.length - 4,
    username.length,
  )}`;
};
export const randomKeyUUID = () => {
  return uuidv4();
};

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export function fixedBalanceEtherZero(valueStr: string) {
  const stringArr = valueStr.toString().split(".");
  if (stringArr[1] === "0") {
    return stringArr[0];
  }
  return valueStr;
}

// get Link RefCode
export const getUserRefcode = () => {
  return localStorage.getItem("_refCode");
};

export const getLinkRefCode = (link: string, refCode: string) => {
  if (refCode) {
    return `${link}?r=${refCode}`;
  } else {
    return link;
  }
};

export const isNativeCurrency = (currencyAddress: string) => {
  if (currencyAddress && currencyAddress.slice(0, 4) === "0x00") return true;
  return false;
};

export const validateEmail = (email: string) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  return re.test(String(email).toLowerCase());
};

export const validateFirstName = (firstName: string) => {
  const re = /^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  return re.test(firstName);
};
export const validateLastName = (lastName: string) => {
  const re = /^(?!\s)(^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/;
  return re.test(lastName);
};

export const validateDob = (dateString: string) => {
  var currentDate = new Date();
  const dateParts: string[] = dateString.split("/");
  const month: number = parseInt(dateParts[0], 10) - 1;
  const day: number = parseInt(dateParts[1], 10);
  const year: number = parseInt(dateParts[2], 10);

  const dateObject: Date = new Date(year, month, day);

  var regex =
    /^(?!\s+$)(^\s*$|^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$)/;
  if (!regex.test(dateString) || dateObject > currentDate) {
    return false;
  }
  return true;
};

export const validateIDNumber = (idNumber: string) => {
  var regex = /^(?!\s+$)(^\s*$|^[0-9]*$)/;
  if (!regex.test(idNumber)) {
    return false;
  }
  return true;
};

export const validateCompanyName = (companyName: string) => {
  var regex = /^(?!\s)(^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/;
  if (!regex.test(companyName)) {
    return false;
  }
  return true;
};

export const validateRegistrationNumber = (registrationNumber: string) => {
  var regex = /^\s*\d{6,15}\s*$/;
  if (!regex.test(registrationNumber)) {
    return false;
  }
  return true;
};

export const validateWebsite = (website: string) => {
  var regex =
    /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
  if (!regex.test(website)) {
    return false;
  }
  return true;
};

export const validatePhoneNumber = (phoneNumber: string) => {
  var regex = /^(?!\s+$)(^\s*$|^[0-9\+]{1,}[0-9\-]{3,15}$)/;
  if (!regex.test(phoneNumber)) {
    return false;
  }
  return true;
};

export const validateAddress = (address: string) => {
  var regex = /^(?!\s)([a-zA-Z0-9\s,'.-]+)$/;
  if (!regex.test(address)) {
    return false;
  }
  return true;
};
export const validateTaxID = (taxID: string) => {
  var regex = /^(?!\s+$)(^\s*$|^[a-zA-Z0-9]{10,15}$)/;
  if (!regex.test(taxID)) {
    return false;
  }
  return true;
};
export const validatepostCode = (postCode: string) => {
  var regex = /^(?!\s+$)(^\s*$|[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$)/i;
  if (!regex.test(postCode)) {
    return false;
  }
  return true;
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [day, month, year] = dateString?.split("/");
  return `${month}/${day}/${year}`;
};

export const handleCloseModal = (popupRef: any, callback: Function) => {
  const handleClickOutside = (event: any) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      callback();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
};
