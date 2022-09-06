import React, { useEffect, useMemo, useCallback, useState} from "react";
import { useWalletPickerStyles } from '../components/ui/wallet/components/WalletHelpers';
// import { useSetNetworkFromParam } from '../network/networkHooks';
import { useSyncWalletNetwork } from '../components/ui/wallet/walletHooks';
import { useSelector, useDispatch } from "react-redux";
import { $network } from "../network/networkSlice";
import { $wallet, setPickerOpened } from "../components/ui/wallet/walletSlice";
import { useWallet } from "../components/ui/wallet/walletHooks";
import { WalletPickerProps, useMultiwallet } from "../contexts";
import { ClosableMenuIconButton } from "../components/Buttons/Buttons";
import { WalletConnectionStatusButton } from "../components/ui/wallet/components/WalletHelpers";
import { WalletPicker, WalletPickerHeader, WalletPickerModal } from "../contexts";
import { IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
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
import { Wallet } from "../providers/multiwallet/walletsConfig";
import { MobileLayout } from "../components/Layout/MobileLayout";
import Modal from "../components/WalletModal/Modal";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import WalletConnectModal from "../components/WalletModal/WalletConnectionModal";

export type MainLayoutVariantProps = {
    withBackground?: boolean;
  };

  
const MainLayout:  FunctionComponent<any> = ({
    children,
  }) => {
    const dispatch = useDispatch();
    const styles = useMobileLayoutStyles()
    const pickerClasses = useWalletPickerStyles()
    // useSetNetworkFromParam()
    useSyncWalletNetwork()
    const wallets = useMultiwallet()
    const { activateConnector } = useMultiwallet()
    // console.log(wallets)
    const { network } = useSelector($network)
    const { chain, pickerOpened } = useSelector($wallet)
    const multiwallet = useWallet(chain);
    (window as any).multiwallet = multiwallet;
    const {
      status,
      account,
      connected,
      deactivateConnector,
      refreshConnector,
      wallet,
    } = multiwallet;

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

    return (
        <>
        {openWalletModal && <WalletConnectModal open={pickerOpened} options={walletPickerOptions} network={network} setChain={handleWalletButtonClick} disconnect={handleDisconnectWallet}/>}
        <div className="flex items-center justify-center h-screen">
          <PrimaryButton onClick={toggleWalletModal}>Select Wallets</PrimaryButton>
        </div>
            
          
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