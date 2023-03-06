import { $, component$, useOnWindow } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { Head } from "./components";
import { disableTransitions } from "./utils";
import "./global.css";

export default component$(() => {
  // Disable CSS transitions while window is resized
  useOnWindow("resize", $(disableTransitions));

  return (
    <QwikCityProvider>
      <Head />
      <body
        class="space-y-12 bg-white py-12 font-lexend text-slate-600 dark:bg-gray-900 dark:text-slate-400 md:space-y-14 md:py-14 lg:space-y-16 lg:py-16"
        lang="en"
      >
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
