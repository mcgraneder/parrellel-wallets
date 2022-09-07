import React, { useEffect, useMemo, useCallback, useState} from "react";
import { useWalletPickerStyles } from '../components/ui/wallet/components/WalletHelpers';
// import { useSetNetworkFromParam } from '../network/networkHooks';
import { useSyncWalletNetwork } from '../components/ui/wallet/walletHooks';
import { useSelector, useDispatch } from "react-redux";
import { $network } from "../network/networkSlice";
import { $wallet, setPickerOpened } from "../components/ui/wallet/walletSlice";
import { useWallet } from "../components/ui/wallet/walletHooks";
import { WalletPickerProps, useMultiwallet } from "@renproject/multiwallet-ui";
import { ClosableMenuIconButton } from "../components/Buttons/Buttons";
import { WalletConnectionStatusButton } from "../components/ui/wallet/components/WalletHelpers";
import { WalletPicker, WalletPickerHeader, WalletPickerModal } from "../contexts";
import { IconButton, Menu, MenuItem, TableSortLabel, Typography } from "@material-ui/core";
import { WalletConnectingInfo } from "../components/ui/wallet/components/WalletHelpers";
import { WalletWrongNetworkInfo } from "../components/ui/wallet/components/WalletHelpers";
import { WalletEntryButton } from "../components/ui/wallet/components/WalletHelpers";
import { WalletChainLabel } from "../components/ui/wallet/components/WalletHelpers";
import { getMultiwalletConfig } from "../providers/multiwallet/multiwalletConfig";
import { useMobileLayoutStyles } from '../components/Layout/MobileStyles';
import { TxHistoryIcon } from "../components/icons/RenIcons";
import { FunctionComponent } from 'react';
import { MultiwalletProvider } from "@renproject/multiwallet-ui";
import { Chain } from "@renproject/chains";
import { Dispatch } from "redux";
import { setChain } from "../components/ui/wallet/walletSlice";
import { Wallet, getWalletConfig } from '../providers/multiwallet/walletsConfig';
import { MobileLayout } from "../components/Layout/MobileLayout";
import Modal from "../components/WalletModal/Modal";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import WalletConnectModal from "../components/WalletModal/WalletConnectionModal";
import { createPaddedIcon } from '../components/icons/IconHelpers';
import { ReactComponent as Metamask } from "../assets/metamask.svg";
import PhantomWallet from "../assets/icons/tokens/spaces_-MVOiF6Zqit57q_hxJYp_avatar-1615495356537.png"
import Sidebar from "../components/Sidebar/Sidebar";
import Davatar from '@davatar/react';
import { chainsConfig } from '../utils/chainsConfig';


export type MainLayoutVariantProps = {
    withBackground?: boolean;
  };

  export const trimAddress = (address?: string, chars = 4) => {
    if (!address) {
      return "";
    }
    if (address.length <= 2 * chars) {
      return address;
    }
    const start = address.slice(0, chars);
    const end = address.slice(-chars);
    return `${start}...${end}`;
  };

