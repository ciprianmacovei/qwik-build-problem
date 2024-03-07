import type { NoSerialize, QRL } from "@builder.io/qwik";
import {
  $,
  createContextId,
  noSerialize,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { configureChains, createConfig } from "@wagmi/core";
import { arbitrum, mainnet, polygon, sepolia } from "@wagmi/core/chains";
import { Web3Modal } from "@web3modal/html";
import { ethers } from "ethers";
import { server$ } from "@builder.io/qwik-city";
import { Web3ServerServiceReq } from "./requests/web3";
import { useAlerts } from "~/hooks/alerts";
import type { Web3UserData } from "~/models/web3";

export const chains = [arbitrum, mainnet, polygon, sepolia];
const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: import.meta.env.PUBLIC_WALLET_CONNECT_ID }),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId: import.meta.env.PUBLIC_WALLET_CONNECT_ID,
    chains,
  }),
  publicClient,
});

export const returnWeb3ModalAndClient = async () => {
  const ethereumClient = new EthereumClient(wagmiConfig, chains);
  const web3modal = new Web3Modal(
    { projectId: import.meta.env.PUBLIC_WALLET_CONNECT_ID, themeMode: "dark" },
    ethereumClient
  );
  return { web3modal, ethereumClient };
};

type Web3ServiceStateType = {
  user_wallet?: string;
  symbol: string | undefined | null;
  user_balance?: number;
  web3modal: NoSerialize<Web3Modal> | undefined;
  ethereumClient: NoSerialize<EthereumClient> | undefined;
  web3Provider: NoSerialize<ethers.providers.Web3Provider> | undefined;
  usdt: NoSerialize<ethers.Contract> | undefined;
  signer: NoSerialize<ethers.Wallet> | undefined;
};

interface Web3Service {
  state: Web3ServiceStateType;
  setWeb3Modal: QRL<() => void>;
  watchTransactionTake: QRL<
    (hash: string, walletTo: string, wishId: number) => Promise<any> | undefined
  >;
  watchTransactionContribute: QRL<
    (
      hash: string,
      walletTo: string,
      wishId: number,
      contribution: number
    ) => Promise<any> | undefined
  >;
  priceDiscovery: QRL<
    (cryptoSimbol: string, price: number) => Promise<{ data: string }>
  >;
  setWeb3State: QRL<(userData: Web3UserData) => void>;
  removeWeb3State: QRL<() => void>;
}

export const Web3ServiceContext = createContextId<Web3Service>(
  "web3-service-context"
);

export const useWeb3Service = () => {
  const state = useStore<Web3ServiceStateType>({
    user_wallet: undefined,
    symbol: undefined,
    user_balance: undefined,
    web3modal: undefined,
    ethereumClient: undefined,
    web3Provider: undefined,
    usdt: undefined,
    signer: undefined,
  });
  const { errorAlert } = useAlerts();

  const setWeb3Modal = $(async () => {
    const { web3modal, ethereumClient } = await returnWeb3ModalAndClient();
    state.web3modal = noSerialize(web3modal);
    state.ethereumClient = noSerialize(ethereumClient);
  });

  const setWeb3State = $(async (userData: Web3UserData) => {
    state.user_wallet = userData.user_wallet;
    state.symbol = userData.wallet_crypto_symbol;
    if (state.user_wallet) {
      const res = await state.ethereumClient?.fetchBalance({
        address: userData.user_wallet as any,
      });
      state.user_balance = Number(res?.formatted);
      const ethereum = (window as any).ethereum;
      state.web3Provider = noSerialize(
        new ethers.providers.Web3Provider(ethereum, "any")
      );
    }
  });

  const removeWeb3State = $(async () => {
    state.web3Provider?.removeAllListeners();
    await state.ethereumClient?.disconnect();
    state.user_wallet = undefined;
    state.symbol = undefined;
    state.user_balance = undefined;
  })

  const watchTransactionTake = $(
    async (hash: string, walletTo: string, wishId: number) => {
      try {
        const data = await server$(async function (hash) {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await Web3ServerServiceReq.watchTransactionTake(
              cookie.token,
              hash,
              state.user_wallet!,
              walletTo,
              wishId
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        })(hash);
        return data;
      } catch (err) {
        if (err && err instanceof Error) {
          errorAlert(
            "Watching transaction failed!",
            err.message,
          );
        }
      }
    }
  );

  const watchTransactionContribute = $(
    async (
      hash: string,
      walletTo: string,
      wishId: number,
      contribution: number
    ) => {
      try {
        const data = await server$(async function (hash) {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData =
              await Web3ServerServiceReq.watchTransactionContribute(
                cookie.token,
                hash,
                state.user_wallet!,
                walletTo,
                wishId,
                contribution
              );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        })(hash);
        return data;
      } catch (err) {
        if (err && err instanceof Error) {
          errorAlert(
            "Watching transaction failed!",
            err.message,
          );
}
      }
    }
  );

const priceDiscovery = $(async (cryptoSymbol: string, price: number) => {
  try {
    return await server$(async function (cryptoSymbol, price) {
      try {
        const cookie: { token: string } | undefined = this.cookie
          .get("user")
          ?.json<{ token: string }>();
        if (cookie?.token) {
          const resData = await Web3ServerServiceReq.getPriceDiscovery(
            cookie.token,
            cryptoSymbol,
            price
          );
          return resData;
        } else {
          throw new Error("User is not logged in.");
        }
      } catch (err: unknown) {
        if (err) {
          throw new Error(err.toString());
        }
        console.log("priceDiscovery Error ", err);
      }
    })(cryptoSymbol, price);
  } catch (err) {
    errorAlert(
      "Getting price descovery failed!",
      "Please try again or contact support."
    );
  }
});

const service = {
  state,
  setWeb3Modal,
  priceDiscovery,
  watchTransactionTake,
  watchTransactionContribute,
  setWeb3State,
  removeWeb3State,
};

useContextProvider(Web3ServiceContext, service);
};
