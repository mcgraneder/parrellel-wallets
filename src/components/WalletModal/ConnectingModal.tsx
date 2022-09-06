import React from "react";
import Modal from "./Modal";
import { useMultiwallet } from '../../contexts/MultiwalletProvider';
import { useSelector } from 'react-redux';
import { $wallet } from "../ui/wallet/walletSlice";

interface ConnectingModalProps {
  close: () => void;
  open: boolean;
}
interface IconProps {
  active: boolean;
}
const GetIcon = ({ active }: IconProps) => {
  return (
    <>
      {!active ? (
        <div className='animate-spin mt-2'>
          {/* <SpinnerDots size={20} /> */}
        </div>
      ) : (
        <span></span>
        // <UilCheckCircle color={"#2CC995"} size={"55px"} />
      )}
    </>
  );
};

function ConnectingModal({ close, open }: ConnectingModalProps) {

  const { enabledChains } = useMultiwallet()
 const { chain } = useSelector($wallet)
  const active = enabledChains[chain]?.status === "connected";
  const connectedText = active ? "connected" : "connecting";

  return (
    <>
        <Modal open onClose={close}>
          <div className='md:w-[460px] w-[460px] pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
            <div className='flex justify-end items-center w-full h-[30px]'>
              {/* <ExitIcon className='hover:cursor-pointer' onClick={close} /> */}
            </div>
            <div className='flex flex-col w-full h-[150px] items-center justify-center gap-5 mb-4'>
              {/* <GetIcon active={active} /> */}
              <div className='text-2xl font-semibold '>{connectedText}</div>
            </div>
            <div className='w-full text-center rounded-2xl px-6 py-4'>
              <div className='text-sm text-grey-400'>{"protocolDisclaimer"}</div>
            </div>
          </div>
        </Modal>
    </>
  );
}

export default ConnectingModal;
