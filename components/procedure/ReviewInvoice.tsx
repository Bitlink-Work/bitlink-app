"use client";
import { useEffect, useState } from "react";
import Popup from "../popup/Popup";

import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { getPartner } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import { selectProfile } from "@/public/reducers/profileSlice";
import AddClient from "../invoices/components/AddClient";
import EditExpired from "../invoices/components/EditExpired";
import EditInfo from "../invoices/components/EditInfo";
import ReviewDetail from "./ReviewDetail";
const ReviewInvoice = ({
  setStepPro,
  step9Data,
  setIdInvoice,
  setStep9Data,
}: any) => {
  const [formValues, setFormValues] = useState<any>({});
  const { isOpen, isOwner } = useInvoiceContext();
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const res = new Date();
  res.setDate(res.getDate() + 30);
  const [expiredDate, setExpiredDate] = useState<Date>(res);
  const [deadline, setDeadline] = useState(30);
  const [showEditExpired, setShowEditExpired] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchOwner = async () => {
      await dispatch(getPartner({}));
    };
    fetchOwner();
  }, []);

  // useEffect(() => {
  //   const res = new Date();
  //   res.setDate(res.getDate() + deadline);
  //   setExpiredDate(res);
  // }, []);

  const profile = useAppSelector(selectProfile);
  const listPartner = useAppSelector(selectListPartners);

  const { dataInvoice } = useInvoiceContext();

  const profileOwner = listPartner.find(
    (element: any) => element.partner_id === dataInvoice.to_id,
  );

  return (
    <div className="flex flex-col items-start gap-8 bg-[#fdfcfb]">
      <ReviewDetail
        setIdInvoice={setIdInvoice}
        step9Data={step9Data}
        setStep9Data={setStep9Data}
        setShowAddClient={setShowAddClient}
        setShowEditInfo={setShowEditInfo}
        setShowEditExpired={setShowEditExpired}
        expiredDate={expiredDate}
        profile={profile}
        profileOwner={profileOwner}
      />
      <Popup showPopup={showAddClient}>
        <AddClient
          setShowAddClient={setShowAddClient}
          receiver={profileOwner}
          type={""}
          profile={profile}
        />
      </Popup>
      <Popup showPopup={showEditInfo}>
        <EditInfo setShowEditInfo={setShowEditInfo} profile={profile} />
      </Popup>
      <Popup showPopup={showEditExpired}>
        <EditExpired
          setShowEditExpired={setShowEditExpired}
          setExpiredDate={setExpiredDate}
          setDeadline={setDeadline}
          deadline={deadline}
        />
      </Popup>
    </div>
  );
};

export default ReviewInvoice;
