import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
import { RenNetwork } from "@renproject/interfaces";
import { SolanaConnector } from '@renproject/multiwallet-solana-connector';
import { Wallet } from "./providers/multiwallet/walletsConfig";
import { WalletPickerConfig } from "@renproject/multiwallet-ui";
import { Chain } from "@renproject/chains";

const networkMapping: Record<number, RenNetwork[]> = {
    1: [RenNetwork.Mainnet],
    42: [RenNetwork.Testnet],
};

export const renNetworkToEthNetwork = (id: RenNetwork): number | undefined => {
    const entry = Object.entries(networkMapping).find(([_, x]) =>
        x.includes(id),
    );
    if (!entry) return entry;
    return parseInt(entry[0]);
};

export const ethNetworkToRenNetwork = (id: string | number): RenNetwork => {
    return {
        "1": RenNetwork.Mainnet,
        "42": RenNetwork.Testnet,
    }[parseInt(id as string).toString() as "1" | "42"];
};

export const fantomNetworkToRenNetwork = (id: string | number): RenNetwork => {
    return {
        "250": RenNetwork.Mainnet,
        "4002": RenNetwork.Testnet,
    }[parseInt(id as string).toString() as "250" | "4002"];
};
export const polygonNetworkToRenNetwork = (id: string | number): RenNetwork => {
    return {
        "137": RenNetwork.Mainnet,
        "80001": RenNetwork.Testnet,
    }[parseInt(id as string).toString() as "137" | "80001"];
};
export const avalancheNetworkToRenNetwork = (
    id: string | number,
): RenNetwork => {
    return {
        "43114": RenNetwork.Mainnet,
        "43113": RenNetwork.Testnet,
    }[parseInt(id as string).toString() as "43114" | "43113"];
};

export const multiwalletOptions = (network: RenNetwork): WalletPickerConfig<unknown, string> => {
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
              },
            ],
          },
    };
  };