const MainLayout:  FunctionComponent<any> = ({
    children,
  }: any) => {
    const dispatch = useDispatch();
    const styles = useMobileLayoutStyles()
    const pickerClasses = useWalletPickerStyles()
    // useSetNetworkFromParam()
    useSyncWalletNetwork()
    const wallets = useMultiwallet()
    const { activateConnector, enabledChains } = useMultiwallet()
    // console.log(wallets)
    const { network } = useSelector($network)
    const [address, setAddress] = useState<any>(null)
    const [solAddress, setSolAddress] = useState<any>(null)
    const { pickerOpened, chain } = useSelector($wallet)
    const [balance, setBalance] = useState<any>(null)
    const [solBal, setSolBal] = useState<any>(null)
  
    const multiwallet = useWallet(chain);
    // (window as any).multiwallet = multiwallet;
    const {
      status,
      account,
      connected,
      deactivateConnector,
      refreshConnector,
      wallet,
      provider
    } = multiwallet;
    // (window as any).multiwallet = multiwallet;
  

    const [walletMenuAnchor, setWalletMenuAnchor] = useState<null | HTMLElement>(
        null
      );
    const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
    const toggleWalletModal = () => setOpenWalletModal(!openWalletModal) 

    useEffect(() => {
      const activeEthereumWallets = getMultiwalletConfig(network).chains[Chain.Ethereum]
      const activeSolanaWallets = getMultiwalletConfig(network).chains[Chain.Solana]
      
      activeEthereumWallets.forEach((wallet, index = 0) => {
        if (localStorage.getItem("providerEthereum") === wallet.name) {
          activateConnector(
            chain, 
            getMultiwalletConfig(network).chains[chain][index].connector, 
            wallet.name
          )
          index ++
        }
      })
      //create seperate providers
      activeSolanaWallets.forEach((wallet, index = 0) => {
        if (localStorage.getItem("providerSolana") === wallet.name) {
          activateConnector(
            chain, 
            getMultiwalletConfig(network).chains[chain][index].connector, 
            wallet.name
          )
          index ++
        }
      })
    }, []);

    const provide = enabledChains[chain]?.provider as any
    useEffect(() => {
      console.log("rendering")
    }, [provide])

   console.log(provide)

  //   provide?.connection?._rpcRequest("getBalance", ["7GvWfBUDKjD6EuZerM7nj5b3d3ZFV1uDHhMv4oZfZvy8"]).then((b: any) => {
  //     setSolBal(b)
  //     setSolAddress(enabledChains[chain]?.account)
  //     console.log(b)
  // })
 
   
    const handleWalletPickerClose = useCallback(() => {
        dispatch(setPickerOpened(false));
      }, [dispatch]);
      const handleWalletMenuClose = useCallback(() => {
        setWalletMenuAnchor(null);
      }, []);
    
      const handleWalletButtonClick = useCallback(
        (chain: any) => {
          if (connected) {
            dispatch(setPickerOpened(true));
            dispatch(setChain(chain))
           return
          } else {
            dispatch(setPickerOpened(true));
            dispatch(setChain(chain))
          }
        },
        [dispatch, connected]
      );
    
      const handleDisconnectWallet = useCallback(() => {
        deactivateConnector();
        handleWalletMenuClose();
      }, [deactivateConnector, handleWalletMenuClose]);
    
      const handleRefreshAccounts = useCallback(() => {
        refreshConnector();
        handleWalletMenuClose();
      }, [refreshConnector, handleWalletMenuClose]);

      const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
      const handleMobileMenuClose = useCallback(() => {
        setMobileMenuOpen(false);
      }, []);
      const handleMobileMenuOpen = useCallback(() => {
        setMobileMenuOpen(true);
      }, []);

      const walletPickerOptions = useMemo(() => {
        const options: WalletPickerProps<any, any> = {
          targetNetwork: network,
          chain,
          onClose: handleWalletPickerClose,
          // DefaultInfo: DebugComponentProps,
          ConnectingInfo: WalletConnectingInfo,
          WrongNetworkInfo: WalletWrongNetworkInfo,
          WalletEntryButton,
          WalletChainLabel,
          config: getMultiwalletConfig(network),
          connecting: true,
        };
        return options;
      }, [ pickerClasses, handleWalletPickerClose, network, chain]);

      
      const walletIconSize = 56;
    const walletIcon = (Icon: FunctionComponent) => {
      return createPaddedIcon(Icon, walletIconSize);
    };
      const Sol = getWalletConfig("MetaMask" as Wallet)
      const Eth = getWalletConfig("Phantom" as Wallet)
      // const EthIcon = walletIcon(MetaMaskWallet)
      // const SolIcon  = walletIcon(PhantomWallet)

      const ethTx = async() => {
        await provider.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: address,
              to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
              value: '0x29a2241af62c0000',
              gasPrice: '0x09184e72a000',
              gas: '0x2710',
            },
          ],
        })
      }

    return (
        <>  
          <div>
      {openWalletModal && <WalletConnectModal setSolAddress={setSolAddress} setSolBal={setSolBal} setBalance={setBalance} setAddress={setAddress} wallet={wallet} open={pickerOpened} options={walletPickerOptions} network={network} setChain={handleWalletButtonClick} toggleWalletModal={toggleWalletModal}/>}
      <div className="h-[68px] w-screen py-6 pl-12">
        <PrimaryButton className="font-semibold text-xl h-[55px] flex items-center justify-center pl-6 pr-7 bg-gray-400" onClick={toggleWalletModal}>
          <div className="flex gap-4 items-center justify-center">
          <div className="font-semibold">Open Wallet Modal</div>
          {account && <Davatar
                size={24}
                address={account as string}
                generatedAvatarType="jazzicon"
              />}
        </div>
        </PrimaryButton>
      </div>
       
      </div>
        <div className="h-[80px] w-screen mb-8">
          </div> 
      <div className='max-w-[1450px] h-[750px] mx-auto flex justify-between pt-7'>
          <div className='w-[600px] shadow-xl flex flex-col p-4 my-4 bg-black-800 rounded-3xl hover:scale-105 duration-300'>
              <h2 className='text-3xl text-center py-6 text-grey-400'>Ethereum</h2>
              <div className="flex items-center justify-center mb-6">
                <Metamask width={"100px"} height={"100px"}/>
              </div>
           
              <div className='text-center font-lg'>
                  <p className='py-2 border-b mx-8 mt-8 text-xl text-grey-400 border-grey-600'>{`Account:  ${enabledChains[Chain.Ethereum]?.account && trimAddress(enabledChains[Chain.Ethereum]?.account as string, 6)}`}</p>
                  <p className='py-2 border-b mx-8 text-xl text-grey-400 border-grey-600'>{`Balance: ${enabledChains[Chain.Ethereum]?.provider && enabledChains[Chain.Ethereum]?.provider}`} </p>
                  <p className='py-2 border-b mx-8 text-xl text-grey-400 border-grey-600'></p>
              </div>
          </div>
        
        
          <div className='w-[600px] shadow-xl flex flex-col p-4 my-4 bg-black-800 rounded-3xl hover:scale-105 duration-300'>
              <h2 className='text-2xl text-grey-400 text-center py-8'>Solana</h2>
              <div className="flex items-center justify-center mb-6">
            <img src={PhantomWallet} width={"100px"} height={"100px"}/>
            </div>
         
              <div className='text-center font-medium'>
              <p className='py-2 border-b mx-8 mt-8 text-xl border-grey-600 text-grey-400'>{`Account: ${enabledChains[Chain.Solana]?.account && trimAddress(enabledChains[Chain.Solana]?.account as string, 6)}`}</p>
                  <p className='py-2 border-b border-grey-600 text-grey-400 text-xl mx-8'>{`Balance: ${!solBal ? solBal : "not connected"}`}</p>
                  <p className='py-2 border-b border-grey-600 text-grey-400 text-xl mx-8'></p>
              </div>
              <button className='bg-primary w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>Send Sol</button>
          </div>
      </div>
      <Sidebar/>
    
      </>
  
    )
}

export const ConnectedMainLayout: FunctionComponent = ({ children }: any) => {
    return (
    //   <MultiwalletProvider>
        <MainLayout>{children}</MainLayout>
    //   </MultiwalletProvider>
    );
  };
  
export default MainLayout