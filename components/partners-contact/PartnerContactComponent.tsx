import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Partner from "./components/Partner";

type Props = {
  listPartners: any;
  setPartner: (partner: any) => void;
  setShowHistory: (showHistory: boolean) => void;
  setShowContactDetail: (showContactDetail: boolean) => void;
};

const PartnerContactComponent = ({
  listPartners,
  setPartner,
  setShowHistory,
  setShowContactDetail,
}: Props) => {
  const [freelancerPartners, setFreelancerPartners] = useState<any>([]);
  const [businessPartners, setBusinessPartners] = useState<any>([]);

  useEffect(() => {
    if (listPartners) {
      setFreelancerPartners(
        listPartners.filter((partner: any) => partner?.type === "FREELANCER"),
      );
      setBusinessPartners(
        listPartners.filter((partner: any) => partner?.type === "BUSINESS"),
      );
    }
  }, [listPartners]);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeIn("left", 0, 0, 0.5)}
      className="flex h-fit w-full flex-col items-start justify-start gap-8 font-poppins"
    >
      <div className="flex w-full flex-col items-start gap-6">
        <div className="flex flex-row items-center justify-start gap-4">
          <h2 className="text-2xl font-semibold leading-9 text-text-primary">
            Organization
          </h2>
          <div className="h-6 w-[1px] bg-[#DEDEDE]"></div>
          <div className="flex flex-row gap-[6px]">
            <p className="text-sm font-semibold leading-[150%] text-primary">
              {businessPartners ? businessPartners?.length : 0}
            </p>
            <p className="text-sm font-medium leading-[150%] text-text-secondary">
              Organization Contacts
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          {businessPartners?.map((partner: any) => (
            <Partner
              key={partner?.partner_id}
              partner={partner}
              setPartner={setPartner}
              setShowHistory={setShowHistory}
              setShowContactDetail={setShowContactDetail}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6">
        <div className="flex flex-row items-center justify-start gap-4">
          <h2 className="text-2xl font-semibold leading-9 text-text-primary">
            Individual
          </h2>
          <div className="h-6 w-[1px] bg-[#DEDEDE]"></div>
          <div className="flex flex-row gap-[6px]">
            <p className="text-sm font-semibold leading-[150%] text-primary">
              {freelancerPartners ? freelancerPartners?.length : 0}
            </p>
            <p className="text-sm font-medium leading-[150%] text-text-secondary">
              Individual Contacts
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          {freelancerPartners?.map((partner: any) => (
            <Partner
              key={partner?.partner_id}
              partner={partner}
              setPartner={setPartner}
              setShowHistory={setShowHistory}
              setShowContactDetail={setShowContactDetail}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PartnerContactComponent;
