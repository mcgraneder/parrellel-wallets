import * as React from "react";
import * as ReactDOM from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Container,
    MenuItem,
    Paper,
    Select,
    Typography,
    Input,
} from "@material-ui/core";
import { MintChain, RenNetwork } from "@renproject/interfaces";
import {
    WalletPickerModal,
    MultiwalletProvider,
    useMultiwallet,
} from "@renproject/multiwallet-ui";

import { multiwalletOptions } from "./multiwallet";
import {chainStringToRenChain,} from "./chainmap";
import { Ethereum } from "@renproject/chains-ethereum";
import { getMultiwalletConfig } from "./providers/multiwallet/multiwalletConfig";
import { ConnectedMainLayout } from './pages/MainLayout';


const supportedAssets = ["BTC", "ZEC", "BCH", "FIL", "LUNA", "DGB", "DOGE"];
const renNetworks = [...Object.values(RenNetwork)];

const ConnectToChain = ({ setOpen, setChain, network }: any) => {
    return (
        <Paper style={{ margin: "1em" }}>
            {Object.keys(multiwalletOptions(network).chains).map((chain) => (
                <Button
                    variant="contained"
                    style={{ margin: "1em", marginRight: "0" }}
                    color="primary"
                    key={chain}
                    onClick={() => {
                        setChain(chain);
                        setOpen(true);
                    }}
                >
                    Connect To {chain}
                </Button>
            ))}
        </Paper>
    );
};

const DropdownSelect = ({ name, value, setValue, values }: any) => {
    const selectValue = useCallback(
        (e: React.ChangeEvent<any>) => setValue(e.target.value),
        [setValue],
    );
    return (
       <>
        <Paper
            style={{
                padding: "1em",
                display: "flex",
                alignItems: "center",
                gap: "1em",
            }}
        >
            <Typography>Select {name}:</Typography>
            <Select value={value} onChange={selectValue}>
                {values.map((v: any) => (
                    <MenuItem key={v} value={v}>
                        {v}
                    </MenuItem>
                ))}
            </Select>
        </Paper>
        </>
    );
};

const App = (): JSX.Element => {
    const [chain, setChain] =
        useState<keyof ReturnType<typeof multiwalletOptions>["chains"]>(
            "solana",
        );
    const [asset, setAsset] = useState("BTC");
    const [network, setNetwork] = useState(renNetworks[1]);

    const wallets = useMultiwallet();
    console.log(wallets)
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState<string>("");
    const updateAddress = useCallback(
        (e: React.ChangeEvent<any>) => setAddress(e.target.value),
        [setAddress],
    );

    const [amount, setAmount] = useState<number>(20000);
    const updateAmount = useCallback(
        (e: React.ChangeEvent<any>) =>
            setAmount(parseFloat(e.target.value) * 1e8),
        [setAmount],
    );

    const setClosed = useCallback(() => setOpen(false), [setOpen]);

    // console.log(chainStringToRenChain[chain])
    const [balances, setBalances] = useState<{ [chain: string]: string }>({});
    const [decimals, setDecimals] = useState<{
        [chain: string]: { [asset: string]: number };
    }>({});
    // useEffect(() => {
    //     Object.entries(wallets.enabledChains).forEach(
    //         async ([chain, connector]) => {
    //             const provider = connector.provider as any;
    //             const account = connector.account as string;

    //             if (!provider || !account) return;
    //             const mintChain: MintChain = new Ethereum(
    //                 provider,
    //                 network,
    //             );
    //             const balance = await mintChain.getBalance(asset, account);
    //             setBalances((balances) => ({
    //                 ...balances,
    //                 [chain]: balance.toString(),
    //             }));

    //             const decimals = await mintChain.assetDecimals(asset);
    //             setDecimals((oldDecimals) => ({
    //                 ...oldDecimals,
    //                 [chain]: {
    //                     ...oldDecimals[chain],
    //                     [asset]: decimals,
    //                 },
    //             }));
    //         },
    //     );
    // }, [wallets, setBalances, setDecimals]);

    return (
       <>
       <ConnectedMainLayout/>
     
       </>
    );
};

export default App

