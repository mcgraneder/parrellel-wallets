import { makeStyles } from "@material-ui/core/styles";
import { WalletPickerProps } from "@renproject/multiwallet-ui";
import { Button } from "@material-ui/core";
import { Wallet } from "../../../../providers/multiwallet/walletsConfig";
import { getWalletConfig } from "../../../../providers/multiwallet/walletsConfig";
import {
  Box,
  Fade,
  Typography,
  useTheme,
} from "@material-ui/core";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { Asset, Chain } from "@renproject/chains";
import { RenNetwork } from "@renproject/utils";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useWallet, SwitchNetwork } from '../walletHooks';
import { WalletStatus } from "../walletUtils";
import { getChainConfig } from "../../../../utils/chainsConfig";
import { getChainNetworkConfig } from "../../../../utils/chainsConfig";
import { useSwitchChainHelpers } from "../walletHooks";
import { ButtonProps, FormHelperText } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setPickerOpened } from "../walletSlice";
import { useEns } from "../walletHooks";
import { Theme, styled } from "@material-ui/core/styles";
import { trimAddress } from '../../../../utils/string';
import classNames from "classnames";
import { defaultShadow } from "../../../theme/other";
import { PaperContent } from "../../../Layout/Paper";
import { ProgressWithContent } from "../../../progress/ProgressHelper";
import { ProgressWrapper } from "../../../progress/ProgressHelper";
import { useTimeout } from 'react-use';
import { BridgeModalTitle } from "../../../modals/BridgeModal";
import { WalletIcon } from "../../../icons/RenIcons";
import { ActionButtonWrapper, ActionButton  } from "../../../Buttons/Buttons";

import { createPulseAnimation } from "../../../theme/animationStyles";
import { isEthereumBaseChain } from "../../../../utils/chainsConfig";
import Davatar from '@davatar/react';

export const useWalletPickerStyles = makeStyles((theme) => ({
  root: {
    width: 400,
    minHeight: 441,
  },
  body: {
    padding: 24,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: `16px 16px 14px`,
  },
  headerTitle: {
    flexGrow: 2,
    paddingLeft: 16,
    textAlign: "center",
    lineHeight: 2,
  },
  headerCloseIcon: {
    fontSize: 16,
  },
  button: {
    border: `1px solid ${theme.palette.divider}`,
  },
  chainTitle: {
    textTransform: "capitalize",
    fontSize: 14,
  },
}));

const useWalletEntryButtonStyles = makeStyles({
  root: {
    marginTop: 20,
    fontSize: 16,
    padding: "11px 20px 11px 20px",
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
  },
  icon: {
    fontSize: 36,
    display: "inline-flex",
  },
});

export const WalletEntryButton: WalletPickerProps<
  any,
  any
>["WalletEntryButton"] = ({ onClick, name, logo }) => {
  const { icon: iconClassName, ...classes } = useWalletEntryButtonStyles();
  const walletConfig = getWalletConfig(name as Wallet);
  const { Icon } = walletConfig;
  return (
    <Button
      classes={classes}
      variant="outlined"
      size="large"
      fullWidth
      onClick={onClick}
    >
      <span>{walletConfig.fullName}</span>{" "}
      <span className={iconClassName}>
        <Icon fontSize="inherit" />
      </span>
    </Button>
  );
};

export const WalletChainLabel: WalletPickerProps<
  any,
  any
>["WalletChainLabel"] = ({ chain }) => {
  const chainConfig = getChainConfig(chain as Chain);
  return <span>{chainConfig.fullName}</span>;
};

export const WalletConnectingInfo: WalletPickerProps<
  any,
  any
