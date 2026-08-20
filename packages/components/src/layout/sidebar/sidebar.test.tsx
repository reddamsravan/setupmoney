import { describe, expect, it, vi } from "vitest";
import { render } from "solid-js/web";
import { Sidebar } from "./sidebar";
import styles from "./sidebar.module.css";

describe("Sidebar Compound Component", () => {
  it("renders header, nav items, footer and handles toggling collapsed state", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const onCollapsedChange = vi.fn();

    const dispose = render(
      () => (
        <Sidebar onCollapsedChange={onCollapsedChange}>
          <Sidebar.Header logo={<span>Logo</span>}>Title</Sidebar.Header>
          <Sidebar.Nav>
            <Sidebar.Item title="Dashboard">Dashboard</Sidebar.Item>
            <Sidebar.Item active title="Transactions">
              {(props) => <a class={props.class}>Transactions Link</a>}
            </Sidebar.Item>
          </Sidebar.Nav>
          <Sidebar.Footer>
            <Sidebar.Toggle />
          </Sidebar.Footer>
        </Sidebar>
      ),
      container,
    );

    const aside = container.querySelector("aside");
    expect(aside).not.toBeNull();
    expect(aside?.classList.contains(styles.collapsed!)).toBe(false);

    expect(container.textContent).toContain("Logo");
    expect(container.textContent).toContain("Title");
    expect(container.textContent).toContain("Dashboard");
    expect(container.textContent).toContain("Transactions Link");

    const toggleButton = container.querySelector("button");
    expect(toggleButton).not.toBeNull();
    expect(toggleButton?.getAttribute("aria-label")).toBe("Collapse sidebar");

    toggleButton?.click();

    expect(aside?.classList.contains(styles.collapsed!)).toBe(true);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);

    dispose();
    document.body.removeChild(container);
  });

  it("supports controlled collapsed prop", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => (
        <Sidebar collapsed={true}>
          <Sidebar.Header>App</Sidebar.Header>
          <Sidebar.Footer>
            <Sidebar.Toggle />
          </Sidebar.Footer>
        </Sidebar>
      ),
      container,
    );

    const aside = container.querySelector("aside");
    expect(aside?.classList.contains(styles.collapsed!)).toBe(true);

    const toggleButton = container.querySelector("button");
    expect(toggleButton?.getAttribute("aria-label")).toBe("Expand sidebar");

    dispose();
    document.body.removeChild(container);
  });

  it("throws error when compound subcomponent is rendered outside Sidebar provider", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    expect(() => {
      render(() => <Sidebar.Toggle />, container);
    }).toThrow("useSidebarContext must be used within a <Sidebar> component");

    document.body.removeChild(container);
  });
});
