type Props = {
  children: React.ReactNode;
  showPopup: boolean;
  onClose?: () => void;
};

const Popup = ({ children, showPopup, onClose }: Props) => {
  const handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onClose && onClose();
  };
  return (
    <div
      onClick={handleClose}
      className={`absolute inset-0 z-50 h-full w-full items-start justify-center bg-[rgba(13,14,15,0.60)] backdrop-blur-[3px] ${
        showPopup ? "flex" : "hidden"
      }`}
    >
      <div className="flex h-screen w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Popup;
