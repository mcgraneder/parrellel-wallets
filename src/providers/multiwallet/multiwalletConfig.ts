import { Chain } from "@renproject/chains";
import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
import { SolanaConnector } from "@renproject/multiwallet-solana-connector";
import { RenNetwork } from "@renproject/utils";
import { renNetworkToEthNetwork, ethNetworkToRenNetwork } from "../../utils/networkMapping";
import { Wallet } from "./walletsConfig";
import { WalletPickerConfig } from "@renproject/multiwallet-ui";
import { EthereumWalletConnectConnector } from "@renproject/multiwallet-ethereum-walletconnect-connector";
import { EthereumMEWConnectConnector } from "@renproject/multiwallet-ethereum-mewconnect-connector";

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
            debug: false,
            networkIdMapper: ethNetworkToRenNetwork,
          }),
        },
        {
          name: Wallet.MyEtherWallet,
          logo: "",
          connector: new EthereumMEWConnectConnector({
            debug: false,
            rpc: {
              42: `wss://kovan.infura.io/ws/v3/${"62302e9d9b074d8baa2344a5550b6cc9"}`,
              1: `wss://mainnet.infura.io/ws/v3/${"62302e9d9b074d8baa2344a5550b6cc9"}`,
            },
            chainId: network === RenNetwork.Mainnet ? 1 : 42,
          }) as any,
        },
        {
                  name: Wallet.WalletConnect,
                  logo: "",
                  connector: new EthereumWalletConnectConnector({
                    rpc: {
                      42: `https://kovan.infura.io/v3/${"62302e9d9b074d8baa2344a5550b6cc9"}`,
                      1: `wss://mainnet.infura.io/ws/v3/${"62302e9d9b074d8baa2344a5550b6cc9"}`,
                    },
                    qrcode: true,
                    debug: true,
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
