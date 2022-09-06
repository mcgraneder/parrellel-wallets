import { Chain } from "@renproject/chains";
import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
import { SolanaConnector } from "@renproject/multiwallet-solana-connector";
import { RenNetwork } from "@renproject/utils";
import { renNetworkToEthNetwork, ethNetworkToRenNetwork } from "../../utils/networkMapping";
import { Wallet } from "./walletsConfig";
import { WalletPickerConfig } from "@renproject/multiwallet-ui";

// const isEnabled = (chain: Chain, wallet: Wallet) => {
//   const entries = env.ENABLED_EXTRA_WALLETS;
//   if (entries.length === 1 && entries[0] === "*") {
//     return true;
//   }
//   for (const entry of entries) {
//     const [chainSymbol, wallets] = entry.split("/");
//     if (chainSymbol === chain) {
//       if (wallets === "*") {
//         return true;
//       } else {
//         const walletSymbols = wallets.split("|");
//         //return true/false only if chain info present and wallet enumerated;
//         return walletSymbols.includes(wallet);
//       }
//     }
//   }
//   return false;
// };

export const getMultiwalletConfig = (network: RenNetwork): WalletPickerConfig<unknown, string> => {
  return {
    chains: {
      [Chain.Ethereum]: [
        {
          name: Wallet.MetaMask,
          logo: "",
          connector: new EthereumInjectedConnector({
            debug: true,
            networkIdMapper: ethNetworkToRenNetwork,
          }),
        },
      ],
      [Chain.Solana]: [
        {
          name: Wallet.Phantom,
          logo: "",
          connector: new SolanaConnector({
            debug: true,
            providerURL: (window as any).solana || "https://www.phantom.app",
            clusterURL:
              network === RenNetwork.Mainnet
                ? "https://ren.rpcpool.com/"
                : undefined,
            network,
          }),
        },
        ...[
        {
          name: Wallet.Sollet,
          logo: "",
          connector: new SolanaConnector({
            providerURL: "https://www.sollet.io",
            clusterURL:
              network === RenNetwork.Mainnet
                ? "https://ren.rpcpool.com/"
                : undefined,
            network,
          }),
        }].filter((x) => (window as any).solana),
      ],
    }
  };
};
