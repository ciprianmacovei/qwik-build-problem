/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import { FacebookProvider, useFacebook } from "react-facebook";

const FacebookLoginButton = () => {
  const { isLoading, init } = useFacebook();
  const handleClick = async () => {
    const api = await init();
    if (api) {
      const response = await api.login({ scope: "email" });
      const FB = await api.getFB(); // Get original FB object
      console.log(response, FB);
    }
  };
  return (
    <button
      disabled={isLoading}
      onClick={handleClick}
      className="bg-blue-400 rounded-[4px] flex justify-center items-center cursor-pointer h-[40px] w-full text-white"
    >
      Login via Facebook
    </button>
  );
};

const FacebookLoginComponent = () => {
  return (
    <FacebookProvider appId="192995100346175">
      <FacebookLoginButton />
    </FacebookProvider>
  );
};

export const QFacebookLoginComponent = qwikify$(FacebookLoginComponent);
