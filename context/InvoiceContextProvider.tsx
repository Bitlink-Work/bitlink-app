import { dataInvoiceDefault } from "@/public/utils/constants";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type TypeInvoiceContextProp = {
  isOpen: boolean;
  isOwner: boolean;
  dataInvoice: TypeInvoice;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOwner: React.Dispatch<React.SetStateAction<boolean>>;
  setInvoiceToLocalStorage: (data: TypeInvoice) => void;
  getInvoiceToLocalStorage: () => TypeInvoice;
};

const InvoiceContext = createContext<TypeInvoiceContextProp>({
  isOpen: false,
  isOwner: false,
  dataInvoice: dataInvoiceDefault,
  setIsOpen: () => {},
  setIsOwner: () => {},
  setInvoiceToLocalStorage: (dataInvoiceDefault) => {},
  getInvoiceToLocalStorage: () => dataInvoiceDefault,
});

const useInvoiceContext = () => useContext(InvoiceContext);

const InvoiceContextProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [dataInvoice, setDataInvoice] =
    useState<TypeInvoice>(dataInvoiceDefault);

  const setInvoiceToLocalStorage = (data: TypeInvoice) => {
    localStorage.setItem("dataInvoice", JSON.stringify(data));
    setDataInvoice(data);
  };
  const getInvoiceToLocalStorage = () => {
    return localStorage.getItem("dataInvoice")
      ? (JSON.parse(localStorage.getItem("dataInvoice") || "") as TypeInvoice)
      : dataInvoiceDefault;
  };

  useEffect(() => {
    const rs = getInvoiceToLocalStorage();
    if (Boolean(rs)) {
      setDataInvoice(rs || dataInvoiceDefault);
    } else {
      setInvoiceToLocalStorage(dataInvoiceDefault);
      setDataInvoice(dataInvoiceDefault);
    }
  }, []);

  const value = {
    isOpen,
    setIsOpen,
    isOwner,
    setIsOwner,
    dataInvoice,
    setInvoiceToLocalStorage,
    getInvoiceToLocalStorage,
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};

export { InvoiceContextProvider, useInvoiceContext };
