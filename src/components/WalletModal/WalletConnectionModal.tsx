import React from "react";
import Modal from "./Modal";
import Card from "./Card";
import DottedButton from "./DottedButton";
import ContentWrapper from "./ContentWrapper";
import PrimaryButton from "../Buttons/PrimaryButton";
import { RenNetwork } from "@renproject/utils/types";
import { ConnectorConfig } from '../../contexts/index';
import { HTMLAttributes } from "react";

export interface WalletPickerConfig<P, A> {
  chains: { [key in string]: Array<ConnectorConfig<P, A>> };
  debug?: boolean;
}

export interface WalletPickerProps<P, A>
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Which chain to show wallets for
   */
  chain: string;
  /**
     Function used to close/cancel the connection request
   */
  onClose: () => void;
  /**
   * Configuration for connectors across all chains
   */
  config: WalletPickerConfig<P, A>;
  /**
     Whether a wallet is in the process of connecting
   */
  connecting?: boolean;
  /**
     Whether a wallet is connected to the wrong chain
   */
  wrongNetwork?: boolean;
  /**
     Network the wallet should connect to
   */
  targetNetwork: RenNetwork | "mainnet" | "testnet";
 
  
  DefaultInfo?: React.FC<{
    name: string;
    acknowledge: () => void;
    onClose: () => void;
  }>;
  /**
     An optional replacement to show when a wallet is connecting
   */
  ConnectingInfo?: React.FC<{
    chain: string;
    name: string;
    onClose: () => void;
  }>;
  /**
     An optional replacement to show when a wallet is connected to the wong network
   */
  WrongNetworkInfo?: React.FC<{
    chain: string;
    targetNetwork: string;
    onClose: () => void;
  }>;

  /**
     An optional replacement for the button shown for each wallet option
   */
  WalletEntryButton?: React.FC<{
    chain: string;
    onClick: () => void;
    name: string;
    logo: string;
  }>;
  /**
   An optional replacement for the label, which groups wallet options by chains
   */
  WalletChainLabel?: React.FC<{
    chain: string;
  }>;
}

function WalletConnectModal() {

  const rightLabelDisplay = "Connected";
  return (
    <>
        <Modal open onClose={() => {}}>
          <div>
            <Card
              responsiveOverride='bg-black-800 w-[470px]'
              onExitIconClick={() => {}}
              ExitIcon={{}}>
              <Card.Title>{"Connect Wallet"}</Card.Title>
              <Card.Description>{"Connect to Catalog"}</Card.Description>
              <div className='mb-12'></div>
              {/* <hr className='my-1 sm:my-1 border-black-800' />
              <div className='w-full mb-6 text-black-600'>
                <div className='text-sm text-grey-500'>{t("protocolDisclaimer")}</div>
              </div> */}
              <ContentWrapper
                overrideSmallScreenStyle
                label={"Available Wallets"}
                rightLabel={rightLabelDisplay}
                rightLabelClassName='text-primary'>
                <div className='flex flex-col gap-1'>
                  {/* {<WalletOption connect={connect} provider={provider} active={active} />} */}
                </div>
              </ContentWrapper>
              <div className='flex items-center justify-center mt-6'>
                {/* {active && (
                  <PrimaryButton onClick={disconnect} className='bg-[#1F3F38] px-12'>
                    {t("buttons.disconnect")}
                  </PrimaryButton>
                )} */}
              </div>
            </Card>
          </div>
        </Modal>
    </>
  );
}

export default WalletConnectModal;
