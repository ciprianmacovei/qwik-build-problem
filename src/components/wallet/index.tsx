import { component$, useContext, useStyles$ } from "@builder.io/qwik";

import styles from "./index.css?inline"
import { Web3ServiceContext } from "~/services/web3.service";

export const WalletButton = component$(() => {
  useStyles$(styles);
  const web3Service = useContext(Web3ServiceContext);
  return (
    <section class="font-nuito flex justify-center items-center w-full">
      {web3Service.state.user_wallet ?
        <div class="join">
          <button class="btn btn-neutral join-item">{web3Service.state.user_balance?.toFixed(2)} {web3Service.state.symbol}</button>
          <button class="btn btn-active btn-secondary join-item">{
            web3Service.state.user_wallet.slice(0, 4) + "..." +
            web3Service.state.user_wallet.slice(
              web3Service.state.user_wallet.length - 4, web3Service.state.user_wallet.length
            )
          }</button>
        </div>
        :
        <button class="btn btn-active btn-secondary">Connect wallet</button>
      }
    </section>
  );
});
