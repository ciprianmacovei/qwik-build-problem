import type { QRL, Signal } from "@builder.io/qwik";
import { component$, $, useStore } from "@builder.io/qwik";
import { UserProfileImage } from "~/components/image/user/profile";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import { Button } from "~/style/buttons/button";

import { siOnlyfans, siTwitter, siFacebook, siInstagram } from "simple-icons"
import cn from "classnames";
import type { UserProfile } from "~/models/user";

interface ProfileCardProps {
  userProfileData: Signal<UserProfile | undefined>;
  publicProfile: boolean;
  openEditProfile?: QRL<() => void>;
  followUser?: QRL<(userName?: string) => void>;
  unfollowUser?: QRL<(userName?: string) => void>;
  myself?: Signal<boolean>;
  publicSelf?: boolean;
  followCardType?: boolean;
}

type PorfileState = {
  isFollowing: boolean | undefined;
}


export const ProfileCard = component$(
  ({
    userProfileData,
    publicProfile,
    openEditProfile,
    followUser,
    unfollowUser,
    myself,
    publicSelf,
    followCardType
  }: ProfileCardProps) => {
    const profile = useStore<PorfileState>({
      isFollowing: userProfileData.value?.is_following,
    })
    const { appNavigateWishLoading } = useCustomLoadingNavigation();

    const followCallback = $(async () => {
      if (followUser) {
        await followUser();
        profile.isFollowing = !profile.isFollowing;
      }
    })

    const unFollowCallback = $(async () => {
      if (unfollowUser) {
        await unfollowUser();
        profile.isFollowing = !profile.isFollowing;
      }
    })

    const goToFollowers = $(() => {
      if (userProfileData.value!.followers > 0) {
        appNavigateWishLoading(`/followers/${userProfileData.value?.user_name}/`)
      }
    })

    const goToFollowing = $(() => {
      if (userProfileData.value!.following > 0) {
        appNavigateWishLoading(`/follow/${userProfileData.value?.user_name}/`)
      }
    })

    return (
      <section class="w-full px-4">
        <section class="flex w-full flex-col gap-2 rounded-[20px] border-4 border-solid border-black bg-white px-[30px] py-[15px] shadow-[0.25rem_0.25rem_black]">
          <article class="flex w-full">
            <article class="flex items-center gap-2">
              <UserProfileImage
                userName={userProfileData.value!.user_name}
                userType={userProfileData.value!.user_type}
                publicProfileImg={followCardType}
              />
              <article class="font-nuito flex flex-col self-center font-bold">
                <p class={cn(followCardType ? "text-sm" : "text-lg")}>{userProfileData.value!.user_name}</p>
                <p class={cn(followCardType ? "text-xs" : "text-sm")}>{userProfileData.value!.created_at}</p>
              </article>
            </article>

            {!publicSelf &&
              <>
                {publicProfile && !myself?.value ? (
                  <div class="ml-auto flex items-center">
                    {profile.isFollowing ? (
                      <Button
                        onClick={unFollowCallback}
                        size="sm"
                        text="Unfollow"
                        buttonClass="!rounded-full text-[14px]"
                      />
                    ) : (
                      <Button
                        onClick={followCallback}
                        size="sm"
                        text="Follow"
                        buttonClass="!rounded-full text-[14px]"
                      />
                    )}
                  </div>
                ) : (
                  <div class="ml-auto flex items-center">
                    <Button
                      onClick={openEditProfile}
                      size="sm"
                      text="Edit profile"
                      buttonClass="!rounded-full text-[14px]"
                    />
                  </div>
                )}
              </>
            }
          </article>
          <article class={cn("flex", followCardType ? "my-1" : "my-3")}>
            <p class={cn("text-right", followCardType && "text-sm")}>
              {userProfileData.value?.user_description}
            </p>
          </article>
          <article class="flex gap-2">
            <p
              class={cn("link hover:scale-105 duration-75", followCardType && "text-xs", userProfileData.value!.followers > 0 && "!cursor-default")}
              onClick$={goToFollowers}
            >
              Followers {userProfileData.value?.followers}
            </p>
            <p
              class={cn("link hover:scale-105 duration-75", followCardType && "text-xs", userProfileData.value!.following > 0 && "!cursor-default")}
              onClick$={goToFollowing}
            >
              Follow {userProfileData.value?.following}
            </p>
          </article>
          <section class="flex gap-4">
            {userProfileData.value?.user_instagram_url && (
              <figure
                class={cn(followCardType ? "w-3 h-3" : "w-6 h-6", "cursor-pointer hover:scale-105 duration-75")}
                onClick$={$(() =>
                  window.open(userProfileData.value?.user_instagram_url)
                )}
                dangerouslySetInnerHTML={siInstagram.svg}
              />
            )}
            {userProfileData.value?.user_facebook_url && (
              <figure
                class={cn(followCardType ? "w-3 h-3" : "w-6 h-6", "cursor-pointer hover:scale-105 duration-75")}
                onClick$={$(() =>
                  window.open(userProfileData.value?.user_facebook_url)
                )}
                dangerouslySetInnerHTML={siFacebook.svg}
              />
            )}
            {userProfileData.value?.user_twitter_url && (
              <figure
                class={cn(followCardType ? "w-3 h-3" : "w-6 h-6", "cursor-pointer hover:scale-105 duration-75")}
                onClick$={$(() =>
                  window.open(userProfileData.value?.user_twitter_url)
                )}
                dangerouslySetInnerHTML={siTwitter.svg}
              />
            )}
            {userProfileData.value?.user_of_url && (
              <figure
                class={cn(followCardType ? "w-3 h-3" : "w-6 h-6", "cursor-pointer hover:scale-105 duration-75")}
                onClick$={$(() =>
                  window.open(userProfileData.value?.user_of_url)
                )}
                dangerouslySetInnerHTML={siOnlyfans.svg}
              />
            )}
          </section>
        </section>
      </section>
    );
  }
);
