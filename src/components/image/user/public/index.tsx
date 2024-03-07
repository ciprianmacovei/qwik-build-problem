import { Image } from "@unpic/qwik";
import cn from "classnames";
import { UserServiceContext } from "~/services/user.service";
import { $, component$, useContext, useStore } from "@builder.io/qwik";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import NoPfp from "~/../public/pfp/nopicture.png?jsx"
import NoPfpAnonim from "~/../public/pfp/anonim.png?jsx";
interface UserPublicImageProps {
  userName: string;
  userType: number;
  notDisplayName?: boolean;
}

interface UserProfileState {
  imgLoaded: boolean;
  loadingImg: boolean;
}

export const UserPublicImage = component$(
  ({ userName, userType, notDisplayName }: UserPublicImageProps) => {
    const PUBLIC_APP_DOMAIN = import.meta.env.PUBLIC_APP_DOMAIN;
    const userService = useContext(UserServiceContext);
    const state = useStore<UserProfileState>({
      imgLoaded: false,
      loadingImg: true,
    });
    const { appNavigateWishLoading } = useCustomLoadingNavigation();

    const isImageLoaded = $(() => {
      state.imgLoaded = true;
      state.loadingImg = false;
    });

    const isImageLoadedWithError = $(() => {
      state.imgLoaded = false;
      state.loadingImg = false;
    })

    return (
      <section class="flex gap-2 items-center hover:cursor-pointer"
        onClick$={$(() =>
          appNavigateWishLoading(`/profile/${userName}/`)
        )}>
        <div class="avatar">
          <div
            class="h-8 w-8 flex bg-primary-400 rounded-full ring ring-black ring-offset-base-100 ring-offset-2"
          >
            <Image
              class={cn(!state.imgLoaded && "invisible h-0 w-0 absolute -z-50")}
              src={`${PUBLIC_APP_DOMAIN}/api/user/get/profile_pic/${userName}/${userService.state.user.token}`}
              alt="user profile picture"
              layout="fullWidth"
              onLoad$={isImageLoaded}
              onError$={isImageLoadedWithError}
            />
            {userType === 1 || userType === 10 && (
              <>
                {!state.imgLoaded && !state.loadingImg && (
                  <NoPfp
                    style={{ objectFit: "contain", height: "32px" }}
                    alt="user no profile picture"
                  />
                )}
              </>
            )}
            {userType === 0 && (
              <>
                {!state.imgLoaded && !state.loadingImg && (
                  <NoPfpAnonim
                    style={{ objectFit: "contain", height: "32px" }}
                    alt="user no profile picture"
                  />
                )}
              </>
            )}
            {state.loadingImg && <div class="skeleton w-8 h-8 rounded-full shrink-0"></div>}
          </div>
        </div>
        {!notDisplayName &&
          <article>
            <p class="text-[15px] font-bold font-nuito">{userName}</p>
          </article>
        }
      </section>
    );
  }
);
