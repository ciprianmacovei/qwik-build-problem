import {
  component$,
  $,
  useContext,
  useStore,
  useStyles$,
} from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { Button } from "~/style/buttons/button";
import styles from "./login.css?inline";
import { QFacebookLoginComponent } from "~/components/facebook-login";
import {
  WalletComponent,
  WalletLoginConnection,
} from "~/components/wallet-connect";
import { Image } from "@unpic/qwik";
import { UserServiceContext } from "~/services/user.service";
import { LoadingServiceContext } from "~/services/loading.service";
import { SignInWithGoogleButton } from "~/components/google-login";
import { useAlerts } from "~/hooks/alerts";
import { TextFormControl } from "~/components/form-controls/text";
import { WssServiceContext } from "~/services/wss.service";
import { useCustomLoadingNavigation } from "~/hooks/navigation";
import { TwitterLogin } from "~/components/twitter-login";
import { TwitterServiceReq } from "~/services/requests/twitter";

export const useTwitterAuthLink = routeLoader$<string>(
  async () => {
    try {
      const resData = await TwitterServiceReq.getTwitterAuthUrl();
      return resData.data;
    } catch (err) {
      console.log("Error useTwitterAuthLink ", err);
    }
  }
);

export default component$(() => {
  useStyles$(styles);
  const twitterAuthLink = useTwitterAuthLink();
  const { errorAlert } = useAlerts();
  const loadingState = useContext(LoadingServiceContext);
  const userService = useContext(UserServiceContext);
  const wssService = useContext(WssServiceContext);
  const loginState = useStore({
    login_auth: "",
    login_password: "",
  });
  const { navigateWithLoading } = useCustomLoadingNavigation();

  const getLoginPassword = $(($event: Event) => {
    loginState.login_password = ($event.target as HTMLInputElement).value;
  });

  const getLoginAuth = $(($event: Event) => {
    loginState.login_auth = ($event.target as HTMLInputElement).value;
  });

  const login = $(async () => {
    try {
      loadingState.loading = true;
      const resData = await userService.login(
        loginState.login_auth,
        loginState.login_password
      );
      if (resData.data) {
        await wssService.setSocket(resData.data);
        await navigateWithLoading("/profile/");
      } else {
        errorAlert("Login failed!", resData.value.message);
      }
    } catch (err) {
      errorAlert(
        "Login failed!",
        "Login request has faild please try again if it persist please contact support"
      );
      console.log("login Error ", err);
    } finally {
      loadingState.loading = false;
    }
  });

  const moveToRegister = $(async () => {
    await navigateWithLoading("/register/");
  });

  return (
    <section class="background h-[100vh] w-[100vw]">
      <section class="bg-[url('/images/landingpage.webp')] flex h-full w-full flex-col items-center justify-center bg-cover">
        <section class="card-background my-10 flex h-auto w-[623px] max-sm:w-[450px] flex-col items-center justify-center gap-[20px] p-4 ">
          <section class="w-2/3">
            <article class="mt-10">
              <p class="text-center text-[32px] font-bold">Sign in</p>
            </article>
            <section class="flex flex-col">
              <article>
                <TextFormControl
                  name="login_auth"
                  type="text"
                  label="Email or username"
                  id="login_auth"
                  onChangeEvent={getLoginAuth}
                />
              </article>
              <article>
                <TextFormControl
                  name="login_password"
                  type="password"
                  label="Password"
                  id="login_password"
                  onChangeEvent={getLoginPassword}
                />
              </article>
            </section>
            <section class="mb-[20px] flex flex-col justify-center gap-[10px]">
              <article class="flex flex-col justify-center">
                <Button text="Sign in >>" onClick={login} />
                <article class="mt-[9px] flex items-center justify-center gap-[4px]">
                  <Image
                    src="/images/smile.png"
                    width={11}
                    height={11}
                    layout="constrained"
                    alt="forghot password smile face"
                  />
                  <p class="font-nuito text-[13px]">Forgot password?</p>
                  <p class="font-nuito cursor-pointer text-[13px] font-bold hover:underline"
                    onClick$={$(() => navigateWithLoading('/recover/password/'))}
                  >
                    Click here
                  </p>
                </article>
              </article>
              <p class="text-center">--------------- OR ---------------</p>
              <Button text="Sign up >>" onClick={moveToRegister} />
              <div class="h-[44px]">
                <SignInWithGoogleButton />
              </div>
              <TwitterLogin link={twitterAuthLink.value} />
              <QFacebookLoginComponent />
              <div class="flex flex-col items-center justify-center gap-2">
                <p class="font-nuito text-center text-[9px] font-bold">
                  If you login with a wallet your profile will be secret only
                  the wallet address will be public
                </p>
                <WalletComponent
                  action={WalletLoginConnection}
                  buttonText="Login with wallet"
                />
              </div>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login to Wishbox to change your life alltogether",
    },
  ],
};
