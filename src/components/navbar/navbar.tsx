import { component$, $, useStyles$, useContext } from "@builder.io/qwik";
import { Button } from "../../style/buttons/button";
import cn from "classnames";
import styles from "./navbar.css?inline";
import BigLogo from "../../../public/images/bigLogo.webp?jsx";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import { UserServiceContext } from "~/services/user.service";
import { Theme } from "../theme";

export const Navbar = component$(() => {
  useStyles$(styles);
  const userService = useContext(UserServiceContext);
  const { navigateWithLoading } = useCustomLoadingNavigation();

  const goToHomePage = $(() => {
    navigateWithLoading("/");
  });

  const goToRegisterOrLogin = $(() => {
    navigateWithLoading("/login/");
  });

  const goToApp = $(() => {
    navigateWithLoading("/profile/");
  })

  return (
    <>
      <section
        class={cn(
          `fixed top-0 z-40 flex w-full flex-row items-center bg-white`
        )}
      >
        <article class="ml-4">
          <BigLogo class="w-52 max-sm:w-40 h-auto" onClick$={goToHomePage} alt="full logo" />
        </article>
        <section class="m-[10px] !ml-auto flex gap-4">
          <Theme />
          {userService.state.user.isLoggedIn ? (
            <Button
              background="#FEDEEF"
              text="Back to application"
              onClick={goToApp}
            />
          ) : (
            <Button
              background="#FEDEEF"
              text="Sign in"
              w="120px"
              onClick={goToRegisterOrLogin}
            />
          )}
        </section>
      </section>
    </>
  );
});
