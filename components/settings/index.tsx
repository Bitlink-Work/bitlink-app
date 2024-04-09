import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import { useState } from "react";

import { useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { EnumTypeProfile } from "@/public/utils/constants";
import Payment from "./Payment";
import Settings from "./Settings";
import TypeSetting from "./TypeSetting";

const SettingsComponent = () => {
  const profile = useAppSelector(selectProfile);
  const tabs = [
    { title: "User Type" },
    {
      title:
        profile?.type === EnumTypeProfile.Business
          ? "Organization Settings"
          : "Individual Settings",
    },
    { title: "Payment Methods" },
  ];
  const [activeTab, setActiveTab] = useState("User Type");

  return (
    <div className="flex h-fit w-full flex-col items-start justify-start gap-8">
      {/* Tabs */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("left", 0, 0, 0.5)}
        className="flex w-full items-end"
      >
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => setActiveTab(tab.title)}
            className={`border-b-2 px-8 py-4 text-sm font-medium text-text-primary ${
              tab.title == activeTab
                ? "border-primary bg-[#EAEDF5]"
                : "border-[#DEDEDE]"
            }`}
          >
            {tab.title}
          </button>
        ))}
        <div className="flex-[1_0_0] border-b-2 border-[#DEDEDE]"></div>
      </motion.div>
      <div className="w-full">
        {activeTab == "User Type" ? (
          <TypeSetting profile={profile} />
        ) : activeTab == "Organization Settings" ||
          activeTab == "Individual Settings" ? (
          <Settings profile={profile} />
        ) : (
          <Payment />
        )}
      </div>
    </div>
  );
};

export default SettingsComponent;
