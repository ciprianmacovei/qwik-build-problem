import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { Footer } from "~/components/footer/footer";
import { Loading } from "~/components/loading/screen";
import { SimpleLoading } from "~/components/loading/simple";
import { Navbar } from "~/components/navbar/navbar";
import { UserNavbar } from "~/components/user-navbar";
import { UserWeb3Navbar } from "~/components/user-web3-navbar";
import { LayoutUserAuth } from "~/auth";
import { AppLoading } from "~/components/loading/app";
import { useLoadingService } from "~/services/loading.service";
import { useNotificationService } from "~/services/notif.service";
import { useUserService } from "~/services/user.service";
import { useWeb3Service } from "~/services/web3.service";
import { useWishService } from "~/services/wish.service";
import { useWishBoxService } from "~/services/wishbox.service";
import { useWssService } from "~/services/wss.service";

import { Toaster } from "qwik-sonner";

import cn from "classnames";

export const onGet: RequestHandler = async ({ cookie, url, redirect }) => {
  // GUARDING
  const GUARDED_ROUTES = [
    "/profile/",
    "/explore/",
    "/notifications/",
    "/settings/",
    "/statistics/",
  ];
  if (
    GUARDED_ROUTES.includes("/" + url.pathname.split("/")[1] + "/") &&
    !cookie.get("user")
  ) {
    throw redirect(308, new URL("/login/", url).toString());
  }
  // GUARDING

  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  // cacheControl({
  //   // Always serve a cached response by default, up to a week stale
  //   staleWhileRevalidate: 60 * 60 * 24 * 7,
  //   // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
  //   maxAge: 5,
  // });
};

export default component$(() => {
  const location = useLocation();
  const singlePages: boolean =
    location.url.pathname === "/login/" ||
    location.url.pathname.includes("/register/") ||
    location.url.pathname.includes("/recover/password") ||
    location.url.pathname.includes("/change/password") ||
    location.url.pathname.includes("/404");
  const homePage: boolean = location.url.pathname === "/";

  useLoadingService();
  useUserService();
  useWeb3Service();
  useNotificationService();
  useWishService();
  useWishBoxService();
  useWssService();

  return (
    <LayoutUserAuth>
      <main class="flex h-full w-full flex-col" q:slot="main">
        <Toaster position="top-center"
          duration={3000}
          theme="dark"
          closeButton
          richColors
          toastOptions={{
            style: {
              background: "#ff90e8",
              border: "2px solid black",
              boxShadow: "0.25rem 0.25rem black",
            },
          }}
        />
        {!singlePages && homePage && <Navbar />}
        <section
          class={cn(
            "flex h-[100vh] w-full max-sm:px-0 max-sm:flex-col max-sm:h-auto justify-center",
            !singlePages && !homePage && "bg-primary-400"
          )}
        >
          {!singlePages && !homePage && <UserNavbar />}
          <section class={cn(singlePages || homePage ? "w-full" : "w-[57%]", "max-sm:w-full max-sm:min-h-[100vh]")}>
            <section class="flex flex-col h-full w-full overflow-y-auto scrollbar-hide max-sm:my-[10vh]">
              <Slot />
            </section>
            <AppLoading />
            <Loading />
            <SimpleLoading />
          </section>
          {!singlePages && !homePage && <UserWeb3Navbar />}
        </section>
      </main>
      <footer class="w-full flex" q:slot="footer">
        <section class="flex w-full justify-center">
          {!singlePages && homePage && <Footer />}
        </section>
      </footer>
    </LayoutUserAuth>
  );
});
