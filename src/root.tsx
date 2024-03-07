import { component$, useStyles$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { QwikPartytown } from "./components/partytown/partytown";

import globalStyles from "./global.css?inline";
import { ThemeProvider } from "./providers/theme";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  useStyles$(globalStyles);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <QwikPartytown forward={["dataLayer.push"]} />
        <script src="https://accounts.google.com/gsi/client" async defer={true}></script>
        <script src="https://kit.fontawesome.com/682d677c31.js" type="text/partytown" async defer={true}></script>
      </head>
      <body lang="en" data-theme="light">
        <ThemeProvider>
          <RouterOutlet />
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
