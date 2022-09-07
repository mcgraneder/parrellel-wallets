import React, { useEffect, useCallback } from "react";
import Modal from "./Modal";
import Card from "./Card";
import DottedButton from "./DottedButton";
import ContentWrapper from "./ContentWrapper";
import PrimaryButton from "../Buttons/PrimaryButton";
import { RenNetwork } from "@renproject/utils/types";
import { ConnectorConfig } from '@renproject/multiwallet-ui';
import { HTMLAttributes } from "react";
import { useMultiwallet } from "@renproject/multiwallet-ui";
import { ConnectorInterface } from '@renproject/multiwallet-base-connector';
import { Tab } from "@headlessui/react";
import { on } from "events";
import { useSessionStorage } from "react-use";
import { getMultiwalletConfig } from '../../providers/multiwallet/multiwalletConfig';
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { setChain } from "../ui/wallet/walletSlice";
import { Chain } from "@renproject/chains";
import ConnectingModal from "./ConnectingModal";
import UnsupportedNetworkModal from "./UnsupportedNetworkModal";
import { ReactComponent as  ExitIcon } from "../../assets/exitIcon.svg"
import { Wallet, getWalletConfig } from '../../providers/multiwallet/walletsConfig';
// @ts-ignore
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import EventEmitter from "eventemitter3";

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  connect: () => any;
  disconnect: () => any;
}

export async function sendMoney(
  destPubkeyStr: string,
  lamports: number = 500 * 1000000,
  provider: any
) {
  try {
    console.log("starting sendMoney");
    const destPubkey = new PublicKey(destPubkeyStr);
    const walletAccountInfo = await provider?.connection.getAccountInfo(
      provider?.wallet?._publicKey
    );
    console.log("wallet data size", walletAccountInfo?.data.length);

    const receiverAccountInfo = await provider?.connection.getAccountInfo(destPubkey);
    console.log("receiver data size", receiverAccountInfo?.data.length);

    const instruction = SystemProgram.transfer({
      fromPubkey: provider?.wallet?._publicKey,
      toPubkey: destPubkey,
      lamports, // about half a SOL
    });
    let trans = await setWalletTransaction(instruction, provider);

    let signature = await signAndSendTransaction(provider?.wallet, trans, provider);
    let result = await provider?.connection.confirmTransaction(signature, "singleGossip");
    console.log("money sent", result);
  } catch (e) {
    console.warn("Failed", e);
  }
}

export async function setWalletTransaction(
  instruction: TransactionInstruction,
  provider: any
): Promise<Transaction> {
  const transaction = new Transaction();
  transaction.add(instruction);
  transaction.feePayer = provider?.wallet!.publicKey!;
  let hash = await provider?.connection.getRecentBlockhash();
  console.log("blockhash", hash);
  transaction.recentBlockhash = hash.blockhash;
  return transaction;
}

export async function signAndSendTransaction(
  wallet: WalletAdapter,
  transaction: Transaction,
  provider: any
): Promise<string> {
  let signedTrans = await wallet.signTransaction(transaction);
  console.log("sign transaction");
  let signature = await provider?.connection.sendRawTransaction(signedTrans.serialize());
  console.log("send raw transaction");
  return signature;
}
export interface WalletPickerConfig<P, A> {
  chains: { [key in string]: Array<ConnectorConfig<P, A>> };
  debug?: boolean;
}
interface TabInfo {
  title: string;
}
  
