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
import { multiwalletOptions } from "../multiwallet";
import {
    chainStringToRenChain,
} from "../chainmap";


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

export const App1 = (): JSX.Element => {
    const [chain, setChain] =
        useState<keyof ReturnType<typeof multiwalletOptions>["chains"]>(
            "solana",
        );
    const [asset, setAsset] = useState("BTC");
    const [network, setNetwork] = useState(renNetworks[1]);

    const wallets = useMultiwallet();
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

    const [balances, setBalances] = useState<{ [chain: string]: string }>({});
    const [decimals, setDecimals] = useState<{
        [chain: string]: { [asset: string]: number };
    }>({});
    // useEffect(() => {
    //     Object.entries(wallets.enabledChains).map(
    //         async ([chain, connector]) => {
    //             const provider = connector.provider as any;
    //             const account = connector.account as string;

    //             if (!provider || !account) return;
    //             const mintChain: MintChain = chainStringToRenChain[chain](
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
        <Container
            style={{ display: "flex", flexDirection: "column", gap: "1em" }}
        >
            <WalletPickerModal
                open={open}
                options={{
                    chain: chain.toString(),
                    onClose: setClosed,
                    config: multiwalletOptions(network),
                    targetNetwork: network,
                }}
            />
            <ConnectToChain
                setOpen={setOpen}
                network={network}
                setChain={setChain}
            />
            <Container
                style={{ display: "flex", flexDirection: "row", gap: "1em" }}
            >
               
            </Container>

            {Object.keys(wallets.enabledChains)
                .filter((chain) => {
                    return (
                        wallets.enabledChains[chain].provider &&
                        wallets.enabledChains[chain].account
                    );
                })
                .map((chain) => (
                    <Paper key={chain} style={{ padding: "1em" }}>
                        <Typography
                            variant="h4"
                            style={{ textTransform: "capitalize" }}
                        >
                            Mint To {chain}
                        </Typography>{" "}
                        <Typography>
                         acc
                        </Typography>
                     
                        <div>
                            <Typography
                                style={{ textTransform: "capitalize" }}
                                variant="h4"
                            >
                                Burn from {chain}
                            </Typography>
                            <Typography>
                                {asset} Balance:{" "}
                                {Number(balances[chain]) /
                                    10 ** (decimals[chain] || {})[asset]}
                            </Typography>
                            <Input
                                placeholder="recipient address"
                                defaultValue="miMi2VET41YV1j6SDNTeZoPBbmH8B4nEx6"
                                onChange={updateAddress}
                                style={{ width: "100%" }}
                            />
                            <Input
                                placeholder="amount"
                                value={amount / 1e8}
                                type="number"
                                onChange={updateAmount}
                                style={{ width: "100%" }}
                            />
                          
                        </div>
                    </Paper>
                ))}
        </Container>
    );
};

ReactDOM.render(
    <MultiwalletProvider>
        <App1 />
    </MultiwalletProvider>,
    document.getElementById("root"),
);