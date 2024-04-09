import {
  IconCustomers,
  IconDashboard,
  IconDocument,
  IconReceivedInvoices,
  IconSendInvoices,
  IconSettings,
} from "@/components/sidebar/Icon";

export const SIDEBAR_LIST = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <IconDashboard />,
  },
  {
    name: "Sent Invoices",
    link: "/sent-invoices",
    icon: <IconSendInvoices />,
    step: 3,
  },
  {
    name: "Received Invoices",
    link: "/received-invoices",
    icon: <IconReceivedInvoices />,
  },
  {
    name: "Customers",
    link: "/customers",
    icon: <IconCustomers />,
  },
  {
    name: "Document",
    link: "/document",
    icon: <IconDocument />,
  },
  {
    name: "Settings",
    link: "/settings",
    icon: <IconSettings />,
    step: 4,
  },
];
