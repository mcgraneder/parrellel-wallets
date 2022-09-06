import { Solana } from "@renproject/chains-solana";
import {
    Ethereum,
    BinanceSmartChain,
    Polygon,
    Fantom,
    Avalanche,
} from "@renproject/chains-ethereum";
import {
    Bitcoin,
    Zcash,
    BitcoinCash,
    DigiByte,
    Dogecoin,
} from "@renproject/chains-bitcoin";

export const chainStringToRenChain = {
    // binanceSmartChain: BinanceSmartChain,
    "ethereum": Ethereum,
    // polygon: Polygon,
    // fantom: Fantom,
    // avalanche: Avalanche,
    // solana: Solana,
};

export const releaseChains = {
    bitcoin: Bitcoin,
    zcash: Zcash,
    bitcoinCash: BitcoinCash,
    dogecoin: Dogecoin,
    dgb: DigiByte,
};

