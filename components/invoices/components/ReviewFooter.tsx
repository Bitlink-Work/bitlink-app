type Props = {};

const ReviewFooter = ({ props, step9Data }: any) => {
  const data = localStorage?.getItem("dataChain");
  const dataChain = data && JSON.parse(data);
  return (
    <div className="flex w-full flex-col gap-6 pt-[30px]">
      <div className="h-[1px] w-full bg-[rgba(0,0,0,0.12)]"></div>
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col items-start justify-start gap-[6px] text-sm font-normal leading-[21px] text-text-primary">
          <p className="font-semibold text-[#1890FF]">Note</p>
          <p>Thank you for the business!</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-6 text-sm font-medium leading-[21px] text-[#5E6470]">
          <a href="bitlink.work">bitlink.work</a>
          <div className="h-[18px] w-[0.75px] bg-[rgba(0,0,0,0.12)]"></div>
          <a href="mailto:support@bitlink.work">support@bitlink.work</a>
        </div>
      </div>
      {/* <div className="flex flex-row items-center justify-between">
      </div> */}
    </div>
  );
};

export default ReviewFooter;
