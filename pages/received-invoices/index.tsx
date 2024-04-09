import DefaultLayout from "@/components/layout/DefaultLayout";
import ReceivedInvoices from "@/components/received-invoices/ReceivedInvoices";
type Props = {};

const ReceivedInvoicesPage = (props: Props) => {
  return (
    <DefaultLayout type="received">
      <ReceivedInvoices />
    </DefaultLayout>
  );
};

export default ReceivedInvoicesPage;
