import { describe, expect, it } from "vitest";
import { render } from "solid-js/web";
import { Spinner } from "./spinner";
import styles from "./spinner.module.css";

describe("Spinner Component", () => {
  it("renders with default props (size=inherit, aria-hidden=true)", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(() => <Spinner />, container);

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.classList.contains(styles.spinner!)).toBe(true);
    expect(svg?.classList.contains(styles.sizeInherit!)).toBe(true);

    const path = svg?.querySelector("path");
    expect(path).not.toBeNull();
    expect(path?.getAttribute("d")).toBe("M21 12a9 9 0 1 1-6.219-8.56");

    dispose();
    document.body.removeChild(container);
  });

  it("renders all size variants (inherit, sm, md, lg)", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => (
        <div>
          <Spinner size="inherit" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      ),
      container,
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs[0]?.classList.contains(styles.sizeInherit!)).toBe(true);
    expect(svgs[1]?.classList.contains(styles.sizeSm!)).toBe(true);
    expect(svgs[2]?.classList.contains(styles.sizeMd!)).toBe(true);
    expect(svgs[3]?.classList.contains(styles.sizeLg!)).toBe(true);

    dispose();
    document.body.removeChild(container);
  });

  it("renders accessible role=status and screen reader text when label is provided", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(() => <Spinner label="Loading accounts..." />, container);

    const wrapper = container.querySelector('[role="status"]');
    expect(wrapper).not.toBeNull();

    const srText = wrapper?.querySelector(`.${styles.srOnly}`);
    expect(srText?.textContent).toBe("Loading accounts...");

    const svg = wrapper?.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");

    dispose();
    document.body.removeChild(container);
  });

  it("renders accessible role=status when aria-label is provided", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(() => <Spinner aria-label="Loading data" />, container);

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("status");
    expect(svg?.getAttribute("aria-label")).toBe("Loading data");
    expect(svg?.getAttribute("aria-hidden")).toBeNull();

    dispose();
    document.body.removeChild(container);
  });

  it("supports custom strokeWidth property", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(() => <Spinner strokeWidth={3} />, container);

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke-width")).toBe("3");

    dispose();
    document.body.removeChild(container);
  });

  it("merges custom class and passes through SVG attributes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => <Spinner class="custom-spinner" data-testid="custom-loader" id="main-spinner" />,
      container,
    );

    const svg = container.querySelector("svg");
    expect(svg?.classList.contains("custom-spinner")).toBe(true);
    expect(svg?.classList.contains(styles.spinner!)).toBe(true);
    expect(svg?.getAttribute("data-testid")).toBe("custom-loader");
    expect(svg?.getAttribute("id")).toBe("main-spinner");

    dispose();
    document.body.removeChild(container);
  });
});
