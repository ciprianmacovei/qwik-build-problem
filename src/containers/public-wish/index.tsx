import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { WishPublicCardDetails } from "../../style/cards/details-public-wish";
import { useCommonWishActions } from "~/actions/wish/common";
import { useInfiniteScroll } from "~/hooks/infinite-scroll";
import { isBrowser } from "@builder.io/qwik/build";
import { useOnScreen } from "~/hooks/on-screen";
import { PublicWishCard } from "~/style/cards/public-wish";
import { usePublicWishActions } from "~/actions/wish/public-wish";
import { LoadingServiceContext } from "~/services/loading.service";
import { WishServiceContext } from "~/services/wish.service";
import { ContributeModal } from "~/actions/modal/contribute";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import NoWishes from "~/../public/images/rightpicturelanding.webp?jsx";
import type { Wish } from "~/models/wish";

interface WishCardState {
  selectedWishIndex: number;
  contributionWish: Wish | undefined;
  showWishDetails: {
    value: boolean;
  };
  showWishContribution: {
    value: boolean;
  };
}

export const PublicWishCardContainer = component$(() => {
  const loadingService = useContext(LoadingServiceContext);
  const wishService = useContext(WishServiceContext);
  const data = useSignal<Wish[]>([]);
  const state = useStore<WishCardState>({
    selectedWishIndex: 0,
    contributionWish: undefined,
    showWishDetails: {
      value: false,
    },
    showWishContribution: {
      value: false,
    },
  });
  useOnScreen(data);
  const { loveWishAction, wishCommentAction } = useCommonWishActions();
  const { takeWishAction, contributeWishAction } = usePublicWishActions();
  const pageState = useInfiniteScroll({
    page: 1,
    perPage: 10,
    data: data,
  });
  const { navigateWithLoading } = useCustomLoadingNavigation();

  const showWishDetails = $((wish: Wish) => {
    state.selectedWishIndex = data.value.indexOf(wish);
    state.showWishDetails = { value: true };
  });

  const viewUserProfile = $(async (userName: string) => {
    await navigateWithLoading(`/profile/${userName}/`);
  });

  const onUpdateWishLove = $(async (wish: Wish, love: boolean) => {
    await loveWishAction(wish, data, love);
  });

  const onSendWishComment = $(async (wish: Wish, text: string) => {
    await wishCommentAction(wish, data, text);
  });

  const onTakingWish = $(async (wish: Wish) => {
    await takeWishAction(wish, data);
  });

  const onContributeWish = $(async (wish: Wish) => {
    state.showWishContribution = {
      value: true,
    };
    state.contributionWish = wish;
  });

  const contributeActionComplete = $(
    async (wish: Wish, contribution: number) => {
      await contributeWishAction(wish, data, contribution);
    }
  );

  useTask$(async ({ track }) => {
    track(() => pageState.page);
    try {
      if (isBrowser) {
        loadingService.simpleLoading = true;
      }
      const resData = await wishService.getPublicWishes(
        pageState.page,
        pageState.perPage
      );
      if (resData.data?.length) {
        data.value = [...data.value, ...resData.data];
      }
    } catch (err) {
      console.log("backEndReq Error ", err);
    } finally {
      if (isBrowser) {
        loadingService.simpleLoading = false;
      }
    }
  });

  return (
    <>
      {data.value.length > 0 ?
        <ul class="font-nuito flex flex-col items-center gap-8 mb-[10vh]">
          {data.value.map((wish) => (
            <li key={"my-public-wishes" + wish.id}>
              <PublicWishCard
                wish={wish}
                viewUserProfile={viewUserProfile}
                onTakenWish={onTakingWish}
                showWishDetails={showWishDetails}
                updateWishLove={onUpdateWishLove}
                onContributeWish={onContributeWish}
              />
            </li>
          ))}
        </ul>
        :
        <section class="h-full flex flex-col items-center justify-end">
          <h1 class="font-special">0 wishes. Create one now!</h1>
          <NoWishes style={{ width: 380, height: 300 }} />
        </section>
      }
      {data.value.length > 0 &&
        <WishPublicCardDetails
          wish={data.value[state.selectedWishIndex]}
          showModal={state.showWishDetails}
          sendWishComment={onSendWishComment}
          updateWishLove={onUpdateWishLove}
          takeWish={onTakingWish}
        />
      }
      <ContributeModal
        showModal={state.showWishContribution}
        actionComplete={contributeActionComplete}
        wish={state.contributionWish!}
      />
    </>
  );
});
