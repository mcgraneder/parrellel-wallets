import { RenNetwork } from "@renproject/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { $network } from "../../../network/networkSlice";
import {
  $wallet,
} from "./walletSlice";
import { useMultiwallet } from "@renproject/multiwallet-ui";
import { WalletStatus } from "./walletUtils";
import { Wallet } from "../../../providers/multiwallet/walletsConfig";
import { useSelector } from 'react-redux';
import { Chain } from '@renproject/chains';
import { useChains } from '../../../network/networkHooks';
import { ethers } from 'ethers';

type WalletData = ReturnType<typeof useMultiwallet> & {
    account: string;
    status: WalletStatus;
    connected: boolean;
    provider: any;
    wallet: Wallet;
    deactivateConnector: () => void;
    refreshConnector: () => void;
  };

export const useSyncWalletNetwork = () => {
    const { chain } = useSelector($wallet);
    const { network } = useSelector($network);
    const { targetNetwork, setTargetNetwork } = useWallet(chain);
    useEffect(() => {
      if (network !== targetNetwork) {
        setTargetNetwork(
          network.includes("mainnet")
            ? RenNetwork.Mainnet
            : network.includes("testnet")
            ? RenNetwork.Testnet
            : network
        );
      }
    }, [network, setTargetNetwork, targetNetwork]);
};

type UseWallet = (chain: Chain) => WalletData;

export const useWallet: UseWallet = (chain) => {
  const { enabledChains, targetNetwork, activateConnector, setTargetNetwork } =
    useMultiwallet();
  const { account = "", status = WalletStatus.Disconnected } =
    enabledChains?.[chain] || {};
  const provider = enabledChains?.[chain]?.provider;

  // TODO: crit this is faulty FIX this
  const wallet = resolveWalletByProvider(provider);

  const deactivateConnector = useCallback(() => {
    console.log("deactibating")
    console.log(enabledChains[chain]?.connector)
    enabledChains[chain]?.connector.deactivate();
  }, [enabledChains, chain]);

  const refreshConnector = useCallback(() => {
    deactivateConnector();
    setTimeout(() => {
      enabledChains[chain]?.connector.activate();
    }, 2000);
  }, [enabledChains, chain, deactivateConnector]);

  (window as any).p = provider;
  return {
    account,
    status,
    connected: status === WalletStatus.Connected,
    provider,
    wallet,
    targetNetwork,
    enabledChains,
    activateConnector,
    setTargetNetwork,
    deactivateConnector,
    refreshConnector,
  } as WalletData;
};

const resolveWalletByProvider = (provider: any) => {
    let resolved = Wallet.MetaMask;
  
    // TODO: we should persist wallet selection somewhere
    if (!provider) {
      resolved = Wallet.MetaMask; //default wallet
    } else if (provider?.isMetaMask) {
      resolved = Wallet.MetaMask;
    } else if (provider?.isCoinbaseWallet) {
      resolved = Wallet.Coinbase;
    } else if (provider?.wallet?._providerUrl?.href?.includes("sollet")) {
      resolved = Wallet.Sollet;
    } else if (provider?.wallet) {
      resolved = Wallet.Phantom;
    } else if (
      provider?.chainId === "0x61" ||
      provider?.chainId?.indexOf("Binance")
    ) {
      resolved = Wallet.BinanceSmartChain;
    } else if (provider?.isMewConnect || provider?.isMEWConnect) {
      resolved = Wallet.MyEtherWallet;
    } else {
      console.warn("Unresolved wallet", provider);
    }
    return resolved;
  };

  export const useEns = (address: string | undefined) => {
    const [ensName, setEnsName] = useState<string | null>();
  
    useEffect(() => {
      async function resolveENS() {
        if (address && ethers.utils.isAddress(address)) {
          let provider;
          if ("62302e9d9b074d8baa2344a5550b6cc9") {
            provider = new ethers.providers.StaticJsonRpcProvider(
              `https://mainnet.infura.io/v3/${"62302e9d9b074d8baa2344a5550b6cc9"}`
            );
          } else {
            provider = ethers.getDefaultProvider();
          }
          const ensName = await provider.lookupAddress(address);
          setEnsName(ensName);
        }
      }
      resolveENS().catch((error) => {
        console.error(error);
      });
    }, [address]);
  
    return { ensName };
  };
  

  export const useSwitchChainHelpers = async(
    chain: Chain,
    network: RenNetwork,
    provider: any
  ) => {
    const chains = useChains(network);
    const chainInstance = chains[chain];
    // console.log("chainInstance", chainInstance, chains, chain)
    const networkData = (chainInstance.chain as any).network.config
    console.log(networkData)
    if (networkData) {
      const { chainId, chainName, rpcUrls, blockExplorerUrls, nativeCurrency } =
        networkData;
      const params: any = [
        {
          chainId,
          chainName,
          rpcUrls,
          blockExplorerUrls,
          nativeCurrency,
        },
      ];

      try {
        await provider?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainId }],
        });
        return { switched: true };
      } catch (error: any) {
        if (error.code === 4902) {
          // TODO: get new chain params
          try {
            await provider?.request({
              method: "wallet_addEthereumChain",
              params: [],
            });
            return { switched: true };
          } catch (addError: any) {
            // handle "add" error
            return { switched: false, errorCode: addError.code };
          }
        } else if (error.code === 4001) {
          // user rejected the switch
        }
        return { switched: false, errorCode: error.code };
      }
    }
  };

 export const SwitchNetwork = async (
    chain: Chain,
    network: RenNetwork
    ) => {
    //@ts-ignore
    const { ethereum } = window;

    const chains = useChains(network);
    const chainInstance = chains[chain];
    // console.log("chainInstance", chainInstance, chains, chain)
    const networkData = (chainInstance.chain as any).network.config
    console.log(networkData)
    if (networkData) {
      const { chainId, chainName, rpcUrls, blockExplorerUrls, nativeCurrency } =
        networkData;
      const params: any = [
        {
          chainId,
          chainName,
          rpcUrls,
          blockExplorerUrls,
          nativeCurrency,
        },
      ];
  
    try {
      await ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
      return { switched: true };
    } catch (error: any) {
      if (error.code === 4902) {
        // TODO: get new chain params
        try {
          await ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [],
          });
          return { switched: true };
        } catch (addError: any) {
          // handle "add" error
          return { switched: false, errorCode: addError.code };
        }
      } else if (error.code === 4001) {
        // user rejected the switch
      }
      return { switched: false, errorCode: error.code };
    }
  };
    }

  