>["ConnectingInfo"] = ({ chain, name, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const chainConfig = getChainConfig(chain as Chain);

  const walletConfig = getWalletConfig(name as Wallet);

  const { Icon } = walletConfig;
  const [isPassed] = useTimeout(30000);
  const passed = isPassed();
  return (
    <>
      <BridgeModalTitle
        title={
          passed
            ? t("wallet.action-required", {
              wallet: walletConfig.shortName,
            })
            : t("wallet.action-connecting")
        }
        onClose={onClose}
      />
      <PaperContent bottomPadding>
        <ProgressWrapper>
          <ProgressWithContent
            size={128}
            color={"blue"}
            fontSize="big"
            processing
          >
            <Icon fontSize="inherit" />
          </ProgressWithContent>
        </ProgressWrapper>
        <Typography variant="h6" align="center">
          {passed
            ? t("wallet.action-connect-message", {
              wallet: walletConfig.fullName,
            })
            : t("wallet.action-connecting-to", {
              chain: chainConfig.fullName,
            })}
        </Typography>
      </PaperContent>
    </>
  );
};

const useWalletConnectionProgressStyles = makeStyles((theme) => ({
  iconWrapper: {
    borderRadius: "50%",
    padding: 13,
    backgroundColor: theme.palette.divider,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 44,
  },
}));

export const WalletConnectionProgress: FunctionComponent = () => {
  const theme = useTheme();
  const styles = useWalletConnectionProgressStyles();
  return (
    <ProgressWithContent color={theme.customColors.redLighter} size={128}>
      <div className={styles.iconWrapper}>
        <WalletIcon fontSize="inherit" color="secondary" />
      </div>
    </ProgressWithContent>
  );
};

export const WalletWrongNetworkInfo: WalletPickerProps<
  any,
  any
>["WrongNetworkInfo"] = ({ chain, targetNetwork, onClose }) => {
  console.info(chain, targetNetwork);
  const { t } = useTranslation();
  const theme = useTheme();

  const networkKindName =
    (targetNetwork as RenNetwork) === RenNetwork.Mainnet
      ? "Mainnet"
      : "Testnet";
  const networkConfig = getChainNetworkConfig(
    chain as Chain,
    targetNetwork as RenNetwork
  );
  const subNetworkName = networkConfig.fullName;
  const chainConfig = getChainConfig(chain as Chain);

  const { provider } = useWallet(chain as Chain);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<any>(false);
  const  addOrSwitchChain  = () => {}
  const [success, setSuccess] = useState(false);
  const handleSwitch = useCallback(() => {
    if (addOrSwitchChain !== null) {
      setError(false);
      setPending(true);
      addOrSwitchChain()
    }
  }, [addOrSwitchChain]);

  return (
    <>
      <BridgeModalTitle
        title={t("wallet.wrong-network-title")}
        onClose={onClose}
      />
      <PaperContent bottomPadding>
        <ProgressWrapper>
          <ProgressWithContent
            size={128}
            color={theme.customColors.redLighter}
            fontSize="big"
          >
            <AccountBalanceWalletIcon fontSize="inherit" color="secondary" />
          </ProgressWithContent>
        </ProgressWrapper>
        <Typography variant="h5" align="center" gutterBottom>
          {t("wallet.network-switch-label")} {chainConfig.fullName}{" "}
          {networkKindName}
          {subNetworkName && <span> ({subNetworkName})</span>}
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          {t("wallet.network-switch-description")} {chainConfig.fullName}{" "}
          {networkKindName} ({subNetworkName})
        </Typography>
        <Box mt={2}>
          {addOrSwitchChain !== null && (
            <div>
              <Box minHeight={19}>
                <Fade in={pending || Boolean(error)} timeout={{ enter: 2000 }}>
                  <Box textAlign="center">
                    {pending && (
                      <CenteredFormHelperText>
                        {t("wallet.network-switching-message", {
                          wallet: "MetaMask",
                        })}
                      </CenteredFormHelperText>
                    )}
                    {Boolean(error) && (
                      <CenteredFormHelperText error>
                        {error.code === 4001 &&
                          t("wallet.operation-safely-rejected-message")}
                        {error.code === -32002 &&
                          t("wallet.operation-not-finished-message")}
                        {error.code === -32601 &&
                          t("wallet.switching-network-not-supported-message")}
                      </CenteredFormHelperText>
                    )}
                   
                  </Box>
                </Fade>
              </Box>
              <ActionButton
                onClick={handleSwitch}
                disabled={pending || success}
              >
                {pending || success
                  ? t("wallet.network-switching-label", {
                    network: subNetworkName || networkKindName,
                    wallet: "MetaMask",
                  })
                  : t("wallet.network-switch-label", {
                    network: subNetworkName || networkKindName,
                  })}
              </ActionButton>
            </div>
          )}
        </Box>
      </PaperContent>
    </>
  );
};

const CenteredFormHelperText = styled(FormHelperText)({
  textAlign: "center",
});


export const createIndicatorClass = (className: string, color: string) => {
  const { pulsingStyles, pulsingKeyframes } = createPulseAnimation(
    color,
    3,
    className
  );

  return {
    ...pulsingKeyframes,
    [className]: {
      ...pulsingStyles,
      backgroundColor: color,
    },
  };
};

type WalletConnectionIndicatorStyles = Record<
  "root" | "connected" | "disconnected" | "wrongNetwork" | "connecting",
  string
>;
const useWalletConnectionIndicatorStyles = makeStyles((theme) => {
  return {
    root: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.palette.divider,
    },
    ...createIndicatorClass("connected", theme.palette.success.main),
    ...createIndicatorClass("disconnected", theme.palette.error.main),
    ...createIndicatorClass("connecting", theme.palette.info.main),
    ...createIndicatorClass("wrongNetwork", theme.palette.warning.main),
  };
});

