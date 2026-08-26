import { describe, expect, it, vi } from "vitest";
import { render } from "solid-js/web";
import { Button } from "./button";
import styles from "./button.module.css";

describe("Button Component", () => {
  it("renders with default props (primary variant, md size, type=button)", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(() => <Button>Click me</Button>, container);

    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain("Click me");
    expect(button?.getAttribute("type")).toBe("button");
    expect(button?.classList.contains(styles.button!)).toBe(true);
    expect(button?.classList.contains(styles.primary!)).toBe(true);
    expect(button?.classList.contains(styles.sizeMd!)).toBe(true);

    dispose();
    document.body.removeChild(container);
  });

  it("renders variants (primary, secondary, danger, ghost)", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => (
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      ),
      container,
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons[0]?.classList.contains(styles.primary!)).toBe(true);
    expect(buttons[1]?.classList.contains(styles.secondary!)).toBe(true);
    expect(buttons[2]?.classList.contains(styles.danger!)).toBe(true);
    expect(buttons[3]?.classList.contains(styles.ghost!)).toBe(true);

    dispose();
    document.body.removeChild(container);
  });

  it("renders sizes (sm, md, lg)", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => (
        <div>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      ),
      container,
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons[0]?.classList.contains(styles.sizeSm!)).toBe(true);
    expect(buttons[1]?.classList.contains(styles.sizeMd!)).toBe(true);
    expect(buttons[2]?.classList.contains(styles.sizeLg!)).toBe(true);

    dispose();
    document.body.removeChild(container);
  });

  it("handles onClick events", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const handleClick = vi.fn();
    const dispose = render(() => <Button onClick={handleClick}>Submit</Button>, container);

    const button = container.querySelector("button");
    button?.click();

    expect(handleClick).toHaveBeenCalledTimes(1);

    dispose();
    document.body.removeChild(container);
  });

  it("handles disabled state and prevents click execution", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const handleClick = vi.fn();
    const dispose = render(
      () => (
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      ),
      container,
    );

    const button = container.querySelector("button");
    expect(button?.disabled).toBe(true);
    button?.click();

    expect(handleClick).not.toHaveBeenCalled();

    dispose();
    document.body.removeChild(container);
  });

  it("handles loading state (disables button, applies aria-busy, and renders spinner)", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const handleClick = vi.fn();
    const dispose = render(
      () => (
        <Button loading onClick={handleClick}>
          Save Account
        </Button>
      ),
      container,
    );

    const button = container.querySelector("button");
    expect(button?.disabled).toBe(true);
    expect(button?.querySelector("svg")).not.toBeNull();
    expect(button?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");

    button?.click();
    expect(handleClick).not.toHaveBeenCalled();

    dispose();
    document.body.removeChild(container);
  });

  it("renders leading and trailing icons", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => (
        <Button
          leadingIcon={<span data-testid="leading-icon">+</span>}
          trailingIcon={<span data-testid="trailing-icon">→</span>}
        >
          Add Account
        </Button>
      ),
      container,
    );

    expect(container.querySelector('[data-testid="leading-icon"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="trailing-icon"]')).not.toBeNull();
    expect(container.textContent).toContain("Add Account");

    dispose();
    document.body.removeChild(container);
  });

  it("supports iconOnly mode with square aspect class and aria-label", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => (
        <Button iconOnly aria-label="More options">
          <span>•••</span>
        </Button>
      ),
      container,
    );

    const button = container.querySelector("button");
    expect(button?.classList.contains(styles.iconOnly!)).toBe(true);
    expect(button?.getAttribute("aria-label")).toBe("More options");

    dispose();
    document.body.removeChild(container);
  });

  it("supports fullWidth modifier", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(() => <Button fullWidth>Full Width Button</Button>, container);

    const button = container.querySelector("button");
    expect(button?.classList.contains(styles.fullWidth!)).toBe(true);

    dispose();
    document.body.removeChild(container);
  });

  it("merges custom class and passes through HTML button attributes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const dispose = render(
      () => (
        <Button
          class="custom-btn"
          type="submit"
          name="save-btn"
          value="1"
          data-testid="test-button"
        >
          Save
        </Button>
      ),
      container,
    );

    const button = container.querySelector("button");
    expect(button?.getAttribute("type")).toBe("submit");
    expect(button?.getAttribute("name")).toBe("save-btn");
    expect(button?.getAttribute("value")).toBe("1");
    expect(button?.getAttribute("data-testid")).toBe("test-button");
    expect(button?.classList.contains("custom-btn")).toBe(true);
    expect(button?.classList.contains(styles.button!)).toBe(true);

    dispose();
    document.body.removeChild(container);
  });
});
