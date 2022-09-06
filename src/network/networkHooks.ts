import { Chain } from "@renproject/chains";
import { RenNetwork } from "@renproject/utils";
import queryString from "query-string";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { $network, setNetwork } from "./networkSlice";
import { useLocation } from 'react-router-dom';
import { ChainInstanceMap } from "../chains/chains";
import { getDefaultChains } from "../chains/chains";

const supportedParamNetworks = [RenNetwork.Mainnet, RenNetwork.Testnet];

export const useSetNetworkFromParam = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const parsed = queryString.parse(location.search);

  useEffect(() => {
    const network = parsed.network as RenNetwork;
    if (network) {
      if (supportedParamNetworks.indexOf(network) > -1)
        dispatch(setNetwork(parsed.network as RenNetwork));
    }
  }, [dispatch, parsed.network]);
};

const chainsCache: Partial<Record<RenNetwork, ChainInstanceMap>> = {};
(window as any).chainsCache = chainsCache;


export const useChains = (network: RenNetwork) => {
  if (!chainsCache[network]) {
    chainsCache[network] = getDefaultChains(network);
  }
  return chainsCache[network] as ChainInstanceMap;
};