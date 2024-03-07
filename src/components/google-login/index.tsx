import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import jwt_decode from "jwt-decode";
import { useNavigate } from "@builder.io/qwik-city";
import { LoadingServiceContext } from "~/services/loading.service";
import { UserServiceContext } from "~/services/user.service";
import { useAlerts } from "~/hooks/alerts";
import { WssServiceContext } from "~/services/wss.service";

declare const google: any;

export const SignInWithGoogleButton = component$(() => {
  const loadingState = useContext(LoadingServiceContext);
  const wssService = useContext(WssServiceContext);
  const userService = useContext(UserServiceContext);
  const navigation = useNavigate();
  const { errorAlert } = useAlerts();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    async () => {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      google.accounts.id.initialize({
        client_id: import.meta.env.PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        callback: async (googleAuth: { credential: string }) => {
          const userCredentials: {
            email: string;
            name: string;
          } = jwt_decode(googleAuth.credential);
          try {
            loadingState.loading = true;
            const resData = await userService.loginWithGoogle(
              userCredentials.email,
              userCredentials.name,
              googleAuth.credential
            );
            if (resData.data) {
              await wssService.setSocket(
                resData.data
              );
              await navigation("/profile/");
            } else {
              errorAlert(
                "Login with Google failed!",
                "Login failed please try again if it persist please contact support"
              );
            }
          } catch (e) {
            console.log("Login with Google failed", e);
          } finally {
            loadingState.loading = false;
          }
        },
      });

      google.accounts.id.renderButton(document.querySelector("#signInGoogle"), {
        theme: "filled_blue",
        width: isMobile ? 278 : 394,
      });
    },
    { strategy: "document-ready" }
  );

  return (
    <>
      <div id="signInGoogle" class="h-full !w-full [&>*]:!w-full" />
    </>
  );
});
