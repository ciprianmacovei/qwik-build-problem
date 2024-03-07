import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Button } from "~/style/buttons/button";
import { UserServiceContext } from "~/services/user.service";
import { LoadingServiceContext } from "~/services/loading.service";
import {
  Web3ServiceContext,
} from "~/services/web3.service";
import type { FetchEnsNameResult, GetAccountResult } from "@wagmi/core";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import { WssServiceContext } from "~/services/wss.service";
import { isServer } from "@builder.io/qwik/build";
import { toast } from "qwik-sonner";
export const WalletLoginConnection = "login_with_wallet";

interface WalletComponentInterface {
  action?: string | undefined;
  buttonText?: string;
}

export const WalletComponent = component$(
  ({ action, buttonText = "Connect To Wallet" }: WalletComponentInterface) => {
    const userService = useContext(UserServiceContext);
    const web3Service = useContext(Web3ServiceContext);
    const wssService = useContext(WssServiceContext);
    const loadingState = useContext(LoadingServiceContext);
    const anonymousLogoRef = useSignal<Element | undefined>();
    const state = useStore({
      loginAction: false,
    });
    const { navigateWithLoading } = useCustomLoadingNavigation();

    const walletSignIn = $(async (wallet: string, ens?: string | null, symbol?: string | null) => {
      try {
        loadingState.loading = true;
        const anonymousUserStorage = await userService.loginWithWallet(
          wallet,
          ens,
          symbol
        );
        if (anonymousUserStorage.data) {
          await web3Service.setWeb3State({
            user_wallet: wallet,
            wallet_crypto_symbol: symbol,
          });
          await wssService.setSocket(
            anonymousUserStorage.data
          );
          await navigateWithLoading("/profile/");
        }
      } catch (err) {
        console.log("walletSignIn Error ", err);

      } finally {
        loadingState.loading = false;
      }
    });

    const connectToWallet = $(async () => {
      try {
        state.loginAction = true;
        const account = web3Service.state.ethereumClient?.getAccount();
        if (account) {
          if (!account.isConnected) {
            await web3Service.state.web3modal?.openModal();
          } else {
            if (account.address) {
              const ens: FetchEnsNameResult | undefined =
                await web3Service.state.ethereumClient?.fetchEnsName({
                  address: account.address,
                });
              const balance =
                await web3Service.state.ethereumClient?.fetchBalance({
                  address: account.address as any,
                });

              await walletSignIn(account.address, ens, balance?.symbol);
            }
          }
        }
      } catch (error) {
        console.log(
          error,
          "got this error on connectToWallet catch block while connecting the wallet"
        );
      }
    });

    const notifyChangeWalletOrNetworkOnMetamask = $(() => {
      if (!state.loginAction) {
        toast(`
          Please do not change your network or wallet. 
          Look in settings to see on witch wallet your are connected.
        `);
      }
    })

    useTask$(({ track }) => {
      track(() => web3Service.state.ethereumClient);
      if (isServer) return;
      web3Service.state.ethereumClient?.watchAccount(async (account: GetAccountResult) => {
        try {
          if (account.address && account.isConnected && state.loginAction) {
            loadingState.loading = true;
            const ens: FetchEnsNameResult | undefined =
              await web3Service.state.ethereumClient?.fetchEnsName({
                address: account.address,
              });
            const balance =
              await web3Service.state.ethereumClient?.fetchBalance({
                address: account.address as any,
              });
            web3Service.state.symbol = balance?.symbol;
            await walletSignIn(account.address, ens, balance?.symbol);
            await navigateWithLoading("/profile/");
            state.loginAction = false;
            loadingState.loading = false;
          }
        } catch (err) {
          console.log("connectToWallet Error ", err);
        }
      });
    });


    useTask$(({ track }) => {
      track(() => web3Service.state.web3Provider)
      if (isServer) return;
      web3Service.state.web3Provider?.on("network", async () => {
        await notifyChangeWalletOrNetworkOnMetamask();
      });
      (web3Service.state.web3Provider?.provider as any).on("accountsChanged", async () => {
        await notifyChangeWalletOrNetworkOnMetamask();
      });
    })

    return (
      <div
        class="relative w-full"
        onMouseEnter$={$(() =>
          anonymousLogoRef.value?.classList.add(
            "translate-x-[-0.25rem]",
            "translate-y-[-0.25rem]"
          )
        )}
        onMouseLeave$={$(() =>
          anonymousLogoRef.value?.classList.remove(
            "translate-x-[-0.25rem]",
            "translate-y-[-0.25rem]"
          )
        )}
      >
        <Button
          text={buttonText}
          onClick={connectToWallet}
          buttonClass="w-full"
        />
        {action === WalletLoginConnection && (
          <div
            class="absolute bottom-[19px] left-[72.5%] duration-200"
            ref={anonymousLogoRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
              class={"anonymous"}
            >
              <path d="M224 16c-6.7 0-10.8-2.8-15.5-6.1C201.9 5.4 194 0 176 0c-30.5 0-52 43.7-66 89.4C62.7 98.1 32 112.2 32 128c0 14.3 25 27.1 64.6 35.9c-.4 4-.6 8-.6 12.1c0 17 3.3 33.2 9.3 48H45.4C38 224 32 230 32 237.4c0 1.7 .3 3.4 1 5l38.8 96.9C28.2 371.8 0 423.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-58.5-28.2-110.4-71.7-143L415 242.4c.6-1.6 1-3.3 1-5c0-7.4-6-13.4-13.4-13.4H342.7c6-14.8 9.3-31 9.3-48c0-4.1-.2-8.1-.6-12.1C391 155.1 416 142.3 416 128c0-15.8-30.7-29.9-78-38.6C324 43.7 302.5 0 272 0c-18 0-25.9 5.4-32.5 9.9c-4.8 3.3-8.8 6.1-15.5 6.1zm56 208H267.6c-16.5 0-31.1-10.6-36.3-26.2c-2.3-7-12.2-7-14.5 0c-5.2 15.6-19.9 26.2-36.3 26.2H168c-22.1 0-40-17.9-40-40V169.6c28.2 4.1 61 6.4 96 6.4s67.8-2.3 96-6.4V184c0 22.1-17.9 40-40 40zm-88 96l16 32L176 480 128 288l64 32zm128-32L272 480 240 352l16-32 64-32z" />
            </svg>
          </div>
        )}
      </div>
    );
  }
);
