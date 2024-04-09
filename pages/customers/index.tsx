import DefaultLayout from "@/components/layout/DefaultLayout";
import PartnerContactComponent from "@/components/partners-contact/PartnerContactComponent";
import BillingHistory from "@/components/partners-contact/components/BillingHistory";
import ContactDetail from "@/components/partners-contact/components/ContactDetail";
import Popup from "@/components/popup/Popup";
import { getPartner } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import { useCallback, useEffect, useState } from "react";

type Props = {};

const PartnerContact = (props: Props) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const dispatch = useAppDispatch();
  const listPartners = useAppSelector(selectListPartners);
  const fetchListPartners = useCallback(async () => {
    dispatch(getPartner({}));
  }, [dispatch]);
  useEffect(() => {
    fetchListPartners();
  }, [fetchListPartners]);

  const [partner, setPartner] = useState<any>();

  return (
    <DefaultLayout>
      <PartnerContactComponent
        listPartners={listPartners}
        setPartner={setPartner}
        setShowHistory={setShowHistory}
        setShowContactDetail={setShowContactDetail}
      />
      <Popup showPopup={showHistory}>
        <BillingHistory partner={partner} setShowHistory={setShowHistory} />
      </Popup>
      <Popup showPopup={showContactDetail}>
        <ContactDetail
          partner={partner}
          setShowContactDetail={setShowContactDetail}
        />
      </Popup>
    </DefaultLayout>
  );
};

export default PartnerContact;
