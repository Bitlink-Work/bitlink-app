import { combineReducers } from "@reduxjs/toolkit";
import alert from "./alert";
import ensName from "./ensName";
import wallet from "./walletSlice";

//API-KEYS
import apiKeys from "./apiKeysSlice";

//AWAITING
import modalAwaiting from "./modalAwaitingSlice";

//MARKETPLACE
import modalOverview from "./modalOverviewSlice";

//PROFILE
import modalChooseDomain from "./modalChooseDomainSlice";

// Select Chain Modal
import modalSelectChain from "./modalSelectChainSlice";
//Bridge
import profile from "./profileSlice";

import invoice from "./invoiceSlice";

import partner from "./partnerSlice";
import kyc from "./kycSlices";
import kyb from "./kybSlices";
import sign from "./signSlice";

const rootReducer = combineReducers({
  alert,
  wallet,
  apiKeys,
  modalAwaiting,
  modalOverview,
  modalChooseDomain,
  ensName,
  modalSelectChain,
  profile,
  invoice,
  kyc,
  kyb,
  sign,
  partner,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
