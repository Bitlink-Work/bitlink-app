import { getPartner } from "@/public/actions/invoice.action";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  setReceiver: (receiver: any) => void;
  setShowAddClient: (show: boolean) => void;
  setStep: (value: number) => void;
  setType: (value: string) => void;
};

const Receiver = ({
  setReceiver,
  setShowAddClient,
  setStep,
  setType,
}: Props) => {
  const [currentCurrency, setCurrentCurrency] = useState<any>();
  const [isSidePopupVisible, setIsSidePopupVisible] = useState(false);
  const toggleSidePopup = () => {
    setIsSidePopupVisible(!isSidePopupVisible);
  };
  const listPartners = useAppSelector(selectListPartners);
  const dispatch = useAppDispatch();

  const fetchListPartner = useCallback(async () => {
    dispatch(getPartner({}));
  }, [dispatch]);

  useEffect(() => {
    fetchListPartner();
  }, [fetchListPartner]);

  const [filterListPartners, setFilterListPartners] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchValue === "") {
      setFilterListPartners(listPartners);
    } else {
      setIsSidePopupVisible(true);
      setFilterListPartners(
        listPartners.filter(
          (partner: any) =>
            partner?.partner_email
              .toLowerCase()
              .includes(searchValue.toLowerCase()),
        ),
      );
    }
  }, [searchValue, listPartners]);

  return (
    <div className="flex w-full flex-col items-start gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <h5 className="flex flex-row items-center gap-[6px] text-sm font-semibold leading-[150%] text-text-primary">
        Billed to
      </h5>
      <div className="relative flex h-fit w-[320px] cursor-pointer flex-row items-center justify-start gap-[10px] rounded border border-[#DEDEDE] bg-[#fff] p-4">
        <input
          className="h-6 w-full text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-text-secondary focus:outline-none active:outline-none"
          type="text"
          placeholder="Find or add new client"
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={(e) => e.stopPropagation()}
        />
        <button onClick={() => toggleSidePopup()}>
          <Image
            src="/images/invoices/arrow-down.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>
        {isSidePopupVisible && (
          <div className="absolute right-0 top-[100%] z-20 w-[320px] flex-col items-start rounded-b-[4px] border border-[#EBEFF6] bg-[#fff] p-3 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
            <div className="mb-3 flex w-full flex-row items-center gap-[10px] rounded  bg-[#e9e9e9] p-3">
              <Image
                src="/images/invoices/search.svg"
                width={24}
                height={24}
                alt=""
              />
              <input
                className="flex-1 bg-transparent text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-[#98999A] hover:outline-none focus:outline-none active:outline-none"
                type="text"
                placeholder="Type a client"
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
              />
            </div>
            <button
              onClick={() => {
                toggleSidePopup();
                setShowAddClient && setShowAddClient(true);
                setType && setType("add");
              }}
              className="leading-[150%} my-3 flex w-full flex-row items-center gap-[10px] rounded bg-[#fff] p-3 text-sm font-normal text-[#1890FF]"
            >
              <Image
                src="/images/invoices/plus.svg"
                width={24}
                height={24}
                alt=""
              />
              <span>Add a new client</span>
            </button>
            <div className="flex w-full flex-col items-start gap-5">
              <h5 className="text-sm font-medium leading-[150%] text-text-primary">
                Your existing clients
              </h5>
              {filterListPartners?.length === 0 && searchValue !== "" ? (
                <p className="text-sm font-normal leading-[150%] text-text-secondary">
                  No results found
                </p>
              ) : (
                <ul className="flex max-h-[300px] w-full flex-col items-start gap-1 overflow-y-auto text-sm font-normal leading-[150%] text-text-primary">
                  {filterListPartners?.map((partner: any, index: any) => (
                    <li
                      onClick={() => {
                        setReceiver(partner);
                      }}
                      key={index}
                      className="w-full cursor-pointer p-3"
                    >
                      {partner?.partner_email !== ""
                        ? partner?.partner_email
                        : partner?.partner_first_name +
                          " " +
                          partner?.partner_last_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receiver;
