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
          pickerClasses,
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

      const ToolbarMenu = (
        <>
          <div>
           <div className={styles.desktopMenu}>
            {/* <ClosableMenuIconButton
              Icon={TxHistoryIcon}
              opened={txHistoryOpened}
              className={styles.desktopTxHistory}
              onClick={handleTxHistoryToggle}
              title="Transaction History"
            /> */}
            {Object.keys(getMultiwalletConfig(network).chains).map((chain) => {

                const result = wallets.enabledChains[chain]?.provider && wallets.enabledChains[chain]?.account
                const walle = wallets.enabledChains[chain]
                return (
                <React.Fragment key={wallet}>
            <WalletConnectionStatusButton
               
              onClick={() => handleWalletButtonClick(chain as Chain)}
              hoisted={false}
              status={walle?.status ? walle?.status : "Disconnected"}
              account={walle?.account ? walle?.account : ""}
              wallet={wallet}
              chain={chain as Chain}
            /></React.Fragment>)})}
            <WalletPickerModal open={pickerOpened} options={walletPickerOptions} />
          </div>
          <div className={styles.mobileMenu}>
            <IconButton
              aria-label="show more"
              aria-controls="main-menu-mobile"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              {/* <MenuIcon /> */}
            </IconButton>
          </div>
            {children}
        </div>
        </>
      );

      const WalletMenu = (
        <>
            <Menu
            id="wallet-menu"
            getContentAnchorEl={null}
            anchorEl={walletMenuAnchor}
            keepMounted
            open={Boolean(walletMenuAnchor)}
            onClose={handleWalletMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
            <MenuItem onClick={handleDisconnectWallet}>
                <Typography color="error">{"Disconnect"}</Typography>
            </MenuItem>
            {wallet === Wallet.Phantom && (
                <MenuItem onClick={handleRefreshAccounts}>
                <Typography>Refresh accounts</Typography>
                </MenuItem>
            )}
            </Menu>
        </>
      );
    return (
        <>
        {openWalletModal && <WalletConnectModal/>}
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