import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { EditProfileModal } from "~/actions/modal/edit-profile";
import { ProfileCard } from "~/style/cards/profile";
import { PrivateWishCardContainer } from "~/containers/private-wish";
import { Banner } from "~/style/baner";
import UserServerServiceReq from "~/services/requests/user";
import { NotificationServiceContext } from "~/services/notif.service";
import { UserServiceContext } from "~/services/user.service";
import type { Wish } from "~/models/wish";
import type { UserProfile } from "~/models/user";

export interface MyWishBoxWithWishes {
  wishbox_name: string;
  wish_number: number;
  wishes: Wish[];
  wishbox_id: number;
}

interface MyWishState {
  showProfileModal: {
    value: boolean;
  };
  enableWishbox: boolean;
}

export const useGetUserProfile = routeLoader$<UserProfile | undefined>(
  async (requestEvent) => {
    try {
      const cookie = requestEvent.cookie.get("user")?.json<{ token: string, id: number }>();
      if (cookie?.token) {
        const resData = await UserServerServiceReq.getUserProfile(cookie.token);
        return resData.data;
      } else {
        throw new Error("no token available");
      }
    } catch (err) {
      console.log("Error useGetUserProfile ", err);
    }
  }
);

export default component$(() => {
  const userProfileData = useGetUserProfile();
  const userProfile = useSignal<UserProfile | undefined>(userProfileData.value);
  const userService = useContext(UserServiceContext);
  const notificationService = useContext(NotificationServiceContext);
  const state = useStore<MyWishState>({
    showProfileModal: {
      value: false,
    },
    enableWishbox: false,
  });

  const openEditProfile = $(() => {
    state.showProfileModal = {
      value: true,
    };
  });

  const actionComplete = $((newUserDescription: string) => {
    userService.state.refreshPfp = {
      value: true,
    }
    if (newUserDescription !== userProfile.value?.user_description) {
      userProfile.value = {
        ...userProfile.value!,
        user_description: newUserDescription
      };
    }
  })
  // eslint-disable-next-line qwik/no-use-visible-task
  useTask$(async () => {
    if (notificationService.state.navBarNotificationsArray.length)
      await notificationService.clearNotificationNavBarSpecificSection("profile");
  });

  return (
    <>
      <section class="flex h-full w-full flex-col items-center">
        <Banner name="My Profile" />
        <article class="mt-[10vh] max-sm:mt-3 flex w-full flex-col items-center justify-center">
          {userProfile.value && (
            <ProfileCard
              userProfileData={userProfile}
              openEditProfile={openEditProfile}
              publicProfile={false}
            />
          )}
        </article>
        <section class="flex w-full flex-col items-center justify-start gap-4 px-4">
          <section class="font-nuito flex h-full w-full flex-col gap-4">
            <section class="font-nuito flex w-full flex-col items-center justify-center gap-4">
              <article class="max-w-8/12 flex gap-4">
                <PrivateWishCardContainer />
              </article>
            </section>
          </section>
        </section>
      </section>
      <EditProfileModal
        showModal={state.showProfileModal}
        userProfile={userProfile}
        actionComplete={actionComplete}
      />
    </>
  );
});

export const head: DocumentHead = {
  title: "Wishbox profile page",
  meta: [
    {
      name: "description",
      content:
        "This is the main page where u can add modify your wishes share with ur close friends or make them public so that anyone can see them.",
    },
  ],
};