export interface WalletPickerProps<P, A>
extends HTMLAttributes<HTMLDivElement> {
/**
 * Which chain to show wallets for
 */
chain: string;
Icon?: any;
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
connected?: boolean | undefined;
/*
   Whether a wallet is connected to the wrong chain
 */
wrongNetwork?: boolean;
/**
   Network the wallet should connect to
 */
targetNetwork: any;

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


interface WalletOptionsProps {
  connect: (provider: any) => void;
  active: boolean;
  provider: any;
}

interface WalletEntryProps<P, A> extends ConnectorConfig<P, A> {
  chain: string;
  classes?: any;
  onClose: () => void;
  onPrev: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setInfo: (i: any) => void;
  setName: (i: string) => void;
  WalletEntryButton?: WalletPickerProps<P, A>["WalletEntryButton"];
  connected: boolean | undefined;
  Icon: any;
}


const WalletEntry = <P, A>({
  name,
  chain,
  logo,
  connector,
  info: Info,
  classes,
  onClose,
  onPrev,
  setInfo,
  setName,
  WalletEntryButton,
  connected,
  Icon: aa
}: WalletEntryProps<P, A>): JSX.Element => {
  console.log("hey")

  console.log(connector)
  const providerEthereum = localStorage.getItem("providerEthereum")
  const providerSolana = localStorage.getItem("providerSolana")

  const { activateConnector } = useMultiwallet<P, A>();
  
    const buildInfo = useCallback(
      (InfoConstructor: any) => {
        return setInfo(() => (
          <InfoConstructor
            onClose={onClose}
            onPrev={onPrev}
            name={name}
            acknowledge={() => {
              setInfo(undefined);
              activateConnector(chain, connector, name);
            }}
          />
        ));
      },
      [setInfo, activateConnector, onClose, chain, connector]
    );
  
    const onClick = useCallback(() => {
      // if (connected) return
      activateConnector(chain, connector, name);
      chain === Chain.Ethereum ? 
        localStorage.setItem("providerEthereum", name) :
        localStorage.setItem("providerSolana", name)
      
    }, [activateConnector, buildInfo, Info, chain, connector]);

    const walletConfig = getWalletConfig(name as Wallet);
  const { Icon } = walletConfig;
  return (
    <div
    onClick={onClick}
    className='flex items-center justify-between px-4 py-3 mx-2 mb-2 ml-1 mr-1 sm:flex-row rounded-xl bg-black-800 hover:cursor-pointer hover:bg-black-700'>
    <div className='flex items-center self-start sm:self-auto'>
      <div className='flex items-center justify-center p-2 mr-4 rounded-full pointer-events-none select-none bg-black-900'>
        <Icon width={"40px"}/>
      </div>
      <div className='float-right text-lg font-semibold tracking-wide has-tooltip sm:self-auto '>
        <p>{name}</p>
      </div>
    </div>
    {chain === Chain.Ethereum ? (
      connected && (providerEthereum === name) &&(
      <span className=''>
        <div className='w-4 h-4 rounded-full bg-primary'></div>
      </span>
      )) : (
        connected && (providerSolana === name) && (
          <span className=''>
            <div className='w-4 h-4 rounded-full bg-primary'></div>
          </span>
      )
        )}
  </div>
  )
}

const WalletOption = <P, A>({ 
  chain,
  config,
  onClose,
  connected,
  connecting,
  wrongNetwork,
  targetNetwork,
  DefaultInfo,
  ConnectingInfo,
  WrongNetworkInfo,
  WalletEntryButton,
  WalletChainLabel,
  children,
  Icon
 }:  WalletPickerProps<P, A>) => {

    const connectors = config.chains[chain];
    console.log(connectors)
  
    // Current wallet being activated
    const [name, setName] = React.useState("");
    const [info, setInfo] = React.useState(undefined)

  return (
    <>
      {connectors.map((x) => {
        return (
          <div key={x.name}>
          <WalletEntry
          key={x.name}
            {...x}
            onClose={onClose}
            onPrev={() => setInfo(undefined)}
            chain={chain}
            setInfo={setInfo}
            setName={setName}
            WalletEntryButton={WalletEntryButton}
            connected={connected}
            Icon={Icon}
          />
          </div>
        );
      })}
    </>
  );
};



const StyledTab = ({ title }: { title: React.ReactNode }) => {
  return (
    <Tab
      className={({ selected }: { selected: boolean }) =>
        `  rounded-[14px] py-3 px-2 flex justify-center sm:px-3 md:px-6 lg:px-6  font-semibold ${
          selected && "bg-black-800"
        }`
      }>
      {({ selected }: { selected: boolean }) => (
        <div
          className={`${
            selected && "text-primary"
          } justify-self-center flex items-center `}>
          {title}
        </div>
      )}
    </Tab>
  );
};

export interface WalletPickerModalProps<P, A> {
  /**
   See the props for the WalletPicker component
   */
  options: WalletPickerProps<P, A>;
  /**
   * Whether to show the modal
   */
  network: RenNetwork;
  setChain: (chain: any) => void;
  toggleWalletModal: () => void;
  open?: boolean;
  wallet: Wallet;
  setAddress: any;
  setBalance: any;
  setSolBal: any;
  setSolAddress: any;
  
}

export const WalletConnectModal = <P, A>({
  open,
  options,
  network,
  setChain,
  toggleWalletModal,
  wallet,
  setAddress,
  setBalance,
  setSolBal,
  setSolAddress

}: WalletPickerModalProps<P, A>): JSX.Element => {
  const { enabledChains, targetNetwork, setTargetNetwork } = useMultiwallet<
    P,
    A
  >();

     
 
  const { Icon } = getWalletConfig(wallet as Wallet)
  const disconnected = enabledChains[options.chain]?.status === "disconnected";
  const connecting = enabledChains[options.chain]?.status === "connecting";
  const connected = enabledChains[options.chain]?.status === "connected";
  const wrongNetwork = enabledChains[options.chain]?.status === "wrong_network";
  const provider = enabledChains[options.chain]?.provider as any

  console.log(provider)

  options.chain === Chain.Ethereum && connected && provider.request({method: 'eth_getBalance', params: ["0x21ae148964de03aB4391e21482D96E259784FA85", 'latest']})
  .then((balance: any) => {
    const formattedBalance = Number(parseInt(balance.toString(), 16) / 10 ** 18).toPrecision(5)
    setBalance(formattedBalance)
    setAddress(enabledChains[options.chain]?.account)

  }) as any

 

  const str = (provider?.wallet?._publicKey)?.toString() as string
  options.chain === Chain.Solana && connected && provider?.connection?._rpcRequest("getBalance", ["7GvWfBUDKjD6EuZerM7nj5b3d3ZFV1uDHhMv4oZfZvy8"]).then((b: any) => {
    setSolBal(b?.result?.value)
    setSolAddress(enabledChains[options.chain]?.account)
    console.log(b?.result?.value)
})

// provider?.connection?.getBalance(provider?.wallet?._publicKey)
 
  const deactivateConnector = useCallback(() => {
    enabledChains[options.chain]?.connector.deactivate();
    options.chain === Chain.Ethereum ? 
        localStorage.removeItem("providerEthereum") :
        localStorage.removeItem("providerSolana")
  }, [enabledChains, options.chain]);

  useEffect(() => {
    if (connected) {
      options.onClose();
      console.log("connected")
    }
  }, [connected, options, wrongNetwork, disconnected]);

  useEffect(() => {
    if (options.targetNetwork !== targetNetwork) {
      switch (options.targetNetwork) {
        case "testnet":
          setTargetNetwork(RenNetwork.Testnet);
          break;
        case "mainnet":
          setTargetNetwork(RenNetwork.Mainnet);
          break;
        default:
          setTargetNetwork(options.targetNetwork);
      }
    }
  }, [options.targetNetwork, targetNetwork, setTargetNetwork]);
  
  const cancel = useCallback(async () => {
    if (connecting || wrongNetwork) {
      try {
        await enabledChains[options.chain]?.connector.deactivate();
        options.chain === Chain.Ethereum ? 
        localStorage.removeItem("providerEthereum") :
        localStorage.removeItem("providerSolana")
      } catch (err) {
        console.error(err);
      }
    }
    options.onClose();
  }, [connecting, wrongNetwork, enabledChains, options]); 
   // List of tabs along with icons
   const tabs = Object.keys(getMultiwalletConfig(network).chains)

   const _onTabChange = (index: number) => {
    setTabIndex(index);
   }

  const [tabIndex, setTabIndex] = useSessionStorage("txTabIndex", 0); 

  const rightLabelDisplay = connected ? `connected` : "";
  return (
    <>
    { (connecting && (
      <>
      <ConnectingModal close={cancel} open={!connected}/>
      </>
    )) ||
    (wrongNetwork && (
      <UnsupportedNetworkModal close={toggleWalletModal} chain={options.chain as Chain} targetNetwork={network}/>
    )) ||
       (<Modal open onClose={toggleWalletModal}>
          <div>
            <Card
              responsiveOverride='bg-black-800 w-[470px]'
              onExitIconClick={toggleWalletModal}
              ExitIcon={ExitIcon}>
              <Card.Title>{"Connect Wallet"}</Card.Title>
              {/* <Card.Description>{"Connect to Catalog"}</Card.Description> */}
              <hr className='my-1 sm:my-1 border-black-800' />
              <div className='w-full mb-6 text-black-600'>
                <div className='text-base text-grey-500'>{"By Connecting, you agree to Catalogs’ Terms of Service and acknowledge that you have read and understand the Catalog Protocol Disclaimer."}</div>
              </div>
                <div className=' bg-black-800 rounded-32px'>
                  <Tab.Group defaultIndex={tabIndex} onChange={_onTabChange}>
                    <Tab.List
                      className={`bg-black-900  flex sm:flex-row flex-col  items-center justify-between rounded-[22px] p-2`}>
                      {tabs.map((tab) => {
                        return (
                          <div key={tab} onClick={() =>  setChain(tab as Chain)}>
                            <StyledTab title={tab} />
                          </div>
                        );
                      })}
                    </Tab.List>
                    <Tab.Panels className={`mt-6 px-2 `}></Tab.Panels>                    
                  </Tab.Group>
                </div>
              <ContentWrapper
                overrideSmallScreenStyle
                label={"Available Wallets"}
                rightLabel={rightLabelDisplay}
                rightLabelClassName='text-primary'>
                <div className='flex flex-col gap-1'>
                <WalletOption
                  key={1}
                    {...options}
                    onClose={cancel}
                    connecting={connecting}
                    wrongNetwork={wrongNetwork}
                    connected={connected}
                    Icon={Icon}
                  />
                        </div>
              </ContentWrapper>
              <div className='flex items-center justify-center mt-6'>
                {connected && (
                  <PrimaryButton onClick={deactivateConnector} className='bg-[#1F3F38] px-12'>
                    {"disconnect"}
                  </PrimaryButton>
                )}
              </div>
              <button onClick={() => sendMoney("6UfaqMExdYZ3xzLLQJXVNcMpn3gwrSCdFpV94XsoKm9k", 1, provider)}>send</button>
            </Card>
          </div>
        </Modal>)}
    </>
  );
              }

export default React.memo(WalletConnectModal);

// {connectors.map((x) => (
//   <WalletEntry
//     key={x.name}
//     {...x}
//     classes={walletClasses}
//     onClose={onClose}
//     onPrev={() => setInfo(undefined)}
//     chain={chain}
//     setInfo={setInfo}
//     setName={setName}
//     WalletEntryButton={WalletEntryButton}
//   />
// ))}