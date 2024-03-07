import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { useCommonWishActions } from "~/actions/wish/common";
import { LoadingServiceContext } from "~/services/loading.service";
import { WishServiceContext } from "~/services/wish.service";
import { EditModal } from "~/actions/modal/edit";
import { useInfiniteScroll } from "~/hooks/infinite-scroll";
import { isBrowser, isServer } from "@builder.io/qwik/build";
import { useOnScreen } from "~/hooks/on-screen";
import { PrivateWishCard } from "~/style/cards/private-wish";
import { WishBoxServiceContext } from "~/services/wishbox.service";
import { usePrivateWishActions } from "~/actions/wish/private-wish";
import { WishPrivateCardDetails } from "~/style/cards/details-private-wish";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import { WishBoxContainer } from "../wishbox";
import NoWishes from "~/../public/images/rightpicturelanding.webp?jsx"
import type { Wish } from "~/models/wish";

interface WishCardState {
  selectedWishIndex: number;
  selectedWish: Wish | undefined;
  showWishDetails: {
    value: boolean;
  };
  showEditModal: {
    value: boolean;
  };
}

export const PrivateWishCardContainer = component$(() => {
  const loadingService = useContext(LoadingServiceContext);
  const wishService = useContext(WishServiceContext);
  const wishboxService = useContext(WishBoxServiceContext);
  const data = useSignal<Wish[]>([]);
  const dataCopy = useSignal<Wish[]>([]);
  const state = useStore<WishCardState>({
    selectedWish: undefined,
    selectedWishIndex: 0,
    showWishDetails: {
      value: false,
    },
    showEditModal: {
      value: false,
    },
  });
  const { loveWishAction, wishCommentAction } = useCommonWishActions();
  const { deleteWish, updateWishPublicStatus } = usePrivateWishActions();
  useOnScreen(dataCopy);
  const { navigateWithLoading } = useCustomLoadingNavigation();
  const pageState = useInfiniteScroll({
    page: 1,
    perPage: 10,
    data: dataCopy,
  });

  const onCopyPrivateWishLink = $(async (wish: Wish) => {
    if (wish.wish_find_link) {
      await navigator.clipboard.writeText(wish.wish_find_link);
    }
  });

  const showWishDetails = $((wish: Wish) => {
    state.selectedWishIndex = data.value.indexOf(wish);
    state.showWishDetails = { value: true };
  });

  const viewUserProfile = $(async (userName: string) => {
    await navigateWithLoading(`/profile/${userName}/`);
  });

  const onUpdateWishPublicStatus = $(async (wish: Wish, status: boolean) => {
    await updateWishPublicStatus(wish, data, status);
  });

  const onDeleteWish = $(async (wish: Wish) => {
    await deleteWish(wish, data);
  });

  const onUpdateWishLove = $(async (wish: Wish, love: boolean) => {
    await loveWishAction(wish, data, love);
  });

  const onSendWishComment = $(async (wish: Wish, text: string) => {
    await wishCommentAction(wish, data, text);
  });

  const onEditWish = $(async (wish: Wish) => {
    state.selectedWish = {
      ...wish,
    };
    state.showEditModal = {
      value: true,
    };
  });

  //get wishes
  useTask$(async ({ track }) => {
    track(() => pageState.page);
    try {
      if (isBrowser) {
        loadingService.simpleLoading = true;
      }
      const resData: { data: Wish[] | undefined } =
        await wishService.getMyWishes(pageState.page, pageState.perPage);
      if (resData.data?.length) {
        dataCopy.value = [...dataCopy.value, ...resData.data];
        if (
          !wishboxService.state.selectedWishbox ||
          wishboxService.state.selectedWishbox === "all"
        ) {
          data.value = [...data.value, ...resData.data];
        }
      }

    } catch (err) {
      console.log("backEndReq Error ", err);
    } finally {
      if (isBrowser) {
        loadingService.simpleLoading = false;
      }
    }
  });

  // edit wish
  useTask$(({ track }) => {
    track(() => wishService.state.refreshEdited);
    if (isServer) return;
    if (wishService.state.editedWish) {
      console.log(wishService.state.editedWish, "@@@@ EDITED @@@@");
      data.value = data.value.map((w: Wish) => {
        if (w.id == wishService.state.editedWish?.id) {
          return {
            ...w,
            ...wishService.state.editedWish,
            edited: true,
          };
        }
        return w;
      });
      wishService.state.editedWish = undefined;
      loadingService.simpleLoading = false;
    }
  });

  // add wish
  useTask$(({ track }) => {
    track(() => wishService.state.refreshCreated);
    if (isServer) return;
    if (wishService.state.createdWish) {
      if (
        data.value.length !== pageState.prevDataLength &&
        data.value.length > 1 &&
        (pageState.page !== 1 || data.value.length % 10 === 0) &&
        data.value[0].id !== wishService.state.createdWish.id
      ) {
        data.value.pop();
      }
      if (
        data.value[0]?.id !== wishService.state.createdWish.id ||
        data.value.length === 0
      ) {
        const newWish: Wish = { ...wishService.state.createdWish, new: true };
        data.value = [newWish, ...data.value];
      } else if (data.value[0].id === wishService.state.createdWish.id) {
        data.value = [
          { ...data.value[0], new: true },
          ...data.value.slice(1, data.value.length),
        ];
      }
      dataCopy.value = [...data.value];
      wishService.state.createdWish = undefined;
      loadingService.simpleLoading = false;
    }
  });

  // mutate wishbox
  useTask$(({ track }) => {
    track(() => wishboxService.state.refresh);
    if (isServer) return;
    if (
      wishboxService.state.selectedWishbox !== "all" &&
      wishboxService.state.selectedWishbox
    ) {
      data.value = dataCopy.value.filter(
        (wish: Wish) =>
          wish.wishbox_name === wishboxService.state.selectedWishbox
      );
    }
    if (wishboxService.state.selectedWishbox === "all") {
      if (wishboxService.state.selectMode) {
        data.value = dataCopy.value.filter((w: Wish) => !w.wishbox_name);
      } else {
        data.value = [...dataCopy.value];
      }
    }
    if (wishboxService.state.refresh.added_WishboxName) {
      data.value = dataCopy.value.map((w: Wish) => {
        if (wishboxService.state.selectedWishesIdsArrays.includes(w.id)) {
          return {
            ...w,
            wishbox_name: wishboxService.state.refresh.added_WishboxName!,
          };
        }
        return w;
      });
      dataCopy.value = [...data.value];
      wishboxService.state.refresh.added_WishboxName = "";
      wishboxService.state.selectedWishesIdsArrays = [];
    }
    if (wishboxService.state.refresh.deleted_WishboxName) {
      data.value = dataCopy.value.map((w: Wish) => {
        if (
          w.wishbox_name === wishboxService.state.refresh.deleted_WishboxName
        ) {
          return {
            ...w,
            wishbox_name: "",
          };
        }
        return w;
      });
      dataCopy.value = [...data.value];
      wishboxService.state.refresh.deleted_WishboxName = "";
    }
  });

  return (
    <>
      <section class="my-[10vh] flex w-full flex-col items-center justify-center gap-4">
        {dataCopy.value.length > 0 &&
          <article class="flex w-8/12 flex-col items-center justify-center gap-4">
            <WishBoxContainer />
          </article>
        }
        <ul class="font-nuito flex flex-col items-center justify-center gap-8 mt-3">
          {data.value.length > 0 ? (
            data.value.map((wish: Wish) => (
              <li
                key={"my-private-wishes" + wish.id}
                onClick$={$(() => wishboxService.selectWishForWishbox(wish))}
              >
                <PrivateWishCard
                  wish={wish}
                  viewUserProfile={viewUserProfile}
                  selectMode={wishboxService.state.selectMode}
                  selectedWishesIdsArrays={
                    wishboxService.state.selectedWishesIdsArrays
                  }
                  deleteWish={onDeleteWish}
                  editWish={onEditWish}
                  onCopyPrivateWishLink={onCopyPrivateWishLink}
                  showWishDetails={showWishDetails}
                  updateWishLove={onUpdateWishLove}
                  updateWishPublicStatus={onUpdateWishPublicStatus}
                />
              </li>
            ))
          ) : (
            <>
              <h1 class="font-special">0 wishes. Create one now!</h1>
              <NoWishes
                style={{ width: 380, height: 300 }}
                alt="No wishes added image"
              />
            </>
          )}
        </ul>
      </section>
      {data.value.length > 0 &&
        <WishPrivateCardDetails
          showModal={state.showWishDetails}
          wish={data.value[state.selectedWishIndex]}
          deleteWish={onDeleteWish}
          editWish={onEditWish}
          updateWishLove={onUpdateWishLove}
          sendWishComment={onSendWishComment}
          updateWishPublicStatus={onUpdateWishPublicStatus}
        />
      }
      <EditModal showModal={state.showEditModal} wish={state.selectedWish} />
    </>
  );
});
