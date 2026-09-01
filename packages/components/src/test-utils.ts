import type { JSX } from "solid-js";
import { render } from "solid-js/web";

export interface MountResult {
  container: HTMLDivElement;
  cleanup: () => void;
}

/**
 * Mounts a SolidJS component into a fresh container appended to `document.body`.
 * Returns the container element and a `cleanup` function that disposes the component
 * and removes the container from the DOM.
 */
export function mount(ui: () => JSX.Element): MountResult {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const dispose = render(ui, container);
  return {
    container,
    cleanup: () => {
      dispose();
      document.body.removeChild(container);
    },
  };
}
