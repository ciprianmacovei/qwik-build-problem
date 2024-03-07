import { Image } from "@unpic/qwik";
import cn from "classnames";
import { $, component$, useContext, useStore, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { UserServiceContext } from "~/services/user.service";
import NoPfp from "~/../public/pfp/nopicture.png?jsx"
import NoPfpAnonim from "~/../public/pfp/anonim.png?jsx";
interface UserProfileImageState {
  imgLoaded: boolean;
  loadingImg: boolean;
  r: number;
}

export const UserGeneralImage = component$(() => {
  const PUBLIC_APP_DOMAIN = import.meta.env.PUBLIC_APP_DOMAIN;
  const userService = useContext(UserServiceContext);
  const state = useStore<UserProfileImageState>({
    imgLoaded: false,
    loadingImg: true,
    r: 0
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
    track(() => userService.state.refreshPfp)
    if (isServer) return;
    if (userService.state.refreshPfp.value) {
      state.loadingImg = true;
      state.imgLoaded = false;
      state.r += 1;
    }
  })

  return (
    <section class="flex items-center gap-2">
      <div class="avatar">
        <div class="w-14 bg-primary-400 rounded-full">
          <Image
            class={cn(!state.imgLoaded && "invisible h-0 w-0 absolute -z-50")}
            src={`${PUBLIC_APP_DOMAIN}/api/user/get/profile_pic/${userService.state.user.token}?r=${state.r}`}
            alt="user profile picture"
            layout="fullWidth"
            onLoad$={isImageLoaded}
            onError$={isImageLoadedWithError}
          />
          {(userService.state.user.user_type === 1 || userService.state.user.user_type === 10) && (
            <>
              {!state.imgLoaded && !state.loadingImg && (
                <NoPfp
                  style={{ objectFit: "contain", height: "56px" }}
                  alt="user no profile picture"
                />
              )}
            </>
          )}
          {userService.state.user.user_type === 0 && (
            <>
              {!state.imgLoaded && !state.loadingImg &&
                <NoPfpAnonim
                  style={{ objectFit: "contain", height: "56px" }}
                  alt="user no profile picture"
                />
              }
            </>
          )}
          {state.loadingImg && <div class="skeleton w-14 h-14 rounded-full shrink-0"></div>}
        </div>
      </div>

      <article class="max-lg:hidden">
        <span class="text-md">Welcome back,</span>
        <br />
        <span class="text-lg font-bold">
          {userService.state.user.user_name}
        </span>
      </article>
    </section>
  );
});
