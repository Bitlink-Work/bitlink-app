import React, { ReactNode } from "react";
import { InvoiceContextProvider } from "./InvoiceContextProvider";
import { InstructionsProvider } from "./InstructionsProvider";

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <InvoiceContextProvider>
      <InstructionsProvider>{children}</InstructionsProvider>
    </InvoiceContextProvider>
  );
};

export default AppContextProvider;
