export * from "./sidebar";

export const Status: Record<string, any> = {
  WAITING: {
    background: "rgba(251,138,0,0.12)",
    border: "rgba(251,138,0,1)",
    text: "Awaiting payment",
    icon: "/images/invoices/awaiting.svg",
  },
  COMPLETED: {
    background: "#00CB001F",
    border: "#43A048",
    text: "Completed",
    icon: "/images/invoices/completed.svg",
  },
  OVERDUE: {
    background: "#D93F211F",
    border: "#D93F21",
    text: "Overdue",
    icon: "/images/invoices/overdue.svg",
  },
  DRAFT: {
    background: "#4d4d501a",
    border: "#4D4D50",
    text: "Draft",
    icon: "/images/invoices/draft.svg",
  },
};

export const ACTIONS: Record<string, string[]> = {
  WAITING: ["view", "noti", "check"],
  COMPLETED: ["view", "buy"],
  OVERDUE: ["view", "noti", "delete"],
  DRAFT: ["view", "send", "delete"],
};

export const DocumentStatus: Record<string, any> = {
  PendingSignature: {
    background: "rgba(251,138,0,0.12)",
    border: "rgba(251,138,0,1)",
    text: "Pending signature 1",
    icon: "/images/invoices/awaiting.svg",
  },
  PendingYourSignature: {
    background: "rgba(251,138,0,0.12)",
    border: "rgba(251,138,0,1)",
    text: "Pending signature 2",
    icon: "/images/invoices/awaiting.svg",
  },
  Signed: {
    background: "#00CB001F",
    border: "#43A048",
    text: "Signed",
    icon: "/images/invoices/completed.svg",
  },
  Draft: {
    background: "#4d4d501a",
    border: "#4D4D50",
    text: "Draft",
    icon: "/images/invoices/draft.svg",
  },
};
