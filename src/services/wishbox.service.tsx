import type { QRL } from "@builder.io/qwik";
import {
  $,
  createContextId,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { useAlerts } from "~/hooks/alerts";
import WishboxServerServiceReq from "./requests/wishbox";
import type { Wish } from "~/models/wish";

export interface WishBoxService {
  state: WishBoxState;
  nextSlide: QRL<(arrayLength: number) => void>;
  prevSlide: QRL<() => void>;
  selectWishForWishbox: QRL<(wish: Wish) => void>;
  getWishboxes: QRL<() => Promise<any>>;
  createWishbox: QRL<(wishboxName: string) => Promise<any>>;
  deleteWishbox: QRL<(wishboxId: number, wishboxName: string) => Promise<any>>;
}

interface WishBoxState {
  index: number;
  selectMode: boolean;
  selectedWishBoxIndex: number;
  selectedWishbox: string;
  selectedWishesIdsArrays: number[];
  refresh: {
    value: boolean;
    added_WishboxName?: string;
    deleted_WishboxName?: string;
  };
}

export const WishBoxServiceContext = createContextId<WishBoxService>(
  "wish-box-service-context"
);

export const useWishBoxService = () => {
  const state = useStore<WishBoxState>({
    index: 0,
    selectedWishBoxIndex: 0,
    selectMode: false,
    selectedWishesIdsArrays: [],
    selectedWishbox: "",
    refresh: {
      value: true,
      deleted_WishboxName: "",
      added_WishboxName: "",
    },
  });
  const { errorAlert } = useAlerts();

  const nextSlide = $((arrayLength: number) => {
    if (state.index < arrayLength - 1) {
      state.index += 1;
    }
  });

  const prevSlide = $(() => {
    if (state.index > 0) {
      state.index -= 1;
    }
  });

  const selectWishForWishbox = $((wish: Wish) => {
    if (state.selectMode) {
      const index = state.selectedWishesIdsArrays.indexOf(wish.id);
      if (index >= 0) {
        state.selectedWishesIdsArrays.splice(index, 1);
      } else {
        state.selectedWishesIdsArrays.push(wish.id);
      }
    }
  });

  const getWishboxes = $(() => {
    try {
      return server$(async function () {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishboxServerServiceReq.getWishboxes(
              cookie.token
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error getting wishbox", err);
        }
      })();
    } catch (err) {
      errorAlert(
        "Getting wishboxes failed!",
        "Please try again or contact support."
      );
    }
  });

  const createWishbox = $((wishboxName: string) => {
    try {
      return server$(async function (wishboxName, wishesIds) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishboxServerServiceReq.createWishbox(
              cookie.token,
              wishboxName,
              wishesIds
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error creating wishbox", err);
        }
      })(wishboxName, state.selectedWishesIdsArrays);
    } catch (err) {
      errorAlert(
        "Creating a wishbox failed!",
        "Please try again or contact support."
      );
    }
  });

  const deleteWishbox = $((wishboxId: number, wishboxName: string) => {
    try {
      return server$(async function (wishboxId, wishboxName) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishboxServerServiceReq.deleteWishbox(
              cookie.token,
              wishboxId,
              wishboxName
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error deleting wishbox", err);
        }
      })(wishboxId, wishboxName);
    } catch (err) {
      errorAlert(
        "Deleting a wishbox failed!",
        "Please try again or contact support."
      );
    }
  });

  const service = {
    state,
    nextSlide,
    prevSlide,
    selectWishForWishbox,
    getWishboxes,
    createWishbox,
    deleteWishbox,
  };

  useContextProvider(WishBoxServiceContext, service);
};
