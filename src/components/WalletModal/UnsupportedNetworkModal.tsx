import React from "react";
import Modal from "./Modal";
import PrimaryButton from "../Buttons/PrimaryButton";

interface UnsupportedNetworkModalProps {
  close: () => void;
//   loginFromUnsupportedChain: () => void;
}
function UnsupportedNetworkModal({
  close,
//   loginFromUnsupportedChain,
}: UnsupportedNetworkModalProps) {
 
  const switchNetwork = () => {
    close();
    setTimeout(() => {
    //   loginFromUnsupportedChain();
    }, 1200);
  };
  return (
    <>
        <Modal open onClose={() => null}>
          <div className='md:w-[475px] w-[475px] pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
            <div className='flex justify-end items-center w-full h-[30px]'>
              {/* <ExitIcon className='hover:cursor-pointer' onClick={close} /> */}
            </div>
            <div className='flex flex-col items-center justify-center w-full gap-6'>
              <div className='text-2xl font-semibold '>{"Unsupported network"}</div>
              {/* <AlertTriangle /> */}
              <div className='text-[15px] text-center px-6 text-grey-400'>
                {"notifications.unsupportedChainMsg"}
              </div>
            </div>
            <div className='px-20 py-6'>
              <PrimaryButton className='justify-center w-full text-lg' onClick={switchNetwork}>
                {"buttons.SwitchNet"}
              </PrimaryButton>
            </div>
            <div
              onClick={close}
              className='flex items-center text-[15px] justify-center text-grey-400 hover:text-white hover: cursor-pointer'>
              {"close"}
            </div>
          </div>
        </Modal>
    </>
  );
}

export default UnsupportedNetworkModal;
