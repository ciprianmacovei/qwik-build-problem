import type { Signal } from "@builder.io/qwik";
import { component$, $, useContext, useComputed$, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ProfileCard } from "~/style/cards/profile";
import { PublicWishCardContainer } from "~/containers/public-wish";
import UserServerServiceReq from "~/services/requests/user";
import { UserServiceContext } from "~/services/user.service";
import { useUserActions } from "~/actions/user";
import type { UserProfile } from "~/models/user";

export const useGetUserNameProfile = routeLoader$<UserProfile | undefined>(
  async (requestEvent) => {
    try {
      const cookie = requestEvent.cookie.get("user")?.json<{ token: string }>();
      if (cookie?.token) {
        const res = await UserServerServiceReq.getUserNameProfile(
          requestEvent.params.username,
          cookie.token
        );
        return res.data;
      } else {
        throw new Error("no token available");
      }
    } catch (err) {
      console.log("Error useGetUserNameProfile ", err);
    }
  }
);

export default component$(() => {
  const userProfile = useGetUserNameProfile();
  const userService = useContext(UserServiceContext);
  const data = useSignal<UserProfile[]>(userProfile.value ? [userProfile.value] : []);
  const { followAction, unfollowAction } = useUserActions();

  const myself: Signal<boolean> = useComputed$(() => {
    return userProfile.value?.user_name === userService.state.user.user_name;
  });

  const followUser = $(async () => {
    if (userProfile.value?.user_name) {
      await followAction(userProfile.value.user_name, data);
    }
  });

  const unfollowUser = $(async () => {
    if (userProfile.value?.user_name) {
      await unfollowAction(userProfile.value.user_name, data);
    }
  });

  return (
    <>
      <section class="flex w-full flex-col items-center justify-center">
        <section class="mb-10 mt-[25vh] w-full">
          {data.value.length > 0 && (
            <ul>
              {data.value.map((u: UserProfile) => (
                <li key={"profile" + u.user_name}>
                  <ProfileCard
                    publicProfile={true}
                    userProfileData={{ value: u }}
                    followUser={followUser}
                    unfollowUser={unfollowUser}
                    myself={myself}
                  />
                </li>
              ))
              }
            </ul>
          )}
        </section>
        <section class="my-[15vh] flex w-full flex-col items-center gap-10">
          <PublicWishCardContainer />
        </section>
      </section>
    </>
  );
});
