import type { QRL, Signal } from "@builder.io/qwik";
import { $, useContext } from "@builder.io/qwik";
import type { Wish } from "~/models/wish";
import { WishServiceContext } from "~/services/wish.service";

interface UsePrivateWishActionReturnType {
  deleteWish: QRL<(wish: Wish, data: Signal<Wish[]>) => void>;
  updateWishPublicStatus: QRL<
    (wish: Wish, data: Signal<Wish[]>, status: boolean) => void
  >;
}

export const usePrivateWishActions = (): UsePrivateWishActionReturnType => {
  const wishService = useContext(WishServiceContext);

  const deleteWish = $(async (wish: Wish, data: Signal<Wish[]>) => {
    const wishIndex = data.value.findIndex((w) => w.id === wish.id);
    try {
      data.value.splice(wishIndex, 1);
      data.value = [...data.value];
      await wishService.deleteWish(wish.id);
    } catch (_) {
      data.value.splice(wishIndex, 0, wish);
      data.value = [...data.value];
    }
  });

  const updateWishPublicStatus = $(
    async (wish: Wish, data: Signal<Wish[]>, status: boolean) => {
      try {
        data.value = data.value.map((w) => {
          if (w.id === wish.id) {
            return {
              ...w,
              wish_public: status ? 1 : 0,
            };
          }
          return w;
        });
        await wishService.updateWishPublic(wish.id, status);
      } catch (_) {
        data.value = data.value.map((w) => {
          if (w.id === wish.id) {
            return {
              ...w,
              wish_public: !status ? 1 : 0,
            };
          }
          return w;
        });
      }
    }
  );

  return {
    deleteWish,
    updateWishPublicStatus,
  };
};
