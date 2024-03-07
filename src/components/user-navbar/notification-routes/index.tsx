import {
  component$,
  $,
  useStore,
  useContext,
  useTask$,
} from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import type { SectionType } from "~/services/notif.service";
import { NotificationServiceContext } from "~/services/notif.service";
import cn from "classnames";
import { useLocation } from "@builder.io/qwik-city";
import { useCustomLoadingNavigation } from "~/hooks/navigation";

interface NotificationRouteProps {
  section: SectionType;
  path: string;
  name: string;
  imgPath: string;
  activeImgPath: string;
}

export const NotificationRoute = component$(
  ({ section, path, name, imgPath, activeImgPath }: NotificationRouteProps) => {
    const notificationService = useContext(NotificationServiceContext);
    const location = useLocation();
    const { appNavigateWishLoading } = useCustomLoadingNavigation();
    const state = useStore({
      notificationsLength: 0,
    });

    useTask$(async ({ track }) => {
      track(() => notificationService.state.navBarNotificationsArray);
      state.notificationsLength = (
        await notificationService.getNotificationNavBarSpecificSection(section)
      ).length;
    });

    return (
      <article
        class={cn(
          "hover:text-shadow relative flex cursor-pointer items-center gap-2 rounded-2xl px-3 max-sm:px-1 py-2 max-sm:py-0 duration-75 hover:bg-secondary-400/95 hover:font-bold max-lg:w-full max-sm:w-auto max-lg:items-center max-lg:justify-center",
          location.url.pathname.includes(path) && "font-bold"
        )}
        onClick$={$(() => appNavigateWishLoading(path))}
      >
        <div class="indicator">
          {state.notificationsLength > 0 &&
            <span class="indicator-item indicator-start badge bg-secondary-400 text-black !border-black">{state.notificationsLength}</span>
          }
          <div class="grid h-8 w-8 place-items-center duration-75 max-lg:h-9 max-lg:w-9">
            <Image
              src={location.url.pathname.includes(path) ? activeImgPath : imgPath}
              width={location.url.pathname.includes(path) ? 36 : 32}
              height={location.url.pathname.includes(path) ? 36 : 32}
              alt={name + " nav link"}
            />
          </div>
        </div>
        <p class="text-lg max-lg:hidden">{name}</p>
      </article>
    );
  }
);