type WalletConnectionIndicatorProps = {
  status?: WalletStatus;
  className?: string; // TODO: find a better way
};

export const WalletConnectionIndicator: FunctionComponent<
  WalletConnectionIndicatorProps
> = ({ status, className: classNameProp }) => {
  const styles =
    useWalletConnectionIndicatorStyles() as WalletConnectionIndicatorStyles;
  const className = classNames(styles.root, classNameProp, {
    [styles.connected]: status === WalletStatus.Connected,
    [styles.wrongNetwork]: status === WalletStatus.WrongNetwork,
    [styles.disconnected]: status === WalletStatus.Disconnected,
    [styles.connecting]: status === WalletStatus.Connecting,
  });
  return <div className={className} />;
};

const getWalletConnectionLabel = (status: WalletStatus, t: any) => {
  switch (status) {
    case "disconnected":
      return t("wallet.connect-wallet");
    case "connecting":
      return t("wallet.connecting");
    case "connected":
      return t("wallet.connected");
    case "wrong_network":
      return t("wallet.wrong-network");
  }
};

const useWalletConnectionStatusButtonStyles = makeStyles<Theme>((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    borderColor: theme.palette.divider,
    boxShadow: defaultShadow,
    "&:hover": {
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.divider,
    },
  },
  hoisted: {
    zIndex: theme.zIndex.tooltip,
  },
  indicator: {
    marginRight: 10,
  },
  indicatorMobile: {
    marginLeft: 16,
    marginRight: 30,
  },
  account: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    borderLeft: "1px solid #DBE0E8",
  },
}));

type WalletConnectionStatusButtonProps = ButtonProps & {
  status: any;
  wallet: Wallet;
  chain: Chain;
  hoisted?: boolean;
  account?: any;
  mobile?: boolean;
};

export const WalletConnectionStatusButton: FunctionComponent<
  WalletConnectionStatusButtonProps
> = ({
  status,
  account,
  wallet,
  chain,
  hoisted,
  className,
  mobile,
  ...rest
}) => {
    const { Icon } = getWalletConfig(wallet as Wallet);
    const { t } = useTranslation();
    const {
      indicator: indicatorClassName,
      indicatorMobile: indicatorMobileClassName,
      account: accountClassName,
      hoisted: hoistedClassName,
      ...classes
    } = useWalletConnectionStatusButtonStyles();
    const { ensName } = useEns(account);

    const chainConfig = getChainConfig(chain);
    const trimmedAddress = trimAddress(account);
    const resolvedClassName = classNames(className, {
      [hoistedClassName]: hoisted,
    });
    const buttonProps: any = mobile
      ? {}
      : {
        variant: "outlined",
        color: "secondary",
        classes,
      };
    return (
      <Button
        className={resolvedClassName}
        {...buttonProps}
        {...rest}
        title={chainConfig.fullName}
      >
        <WalletConnectionIndicator
          status={status}
          className={mobile ? indicatorMobileClassName : indicatorClassName}
        />
        {status === WalletStatus.Connected && <Icon />}
        {status !== WalletStatus.Connected && (
          <span>{`Connect to ${chain}`}</span>
        )}
        {account && (
          <>
            <span className={accountClassName}>{ensName || trimmedAddress}</span>
            {isEthereumBaseChain(chain) && (
              <Davatar
                size={24}
                address={account as string}
                generatedAvatarType="jazzicon"
              />
            )}
          </>
        )}
      </Button>
    );
  };

const useBackToWalletPicker = (onClose: () => void) => {
  const dispatch = useDispatch();
  return useCallback(() => {
    onClose();
    setTimeout(() => {
      dispatch(setPickerOpened(true));
    }, 1);
  }, [dispatch, onClose]);
};

type AbstractConnectorInfoProps = {
  wallet: string;
  network: string;
  link: string;
  onBack: () => void;
  onClose: () => void;
  acknowledge: () => void;
};

