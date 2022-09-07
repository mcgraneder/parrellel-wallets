import { useState } from "react";
import { useMultiwallet } from '@renproject/multiwallet-ui';
import PrimaryButton from "../Buttons/PrimaryButton";
import { ReactComponent as Metamask } from "../../assets/metamask.svg";
import PhantomWallet from "../../assets/icons/tokens/spaces_-MVOiF6Zqit57q_hxJYp_avatar-1615495356537.png"

import Davatar from '@davatar/react';
import { trimAddress } from '../../pages/MainLayout';
const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const {enabledChains} = useMultiwallet()

  const wallets = Object.values(enabledChains)
  console.log(enabledChains)

  console.log(enabledChains)
  const mutatedArray = Array(enabledChains)

  return (
    <>
      {showSidebar ? (
        <button
          className="flex text-4xl text-white items-center cursor-pointer fixed right-10 top-6 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          x
        </button>
      ) : (
        <svg
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed  z-30 flex items-center cursor-pointer right-10 top-6"
          fill="#2CC995"
          viewBox="0 0 100 80"
          width="40"
          height="40"
        >
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      )}

      <div
        className={`top-0 right-0 w-[27vw] bg-black-800  p-10 pl-20 text-white fixed h-full z-40  ease-in-out duration-300 ${
          showSidebar ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <h3 className="mt-20 text-4xl font-semibold text-white mb-8">
         Connected Wallets
        </h3>
        {
            wallets.map((wallet: any) => {
                console.log(wallet.account)
                return(
                    <div className="my-6">
                    { wallet.status === "connected" && <PrimaryButton className="w-full font-semibold text-xl h-[65px] items-center justify-center pl-5 pr-5 bg-gray-400">
                        <div className="w-full flex gap-5 items-center justify-center">
                            <div className="flex gap-5 justify-center items-center border-r">
                            
                            {wallet.account && wallet.chain === "Ethereum" ? <Metamask width={"35px"} height={"35px"}/> :  <img src={PhantomWallet} width={"35px"} height={"35px"}/>}
                                <span className="ml-2">{" "}</span>
                            </div>
                        <div className="pr-3 text-[22px]">
                         {trimAddress((wallet.account as any)?.toLowerCase(), 6)}
                        </div>
                        {wallet.account && <Davatar
                                size={35}
                                address={wallet.account as string}
                                generatedAvatarType="jazzicon"
                            />}
                        </div>
                        </PrimaryButton>}
                        </div>
                )
               
            })
        }
      </div>
    </>
  );
};

export default Sidebar;