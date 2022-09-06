import { RenNetwork } from "@renproject/interfaces";

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

// export const multiwalletOptions = (
//     network: RenNetwork,
// ): WalletPickerConfig<unknown, string> => ({
//     chains: {
       
//         solana: [
//             {
//                 name: "Sollet.io",
//                 logo: "https://avatars1.githubusercontent.com/u/69240779?s=60&v=4",
//                 connector: new SolanaConnector({
//                     debug: true,
//                     providerURL: "https://www.sollet.io",
//                     network,
//                 }),
//             },
//             ...[
//                 {
//                     name: "Phantom",
//                     logo: "https://avatars1.githubusercontent.com/u/78782331?s=60&v=4",
//                     connector:
//                         (window as any).solana &&
//                         new SolanaConnector({
//                             debug: true,
//                             providerURL: (window as any).solana,
//                             network,
//                         }),
//                 },
//             ].filter((x) => (window as any).solana),
//         ],
//         ethereum: [
//             {
//                 name: "Metamask",
//                 logo: "https://avatars1.githubusercontent.com/u/11744586?s=60&v=4",
//                 connector: new EthereumInjectedConnector({
//                     debug: true,
//                     networkIdMapper: ethNetworkToRenNetwork,
//                 }),
//             },
//         ],
//     },
// });