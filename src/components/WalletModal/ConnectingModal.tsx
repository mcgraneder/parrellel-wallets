import React from "react";
import Modal from "./Modal";
import { useMultiwallet } from '@renproject/multiwallet-ui';
import { useSelector } from 'react-redux';
import { $wallet } from "../ui/wallet/walletSlice";
import { ReactComponent as  ExitIcon } from "../../assets/exitIcon.svg"
import { ReactComponent as  SpinnerDots } from "../../assets/icons/spinnerDots.svg"
import { ReactComponent as CheckCircle } from "../../assets/icons/checkCircle.svg"

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
          <SpinnerDots />
        </div>
      ) : (
        <CheckCircle color={"#2CC995"} />
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
              <ExitIcon className='hover:cursor-pointer' onClick={close} />
            </div>
            <div className='flex flex-col w-full h-[150px] items-center justify-center gap-5 mb-4'>
              <GetIcon active={active} />
              <div className='text-2xl font-semibold '>{connectedText}</div>
            </div>
            <div className='w-full text-center rounded-2xl px-6 py-4'>
              <div className='text-[15px] text-grey-400'>{"By Connecting, you agree to Catalogs’ Terms of Service and acknowledge that you have read and understand the Catalog Protocol Disclaimer."}</div>
            </div>
          </div>
        </Modal>
    </>
  );
}

export default ConnectingModal;
