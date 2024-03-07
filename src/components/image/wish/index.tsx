import {
  component$,
  useStore,
  $,
  useContext,
  useTask$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { Image } from "@unpic/qwik";

import cn from "classnames";
import { UserServiceContext } from "~/services/user.service";
import { WishServiceContext } from "~/services/wish.service";
import NoWish from "~/../public/images/nowish.webp?jsx";

interface WishImageProps {
  wishId: number | undefined;
}

export const WishImage = component$(({ wishId }: WishImageProps) => {
  const PUBLIC_APP_DOMAIN = import.meta.env.PUBLIC_APP_DOMAIN;
  const userService = useContext(UserServiceContext);
  const wishService = useContext(WishServiceContext);
  const state = useStore({
    loadingImg: true,
    imgLoaded: false,
    init: true,
    r: 0,
  });

  const isImageLoaded = $(() => {
    state.imgLoaded = true;
    state.loadingImg = false;
  });

  const isImageLoadedWithError = $(() => {
    state.imgLoaded = false;
    state.loadingImg = false;
  })

  useTask$(({ track }) => {
    track(() => wishService.state.refreshImg);
    if (isServer) return;
    if (wishService.state.refreshImg.id == wishId) {
      state.loadingImg = true;
      state.imgLoaded = false;
      state.r += 1;
    }
  });

  return (
    <article class="flex h-full w-full items-center justify-center">
      {state.loadingImg && <span class="loading loading-dots w-[100px]"></span>}
      {!state.imgLoaded && !state.loadingImg && (
        <NoWish style={{ width: "311px", height: "226px" }} alt="Wish no picture" loading="lazy" />
      )}
      <Image
        class={cn(!state.imgLoaded && "invisible h-0 w-0 absolute -z-50")}
        src={`${PUBLIC_APP_DOMAIN}/api/wish/img/${wishId}/${userService.state.user.token}?r=${state.r}`}
        alt="Wish picture"
        layout="fullWidth"
        onLoad$={isImageLoaded}
        onError$={isImageLoadedWithError}
      />
    </article>
  );
});
