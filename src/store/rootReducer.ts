
import { walletReducer } from "../components/ui/wallet/walletSlice";
import { combineReducers } from '@reduxjs/toolkit';
import { networkReducer } from '../network/networkSlice';

const rootReducer = combineReducers({
  network: networkReducer,
  wallet: walletReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
