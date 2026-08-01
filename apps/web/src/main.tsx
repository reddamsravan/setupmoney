import { render } from "solid-js/web";
import App from "./app/app";

const root = document.getElementById("app");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("The required element with ID 'app' was not found.");
}

render(() => <App />, root!);
