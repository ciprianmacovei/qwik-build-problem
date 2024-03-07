import type { QRL, Signal } from "@builder.io/qwik";
import { $, useContext } from "@builder.io/qwik";
import { LoadingServiceContext } from "~/services/loading.service";
import { useAlerts } from "~/hooks/alerts";
import { Web3ServiceContext } from "~/services/web3.service";
import { ethers } from "ethers";
import type { Wish } from "~/models/wish";
import { WishServiceContext } from "~/services/wish.service";

interface UsePublicWishActionReturnType {
  takeWishAction: QRL<(wish: Wish, data: Signal<Wish[]>) => void>;
  contributeWishAction: QRL<
    (wish: Wish, data: Signal<Wish[]>, contribution: number) => void
  >;
}


//MODIFY ACTION FOR SEPOLIA SYMBOL
export const usePublicWishActions = (): UsePublicWishActionReturnType => {
  const web3Service = useContext(Web3ServiceContext);
  const wishService = useContext(WishServiceContext);
  const loadingService = useContext(LoadingServiceContext);
  const { errorAlert } = useAlerts();

  const onTakenWish = $(
    async (wish: Wish, data: Signal<Wish[]>, userName: string) => {
      try {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            return {
              ...dataWish,
              wish_taken_by_user: userName,
            };
          }
          return dataWish;
        });
      } catch (err) {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            return {
              ...wish,
            };
          }
          return dataWish;
        });
      }
    });

  const takeWishAction = $(async (wish: Wish, data: Signal<Wish[]>) => {
    try {
      loadingService.simpleLoading = true;
      if (web3Service.state.user_wallet && web3Service.state.symbol) {
        if (web3Service.state.symbol === wish.crypto_symbol) {
          const resData = await wishService.setGuardTaken(
            wish.id
          );
          if (resData) {
            const priceData = await web3Service.priceDiscovery(
              wish.crypto_symbol,
              wish.wish_price!
            );
            console.log("price data", priceData.data);
            const signer = web3Service.state.web3Provider?.getSigner();
            const tx = {
              from: web3Service.state.user_wallet,
              to: wish.user_wallet,
              value: ethers.utils.parseEther(
                parseFloat(priceData.data).toFixed(18)
              ),
              nonce: await web3Service.state.web3Provider?.getTransactionCount(
                web3Service.state.user_wallet,
                "latest"
              ),
            };
            const txResponse: ethers.providers.TransactionResponse | undefined =
              await signer?.sendTransaction(tx);
            if (txResponse?.hash) {
              const resData = await web3Service.watchTransactionTake(
                txResponse.hash,
                wish.user_wallet!,
                wish.id
              );
              if (resData && resData.data) {
                await onTakenWish(wish, data, resData.data);
              }
            }
          } else {
            await errorAlert(
              "Please be patient",
              "Wish is currently in process of taking by another person."
            );
          }
        } else {
          await errorAlert(
            "Error",
            `You need to switch to ${wish.crypto_symbol} network for this payment.`
          );
        }
      }
    } catch (err) {
      console.log(err, "taking wish");
      await wishService.removeGuardTaken(wish.id)
    } finally {
      loadingService.simpleLoading = false;
    }
  });

  const onContributeWish = $(
    async (wish: Wish, data: Signal<Wish[]>, contribution: number) => {
      try {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            return {
              ...dataWish,
              wish_contribution: contribution,
            };
          }
          return dataWish;
        });
      } catch (_) {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            return {
              ...wish,
            };
          }
          return dataWish;
        });
      }
    }
  );

  const contributeWishAction = $(
    async (wish: Wish, data: Signal<Wish[]>, contribution: number) => {
      try {
        loadingService.simpleLoading = true;
        if (web3Service.state.user_wallet && web3Service.state.symbol) {
          if (web3Service.state.symbol === wish.crypto_symbol) {
            const resData = await wishService.setGuardContribute(wish.id, contribution);
            if (resData) {
              const priceData = await web3Service.priceDiscovery(
                wish.crypto_symbol,
                contribution
              );
              console.log("price data", priceData.data);
              const signer = web3Service.state.web3Provider?.getSigner();
              const tx = {
                from: web3Service.state.user_wallet,
                to: wish.user_wallet,
                value: ethers.utils.parseEther(
                  parseFloat(priceData.data).toFixed(18)
                ),
                nonce: await web3Service.state.web3Provider?.getTransactionCount(
                  web3Service.state.user_wallet,
                  "latest"
                ),
              };
              const txResponse: ethers.providers.TransactionResponse | undefined =
                await signer?.sendTransaction(tx);
              if (txResponse?.hash) {
                const resData = await web3Service.watchTransactionContribute(
                  txResponse.hash,
                  wish.user_wallet!,
                  wish.id,
                  contribution
                );
                if (resData && resData.data) {
                  await onContributeWish(wish, data, resData.data);
                }
              }
            } else {
              await errorAlert(
                "Please be patient",
                "Wish is currently in process of contribution by another people."
              );
            }
          } else {
            await errorAlert(
              "Error",
              `You need to switch to ${wish.crypto_symbol} network for this payment.`
            );
          }
        }
      } catch (err) {
        console.log(err, "taking wish");
        await wishService.removeGuardContribute(wish.id)
      } finally {
        loadingService.simpleLoading = false;
      }
    }
  );

  return {
    takeWishAction,
    contributeWishAction,
  };
};
