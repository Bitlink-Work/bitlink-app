interface IProps {
  title: string;
  small?: boolean
}
const SessionTitle = ({
  title, small
}: IProps) => {
  return (
    <div className="flex gap-[8px] font-poppins">
      <div className="flex items-center gap-4">
        <div className={`${small ? 'text-sm' : 'text-[24px] leading-[36px]'} font-semibold text-text-primary`}>
          {title}
        </div>
      </div>
    </div>
  );
};

export default SessionTitle;
