import type { NoSerialize, QRL } from "@builder.io/qwik";
import {
  $,
  createContextId,
  useContext,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { useAlerts } from "~/hooks/alerts";
import { WishServerServiceReq } from "./requests/wish";
import { LoadingServiceContext } from "./loading.service";
import { fileToBytes } from "~/utils";
import type { Wish } from "~/models/wish";
import type { CreateWishReqData } from "~/models/requests/wish";

export interface WishServiceState {
  refreshCreated: {
    value: boolean;
  };
  refreshEdited: {
    value: boolean;
  };
  refreshImg: {
    value: boolean;
    id: number;
  };
  fetchedData: boolean;
  createdWish: Wish | undefined;
  editedWish: Wish | undefined;
  createWishHighlight: boolean;
}

export interface WishService {
  onEditWishCompleted: QRL<(wish: Wish) => void>;
  onCreateCompleted: QRL<(wish: Wish) => void>;
  createWish: QRL<
    (
      wish_description: string,
      wish_name?: string,
      wish_photo?: NoSerialize<File>,
      wish_end_date?: Date,
      wish_price?: number,
      wish_id?: number,
      edit?: boolean
    ) => Promise<any> | undefined
  >;
  editWish: QRL<
    (
      wish_description: string,
      wish_name?: string,
      wish_photo?: NoSerialize<File>,
      wish_end_date?: Date,
      wish_price?: number,
      wish_id?: number,
    ) => Promise<any | undefined>
  >;
  deleteWish: QRL<(wishID: number) => Promise<any> | undefined>;
  takeWish: QRL<(wishID: number) => Promise<any> | undefined>;
  updateWishPublic: QRL<(wishID: number, state: boolean) => Promise<any> | undefined>;
  sendWishComment: QRL<(wishID: number, text: string) => Promise<any> | undefined>;
  updateWishLoves: QRL<(wishID: number, love: boolean) => Promise<any> | undefined>;
  state: WishServiceState;
  getMyWishes: QRL<(page: number, perPage: number) => Promise<any> | undefined>;
  getPublicWishes: QRL<
    (page: number, perPage: number) => Promise<any> | undefined
  >;
  setGuardContribute: QRL<(wishID: number, contribution: number) => Promise<any> | undefined>;
  setGuardTaken: QRL<(wishID: number) => Promise<any> | undefined>;
  removeGuardContribute: QRL<(wishID: number) => Promise<any> | undefined>;
  removeGuardTaken: QRL<(wishID: number) => Promise<any> | undefined>;
}

export const WishServiceContext = createContextId<WishService>(
  "wish-service-context"
);

export const useWishService = () => {
  const location = useLocation();
  const loadingService = useContext(LoadingServiceContext);
  const state = useStore<WishServiceState>({
    refreshCreated: {
      value: false,
    },
    refreshEdited: {
      value: false,
    },
    refreshImg: {
      value: false,
      id: 0,
    },
    fetchedData: false,
    createWishHighlight: false,
    createdWish: undefined,
    editedWish: undefined,
  });
  const { successAlert, errorAlert } = useAlerts();

  const onCreateCompleted = $(async (wish: Wish) => {
    state.createdWish = wish;
    if (location.url.pathname !== "/profile/") {
      loadingService.simpleLoading = false;
    }
    state.refreshCreated = {
      value: true,
    };
    await successAlert(
      "You created your wish",
      "Successfully created a new wish"
    );
  });

  const onEditWishCompleted = $(async (wish: Wish) => {
    console.log("Wish Futut")
    state.editedWish = wish
    state.refreshEdited = {
      value: true,
    };
    state.refreshImg = {
      value: true,
      id: wish.id,
    };
    await successAlert(
      "You edited your wish",
      "Successfully created a new wish"
    );
  });

  const getMyWishes = $((page: number, perPage: number) => {
    try {
      return server$(async function (page, perPage) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.getMyWishes(
              cookie.token,
              page,
              perPage
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
      })(page, perPage);
    } catch (err) {
      errorAlert(
        "Getting my wishes failed!",
        "Please try again or contact support."
      );
    }
  });

  const getPublicWishes = $((page: number, perPage: number) => {
    try {
      return server$(async function (page, perPage) {
        try {

          if (this.url.pathname === `/mywish/${this.params.token}/`) {
            const resData = await WishServerServiceReq.getUserPrivateWish(
              this.params.token
            );
            return resData;
          }
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            if (this.url.pathname === `/profile/${this.params.username}/`) {
              const resData = await WishServerServiceReq.getUserWishes(
                cookie.token,
                this.params.username,
                page,
                perPage
              );
              return resData;
            }
            if (this.url.pathname === "/explore/") {
              const resData = await WishServerServiceReq.getPublicWishes(
                cookie.token,
                page,
                perPage
              );
              return resData;
            }
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error getting public wishes", err);
        }
      })(page, perPage);
    } catch (err) {
      errorAlert(
        "Getting public wishes failed!",
        "Please try again or contact support."
      );
    }
  });

  const createWish = $(
    async (
      wishDescription: string,
      wishName?: string,
      wishPhoto?: NoSerialize<File>,
      wishEndDate?: Date,
      wishPrice?: number,
      wishId?: number,
      edit = false
    ) => {
      const bodyData: CreateWishReqData = {
        wishDescription,
        wishName,
        wishEndDate,
        wishPrice,
        wishId,
      }
      if (wishPhoto) {
        const bytes = await fileToBytes(wishPhoto);
        bodyData.wishPhotoName = wishPhoto.name;
        bodyData.wishPhotoType = wishPhoto.type;
        bodyData.wishPhoto = bytes;
      }
      try {
        return server$(async function (bodyData, edit) {
          try {
            const cookie: { token: string } | undefined = this.cookie
              .get("user")
              ?.json<{ token: string }>();
            if (cookie?.token) {
              const resData = await WishServerServiceReq.createWish(
                bodyData,
                edit,
                cookie.token
              );
              return resData;
            }
          } catch (err: unknown) {
            if (err) {
              throw new Error(err.toString());
            }
            console.log("Error creating wish", err);
          }
        })(bodyData, edit)
      } catch (err) {
        errorAlert(
          !edit ? "Creating wish failed!" : "Editing wish failed!",
          "Please try again or contact support."
        );
      }
    }
  );

  const editWish = $(
    async (
      wish_description: string,
      wish_name?: string,
      wish_photo?: NoSerialize<File>,
      wish_end_date?: Date,
      wish_price?: number,
      wish_id?: number,
    ) => {
      return await createWish(
        wish_description,
        wish_name,
        wish_photo,
        wish_end_date,
        wish_price,
        wish_id,
        true
      );
    }
  );

  const deleteWish = $(async (wishId: number) => {
    try {
      const data = await server$(async function (wishId) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.deleteWish(cookie.token, wishId);
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          console.log("Error deleting wish", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(wishId);
      return data;
    } catch (err) {
      if (err && err instanceof Error) {
        errorAlert(
          "Deleting wish failed!",
          err.message,
        );
      }
    }
  });

  const takeWish = $((wishId: number) => {
    try {
      return server$(async function (wishId) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.takeWish(cookie.token, wishId);
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error taking wish", err);
        }
      })(wishId);
    } catch (err) {
      errorAlert(
        "Taking wish failed!",
        "Please try again or contact support."
      );
    }
  });

  const updateWishPublic = $(async (wishId: number, state: boolean) => {
    try {
      const data = await server$(async function (wishId, state) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.updateWishPublic(cookie.token, wishId, state);
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          console.log("Error updating public wish", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(wishId, state);
      if (data) {
        await successAlert(
          state
            ? "Your wish became public."
            : "Your wish is now private.",
          state
            ? `
              Now you wish can be seen by other people who can fulfill your dreams or contribute to it.
              Please navigate to explore to see your wish.
            `
            : `Now the Wish is private share it only with ur friends`
        );
        return data;
      }
    } catch (err) {
      errorAlert(
        "Update wish public state failed!",
        "Please try again or contact support."
      );
    }
  });

  const updateWishLoves = $(async (wishId: number, love: boolean) => {
    try {
      const data = await server$(async function (wishId, love) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.updateWishLoves(cookie.token, wishId, love);
            return resData;
          } else {
            throw new Error("User is not logged in");
          }
        } catch (err: unknown) {
          console.log("Error loving wish", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(wishId, love);
      return data;
    } catch (err: unknown) {
      if (err && err instanceof Error) {
        errorAlert(
          "Loving wish failed!",
          err.message,
        );
      }
      throw new Error();
    }
  });

  const sendWishComment = $(async (wishId: number, text: string) => {
    try {
      const data = await server$(async function (wishId, text) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.sendWishComment(cookie.token, wishId, text);
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          console.log("Error commenting to wish", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(wishId, text);
      return data;
    } catch (err) {
      if (err && err instanceof Error) {
        errorAlert(
          "Commenting wish failed!",
          err.message,
        );
      }
      throw new Error();
    }
  });

  const setGuardContribute = $((wishId: number, contribution: number) => {
    try {
      return server$(async function (wishId, contribution) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.setGuardContribute(
              cookie.token,
              wishId,
              contribution
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error setGuardContribute", err);
        }
      })(wishId, contribution);
    } catch (err) {
      errorAlert(
        "Guard failed!",
        "Please try again if the error persist, please contact support."
      );
    }
  });

  const setGuardTaken = $((wishId: number) => {
    try {
      return server$(async function (wishId) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.setGuardTaken(
              cookie.token,
              wishId,
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error commenting to wish", err);
        }
      })(wishId);
    } catch (err) {
      errorAlert(
        "Guard failed!",
        "Please try again if the error persist, please contact support."
      );
    }
  });

  const removeGuardContribute = $((wishId: number) => {
    try {
      return server$(async function (wishId) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.removeGuardContribute(
              cookie.token,
              wishId,
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error setGuardContribute", err);
        }
      })(wishId);
    } catch (err) {
      errorAlert(
        "Guard failed!",
        "Please try again if the error persist, please contact support."
      );
    }
  });

  const removeGuardTaken = $((wishId: number) => {
    try {
      return server$(async function (wishId) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await WishServerServiceReq.removeGuardTaken(
              cookie.token,
              wishId,
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error commenting to wish", err);
        }
      })(wishId);
    } catch (err) {
      errorAlert(
        "Guard failed!",
        "Please try again if the error persist, please contact support."
      );
    }
  });

  const service = {
    state,
    onCreateCompleted,
    onEditWishCompleted,
    createWish,
    editWish,
    deleteWish,
    takeWish,
    updateWishPublic,
    updateWishLoves,
    sendWishComment,
    getMyWishes,
    getPublicWishes,
    setGuardContribute,
    setGuardTaken,
    removeGuardContribute,
    removeGuardTaken,
  };
  useContextProvider(WishServiceContext, service);
};
