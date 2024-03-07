import { $, component$, useContext, useSignal, useStore, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { UserServiceContext } from "~/services/user.service";
import { useNavigate } from "@builder.io/qwik-city";
import { CreateModal } from "~/actions/modal/create-wish";
import { WishServiceContext } from "~/services/wish.service";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import { LoadingServiceContext } from "~/services/loading.service";
import { Web3ServiceContext } from "~/services/web3.service";
import { UserGeneralImage } from "../image/user/general";
import { NotificationRoute } from "./notification-routes";
import { NavRoute } from "./routes";
import { IconButton } from "~/style/buttons/icon-button";
import { WssServiceContext } from "~/services/wss.service";
import { NotificationServiceContext } from "~/services/notif.service";
import { useServerStorage } from "~/storage";
import type { Notifications } from "~/services/notif.service";

import { Theme } from "../theme";

import { toast } from "qwik-sonner";

import BigLogo from "~/../public/images/bigLogo.webp?jsx";
import type { User } from "~/models/user";

import styles from "./index.css?inline";

export const UserNavbar = component$(() => {
  useStyles$(styles);
  const navigate = useNavigate();
  const userService = useContext(UserServiceContext);
  const loadingService = useContext(LoadingServiceContext);
  const wishService = useContext(WishServiceContext);
  const web3Service = useContext(Web3ServiceContext);
  const wssService = useContext(WssServiceContext);
  const notificationService = useContext(NotificationServiceContext);
  const isSmallScreen = useSignal<boolean>(false);
  const [, , removeServerStorage] = useServerStorage<User>("user");
  const { navigateWithLoading } = useCustomLoadingNavigation();
  const state = useStore({
    showModal: {
      value: false,
    },
  });

  const logOutUser = $(async () => {
    try {
      loadingService.loading = true;
      await removeServerStorage();
      await web3Service.removeWeb3State();
      await userService.removeUserState();
      await notificationService.clearAllNotificationNavBar();
      await wssService.disconnectSocket();
      await navigate("/login/");
    } catch (e) {
      console.log("logOutUser Error", e);
    } finally {
      loadingService.loading = false;
    }
  });

  const goToHomePage = $(() => {
    navigateWithLoading("/");
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    isSmallScreen.value = window.matchMedia("(max-width: 640px)").matches;
    try {
      const resDataUnseenNotificationsNumber: { data?: number } =
        await notificationService.getUnseenNotificationsNumber()
      if (resDataUnseenNotificationsNumber.data && resDataUnseenNotificationsNumber.data > 0) {
        const newNotificationsArray = new Array(resDataUnseenNotificationsNumber.data)
          .fill({ section: "notifications", newlyCreated: true })
        notificationService.setNotificationNavBarArray(newNotificationsArray);
        if (!userService.state.user.last_login) {
          notificationService.setNotificationNavBarArray([{ section: "settings", newlyCreated: true }]);
        }
      }
      wssService.state.socketIO?.on('notifications_event', (data) => {
        const { data: notification }: { data: Notifications } = JSON.parse(data);
        toast(notification.content);
        notificationService.setNotificationNavBarArray([{ section: "notifications", newlyCreated: true }]);
      }).on('connect_error', (error) => {
        console.error("Socket connection error:", error);
      }).on('disconnect', (reason) => {
        console.warn("Socket disconnected. Reason:", reason);
      });
    } catch (err) {
      console.log("Navbar listeners error: ", err);
    }

    cleanup(() => wssService.state.socketIO?.removeAllListeners());
  })

  return (
    <>
      {userService.state.user.isLoggedIn && (
        <section class="background-navbar font-nuito z-50 flex max-sm:fixed max-sm:top-0 h-[100vh] max-sm:h-[10vh] w-[25%] max-sm:w-[100vw] flex-col max-sm:!flex-row justify-center border-r-2 max-sm:border-r-0 max-sm:border-b-2 border-solid border-black bg-white max-sm:bg-contrast-400 p-5 max-sm:p-0">
          <article class="flex w-full items-center gap-2 justify-center">
            <Theme />
            <div class="indicator max-sm:hidden">
              <span class="indicator-item top-6 right-1 badge bg-secondary-400 text-black !border-black">Beta</span>
              <figure>
                <BigLogo
                  onClick$={goToHomePage}
                  style={{ width: "200px", height: "auto" }}
                  alt="logo" class="cursor-pointer"
                />
              </figure>
            </div>
          </article>
          <section class="flex h-full w-full flex-col max-sm:flex-row-reverse items-center justify-center gap-4 max-sm:gap-0 py-5 max-sm:py-0 max-sm:mr-4">
            <section class="flex h-full w-full flex-col max-sm:!flex-row items-center justify-center">
              <article class="mb-10 flex items-center justify-center gap-2 max-sm:hidden">
                <UserGeneralImage />
              </article>
              <section class="ml-[14%] max-sm:ml-0 flex min-w-[160px] flex-col max-sm:!flex-row items-start justify-center max-sm:justify-end gap-2 max-sm:gap-1 max-lg:!ml-0 max-lg:min-w-full">
                <NotificationRoute
                  path="/profile/"
                  imgPath="/images/profile.png"
                  activeImgPath="/images/activeprofile.png"
                  section="profile"
                  name="Profile"
                />
                <NavRoute
                  path="/explore/"
                  name="Explore"
                  imgPath="/images/explore.png"
                  activeImgPath="/images/activeexplore.png"
                />
                <NotificationRoute
                  path="/notifications/"
                  name="Notifications"
                  imgPath="/images/notification.png"
                  activeImgPath="/images/activenotifications.png"
                  section="notifications"
                />
                <NotificationRoute
                  path="/settings/"
                  name="Settings"
                  imgPath="/images/settings.png"
                  activeImgPath="/images/activesettings.png"
                  section="settings"
                />
                <NavRoute
                  path="/statistics/"
                  name="Statistics"
                  imgPath="/images/settings.png"
                  activeImgPath="/images/activesettings.png"
                />
                <NavRoute
                  path="/logout/"
                  name="Log Out"
                  imgPath="/images/logout.png"
                  activeImgPath="/images/logout.png"
                  onClick={logOutUser}
                />
              </section>
            </section>
            <section class="relative flex items-center justify-center max-sm:mr-2">
              {wishService.state.createWishHighlight && (
                <div class="absolute z-0 h-[50%] w-[50%] animate-ping rounded-full border-[2px] border-solid border-black"></div>
              )}
              <IconButton
                imgPath="/images/addwish.webp"
                onClick={$(() => (state.showModal = { value: true }))}
                buttonClass="z-1 relative"
                simpleButton={true}
                w={isSmallScreen.value ? "85px" : "50px"}
                h={isSmallScreen.value ? "85px" : "52px"}
                size={isSmallScreen.value ? "md" : "lg"}
                imgHeight={isSmallScreen.value ? "41" : "65"}
                imgWidth={isSmallScreen.value ? "41" : "65"}
                alt="create wish image"
              />
            </section>
          </section>
        </section>
      )}
      <CreateModal showModal={state.showModal} />
    </>
  );
});
