import { component$, useStore, $, useContext, useTask$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";

import { Button } from "~/style/buttons/button";

import { Banner } from "~/style/baner";
import { MyAccount } from "~/components/settings/my-account";
import { Socials } from "~/components/settings/socials";
import { WalletConnect } from "~/components/settings/wallet-connect";
import { NotificationServiceContext } from "~/services/notif.service";

import cn from "classnames";
import type { UserProfile } from "~/models/user";

const SettingsMenu = [
  {
    text: "Your account",
    value: 0,
  },
  {
    text: "Socials",
    value: 1,
  },
  {
    text: "Wallet Connect",
    value: 2,
  },
];

interface SettingsState {
  selectedIndex: number;
}

export const useGetUserProfile = routeLoader$<UserProfile>(
  async (requestEvent) => {
    try {
      const cookie = requestEvent.cookie.get("user")?.json<{ token: string }>();
      if (cookie?.token) {
        const resData = await fetch(
          "http://backend:8000/api/user/get/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookie.token}`,
            },
          }
        );
        const res = await resData.json();
        return res.data;
      } else {
        throw new Error("no token available");
      }
    } catch (err) {
      console.log("Error useUserProfile ", err);
    }
  }
);

export default component$(() => {
  const userProfile = useGetUserProfile();
  const notificationsService = useContext(NotificationServiceContext)
  const state = useStore<SettingsState>({
    selectedIndex: 0,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useTask$(async () => {
    await notificationsService.clearNotificationNavBarSpecificSection("settings");
  });

  return (
    <>
      <Banner name="Settings" />
      <section class="flex h-full w-full items-center p-7 max-sm:px-2 max-sm:py-2 max-sm:flex-col">
        <section class="flex w-1/3 h-full flex-col gap-10">
          <div class="flex h-full w-full flex-col gap-5 items-start justify-center max-sm:flex-row">
            {SettingsMenu.map((settings, index: number) => (
              <Button
                key={"settings_menu" + index}
                text={settings.text}
                buttonClass={cn(
                  "!rounded-full text-[14px] !text-black",
                  index === state.selectedIndex &&
                  "border-[4px] border-solid",
                  index === 0 && "bg-[#C6CA4B]",
                  index === 1 && "bg-[#B19AE0]",
                  index === 2 && "bg-[#F9A11D]",
                )}
                onClick={$(() => (state.selectedIndex = index))}
              />
            ))}
          </div>
        </section>
        <section class="flex w-2/3 justify-center items-center h-full max-sm:mt-5 max-sm:w-full">
          <div class="flex max-w-full min-h-[250px] w-full flex-col justify-start gap-2 rounded-md translate-x-[-0.25rem] translate-y-[-0.25rem] text-black shadow-[0.25rem_0.25rem_black] border-solid border-[3px] border-black bg-white">
            {SettingsMenu[state.selectedIndex].value === 0 && <MyAccount />}
            {SettingsMenu[state.selectedIndex].value === 1 && <Socials userProfile={userProfile} />}
            {SettingsMenu[state.selectedIndex].value === 2 && <WalletConnect />}
          </div>
        </section>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Wishbox Settings page",
  meta: [
    {
      name: "description",
      content: "This page allows you to set up your private information.",
    },
  ],
};
