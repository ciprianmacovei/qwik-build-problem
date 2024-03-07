import { Image } from "@unpic/qwik";
import cn from "classnames";
import { $, component$, useContext, useOn, useStore, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { UserServiceContext } from "~/services/user.service";
import NoPfp from "~/../public/pfp/nopicture.png?jsx"
import NoPfpAnonim from "~/../public/pfp/anonim.png?jsx";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import type { UserType } from "~/models/user";

interface UserProfileImageProps {
  userName: string;
  userType: UserType;
  publicProfileImg?: boolean;
}

interface UserProfileState {
  imgLoaded: boolean;
  showLargeImage: boolean;
  loadingImg: boolean;
  r: number;
}

export const UserProfileImage = component$(
  ({ userName, userType, publicProfileImg }: UserProfileImageProps) => {
    const PUBLIC_APP_DOMAIN = import.meta.env.PUBLIC_APP_DOMAIN;
    const userService = useContext(UserServiceContext);
    const { appNavigateWishLoading } = useCustomLoadingNavigation();
    const state = useStore<UserProfileState>({
      imgLoaded: false,
      showLargeImage: false,
      loadingImg: true,
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
      track(() => userService.state.refreshPfp)
      if (isServer) return;
      if (userService.state.refreshPfp.value) {
        state.loadingImg = true;
        state.imgLoaded = false;
        state.r += 1;
      }
    })

    useOn(
      "click",
      $(($event: any) => {
        if ($event.target.id === "user-profile-pfp-overlay") {
          state.showLargeImage = false;
        }
      })
    );

    return (
      <>
        <section class="flex items-center gap-2 cursor-pointer">
          <div class="avatar">
            <div class={cn(publicProfileImg ? "w-12 h-12" : "w-24 h-24", "flex bg-primary-400 rounded-full ring ring-black ring-offset-base-100 ring-offset-2")}>
              <div
                class="h-full"
                onClick$={$(() => {
                  if (publicProfileImg) {
                    appNavigateWishLoading(`/profile/${userName}/`)
                  } else {
                    state.showLargeImage = true;
                  }
                })}
              >
                <Image
                  class={cn(!state.imgLoaded && "invisible h-0 w-0 absolute -z-50")}
                  src={`${PUBLIC_APP_DOMAIN}/api/user/get/profile_pic/${userName}/${userService.state.user.token}?r=${state.r}`}
                  alt="user profile picture"
                  layout="constrained"
                  onLoad$={isImageLoaded}
                  onError$={isImageLoadedWithError}
                />
                {(userType === 1 || userType === 10) && (
                  <>
                    {!state.imgLoaded && !state.loadingImg && (
                      <NoPfp
                        style={{ objectFit: "contain", height: publicProfileImg ? "48px" : "96px" }}
                        alt="user no profile picture"
                      />
                    )}
                  </>
                )}
                {userType === 0 && (
                  <>
                    {!state.imgLoaded && !state.loadingImg &&
                      <NoPfpAnonim
                        style={{ objectFit: "contain", height: publicProfileImg ? "48px" : "96px" }}
                        alt="user no profile picture"
                      />
                    }
                  </>
                )}
                {state.loadingImg && <div class={cn(publicProfileImg ? "w-12 h-12" : "w-24 h-24 ", "skeleton flex rounded-full shrink-0")}></div>}
              </div>
            </div>
          </div>

        </section>
        {state.showLargeImage && (
          <article
            id="user-profile-pfp-overlay"
            class="fixed left-0 top-0 z-50 flex h-[100vh] w-[100vw] items-center justify-center bg-black/90"
          >
            <div class="h-32 w-32">
              <Image
                class={cn(!state.imgLoaded && !state.loadingImg && "invisible")}
                src={`${PUBLIC_APP_DOMAIN}/api/user/get/profile_pic/${userName}/${userService.state.user.token}?r=${state.r}`}
                alt="user profile picture"
                layout="fullWidth"
                onLoad$={isImageLoaded}
                onError$={isImageLoadedWithError}
              />
              {userType === 1 && (
                <>
                  {!state.imgLoaded && !state.loadingImg && (
                    <NoPfp
                      style={{ objectFit: "contain", height: "128px" }}
                      alt="user no profile picture"
                    />
                  )}
                </>
              )}
              {userType === 0 && (
                <>
                  {!state.imgLoaded && !state.loadingImg &&
                    <NoPfpAnonim
                      style={{ objectFit: "contain", height: "128px" }}
                      alt="user no profile picture"
                    />
                  }
                </>
              )}
              {state.loadingImg && <div class="h-32 w-32 skeleton rounded-full shrink-0"></div>}
            </div>
          </article >
        )}
      </>
    );
  }
);
