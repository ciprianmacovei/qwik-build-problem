import type { QRL } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import cn from "classnames";
import { useCustomLoadingNavigation } from "~/hooks/navigation";

interface NotificationRouteProps {
  path: string;
  name: string;
  imgPath: string;
  activeImgPath: string;
  onClick?: QRL<() => void | any>;
}

export const NavRoute = component$(
  ({ path, name, imgPath, activeImgPath, onClick }: NotificationRouteProps) => {
    const location = useLocation();
    const { appNavigateWishLoading } = useCustomLoadingNavigation();

    return (
      <article
        onClick$={$(() => {
          !onClick ? appNavigateWishLoading(path) : onClick();
        })}
        class={cn(
          "hover:text-shadow flex cursor-pointer items-center gap-2 rounded-2xl px-3 max-sm:px-1 py-2 max-sm:py-0 duration-75 hover:bg-secondary-400/95 hover:font-bold max-lg:w-full max-sm:w-auto max-lg:items-center max-lg:justify-center",
          location.url.pathname.includes(path) && "font-bold"
        )}
      >
        <div class="flex h-8 w-8 items-center justify-center duration-75 max-lg:h-9 max-lg:w-9">
          <Image
            src={location.url.pathname.includes(path) ? activeImgPath : imgPath}
            width={location.url.pathname.includes(path) ? 36 : 32}
            height={location.url.pathname.includes(path) ? 36 : 32}
            alt={name + " nav link"}
          />
        </div>
        <p class="text-lg max-lg:hidden">{name}</p>
      </article>
    );
  }
);
