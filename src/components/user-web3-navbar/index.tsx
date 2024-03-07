import { component$, useContext, useStore, $, useSignal, useOnWindow, useStyles$ } from "@builder.io/qwik";
import { WalletButton } from "../wallet";
import { UserServiceContext } from "~/services/user.service";
import { IconButton } from "~/style/buttons/icon-button";
import { CreatePresentModal } from "~/actions/modal/create-present";

import styles from "./index.css?inline";

export const UserWeb3Navbar = component$(() => {
  useStyles$(styles);
  const userService = useContext(UserServiceContext);
  const isSmallScreen = useSignal<boolean>(false);
  const state = useStore({
    showModal: {
      value: false,
    }
  })

  useOnWindow("DOMContentLoaded", $(() => {
    isSmallScreen.value = window.matchMedia("(max-width: 640px)").matches;
  }))

  return (
    <>
      {userService.state.user.isLoggedIn && (
        <section class="background-web3navbar font-nuito w-[18%] max-sm:w-full z-40 flex max-sm:fixed max-sm:bottom-0 h-[100vh] max-sm:h-[10vh] flex-col max-sm:flex-row-reverse justify-start border-l-2 max-sm:border-l-0 max-sm:border-t-2 border-solid border-black bg-white max-sm:bg-contrast-400 p-5">
          <WalletButton />
          <section class="relative flex items-center justify-center mt-auto mb-5">
            <div class="indicator">
              <span class="indicator-item badge bg-secondary-400 text-black !border-black">Beta</span>
              <IconButton
                imgPath="/images/offerpresent.webp"
                onClick={$(() => (state.showModal = { value: true }))}
                buttonClass="z-1 relative"
                simpleButton={true}
                w={isSmallScreen.value ? "85px" : "50px"}
                h={isSmallScreen.value ? "85px" : "52px"}
                size={isSmallScreen.value ? "md" : "lg"}
                imgHeight={isSmallScreen.value ? "41" : "65"}
                imgWidth={isSmallScreen.value ? "41" : "65"}
                alt="offer present image"
              />
            </div>

          </section>
        </section>
      )}
      <CreatePresentModal showModal={state.showModal} />
    </>
  );
});
