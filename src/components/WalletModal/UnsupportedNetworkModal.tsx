import React, { useState, useCallback} from "react";
import Modal from "./Modal";
import PrimaryButton from "../Buttons/PrimaryButton";
import { ReactComponent as  ExitIcon } from "../../assets/exitIcon.svg"
import { ReactComponent as  AlertTriangle } from "../../assets/icons/alertTriangle.svg"
import { useWallet, SwitchNetwork } from '../ui/wallet/walletHooks';
import { Chain } from '@renproject/chains';
import { RenNetwork } from '@renproject/utils/types';
import { injected, getMultiwalletConfig } from '../../providers/multiwallet/multiwalletConfig';
import { useMultiwallet } from '@renproject/multiwallet-ui';

interface UnsupportedNetworkModalProps {
  chain: Chain;
  close: () => void;
  targetNetwork: RenNetwork
}
function UnsupportedNetworkModal({
  chain,
  close,
  targetNetwork
}: UnsupportedNetworkModalProps) {

  const { provider } = useWallet(chain as Chain);
  const { activateConnector } = useMultiwallet()
  console.log(provider, chain, targetNetwork)

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<any>(false);

  const onClick = async() => {
    const addOrSwitchChain = await SwitchNetwork(
      chain as Chain,
      targetNetwork as RenNetwork )
      if (addOrSwitchChain?.switched) {
        activateConnector(
          chain, 
          getMultiwalletConfig(targetNetwork).chains[chain][0].connector, 
          "Metamask"
        )
        }
    chain === Chain.Ethereum ? 
        localStorage.setItem("providerEthereum", "Metamask") :
        localStorage.setItem("providerSolana", "Phantom")
  }
  console.log(chain, targetNetwork)
  // const [success, setSuccess] = useState(false);

  // const handleSwitch = useCallback(() => {
  //   console.log(addOrSwitchChain)
  //   if (addOrSwitchChain !== null) {
  //     setError(false);
  //     setPending(true);
  //     addOrSwitchChain()
  //       .then(() => {
  //         setError(false);
  //         setSuccess(true);
  //       })
  //       .catch((error: any) => {
  //         setError(error);
  //       })
  //       .finally(() => {
  //         setPending(false);
  //       });
  //   }
  // }, [addOrSwitchChain]);
 
  return (
    <>
        <Modal open onClose={() => null}>
          <div className='md:w-[475px] w-[475px] pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
            <div className='flex justify-end items-center w-full h-[30px]'>
              <ExitIcon className='hover:cursor-pointer' onClick={close} />
            </div>
            <div className='flex flex-col items-center justify-center w-full gap-6'>
              <div className='text-2xl font-semibold '>{"Unsupported network"}</div>
              <AlertTriangle width={"75px"} />
              <div className='text-[16px] text-center px-6 text-grey-400'>
                {"You are using catalog on an unsupported network. please switch to a supported chain"}
              </div>
            </div>
            <div className='px-20 py-6'>
              <PrimaryButton className='justify-center w-full text-lg bg-primary' onClick={onClick}>
                {"Switch Network"}
              </PrimaryButton>
            </div>
            <div
              onClick={close}
              className='flex items-center text-[15px] justify-center font-semibold text-grey-400 hover:text-white hover: cursor-pointer'>
              {"Close"}
            </div>
          </div>
        </Modal>
    </>
  );
}

export default UnsupportedNetworkModal;
