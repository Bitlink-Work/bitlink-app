import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  children: React.ReactNode;
  hidePopup: boolean;
  setHidePopup: any;
  className?: string;
  setInvoiceIdSelected: any;
};

const CustomPopup = ({
  children,
  hidePopup,
  setHidePopup,
  className,
  setInvoiceIdSelected,
}: Props) => {
  const closeModal = () => {
    setHidePopup(true);
    setInvoiceIdSelected(null);
  };

  return (
    // <div
    //   className={`backdrop-blur-[3px] fixed inset-0 z-50 min-h-full w-full items-center justify-center bg-[rgba(13,14,15,0.60)] ${
    //     hidePopup ? "hidden" : "flex"
    //   } `}
    //   onClick={() => setHidePopup(true)}
    // >
    //   {children}
    // </div>
    <>
      <Transition appear show={!hidePopup} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-scroll ">
            <div className="flex min-h-full items-center justify-center p-8 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={className}>{children}</Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CustomPopup;
