import { describe, expect, it } from "vitest";
import { mount } from "../../test-utils";
import { Card } from "./card";
import styles from "./card.module.css";

describe("Card root", () => {
  it("renders a <div> root element", () => {
    const { container, cleanup } = mount(() => <Card>Content</Card>);
    const root = container.firstElementChild;
    expect(root?.tagName.toLowerCase()).toBe("div");
    cleanup();
  });

  it("applies the card base class", () => {
    const { container, cleanup } = mount(() => <Card>Content</Card>);
    const root = container.firstElementChild;
    expect(root?.classList.contains(styles.card!)).toBe(true);
    cleanup();
  });

  it("applies paddingMd class and scopes --card-inset via CSS class by default", () => {
    const { container, cleanup } = mount(() => <Card>Content</Card>);
    const root = container.firstElementChild as HTMLElement;
    // happy-dom does not resolve CSS custom properties declared in stylesheets via
    // getComputedStyle — class presence is the closest reliable proxy in this env.
    expect(root?.classList.contains(styles.paddingMd!)).toBe(true);
    expect(root?.classList.contains(styles.paddingSm!)).toBe(false);
    expect(root?.classList.contains(styles.paddingLg!)).toBe(false);
    cleanup();
  });

  it("applies paddingSm class when padding='sm'", () => {
    const { container, cleanup } = mount(() => <Card padding="sm">Content</Card>);
    const root = container.firstElementChild as HTMLElement;
    expect(root?.classList.contains(styles.paddingSm!)).toBe(true);
    expect(root?.classList.contains(styles.paddingMd!)).toBe(false);
    expect(root?.classList.contains(styles.paddingLg!)).toBe(false);
    cleanup();
  });

  it("applies paddingLg class when padding='lg'", () => {
    const { container, cleanup } = mount(() => <Card padding="lg">Content</Card>);
    const root = container.firstElementChild as HTMLElement;
    expect(root?.classList.contains(styles.paddingLg!)).toBe(true);
    expect(root?.classList.contains(styles.paddingMd!)).toBe(false);
    expect(root?.classList.contains(styles.paddingSm!)).toBe(false);
    cleanup();
  });

  it("applies default variant class when variant is omitted", () => {
    const { container, cleanup } = mount(() => <Card>Content</Card>);
    const root = container.firstElementChild;
    expect(root?.classList.contains(styles.variantDefault!)).toBe(true);
    cleanup();
  });

  it("applies ghost variant class and does NOT apply variantDefault when variant='ghost'", () => {
    const { container, cleanup } = mount(() => <Card variant="ghost">Content</Card>);
    const root = container.firstElementChild;
    expect(root?.classList.contains(styles.variantGhost!)).toBe(true);
    expect(root?.classList.contains(styles.variantDefault!)).toBe(false);
    cleanup();
  });

  it("merges consumer class onto the root", () => {
    const { container, cleanup } = mount(() => <Card class="custom-card">Content</Card>);
    const root = container.firstElementChild;
    expect(root?.classList.contains("custom-card")).toBe(true);
    expect(root?.classList.contains(styles.card!)).toBe(true);
    cleanup();
  });

  it("applies style prop on the root element", () => {
    const { container, cleanup } = mount(() => (
      <Card style={{ "min-height": "200px" }}>Content</Card>
    ));
    const root = container.firstElementChild as HTMLElement;
    expect(root?.style.minHeight).toBe("200px");
    cleanup();
  });

  it("passes through HTML attributes such as aria-label", () => {
    const { container, cleanup } = mount(() => <Card aria-label="Net worth card">Content</Card>);
    expect(container.firstElementChild?.getAttribute("aria-label")).toBe("Net worth card");
    cleanup();
  });
});

describe("Card.Header", () => {
  it("renders children", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Header>Header content</Card.Header>
      </Card>
    ));
    expect(container.textContent).toContain("Header content");
    cleanup();
  });

  it("renders a divider by default (divider class present)", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Header>Header</Card.Header>
      </Card>
    ));
    const header = container.querySelector(`.${styles.header}`);
    expect(header?.classList.contains(styles.headerDivider!)).toBe(true);
    cleanup();
  });

  it("suppresses divider when divider={false}", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Header divider={false}>Header</Card.Header>
      </Card>
    ));
    const header = container.querySelector(`.${styles.header}`);
    expect(header?.classList.contains(styles.headerDivider!)).toBe(false);
    cleanup();
  });

  it("merges consumer class on Card.Header", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Header class="custom-header">Header</Card.Header>
      </Card>
    ));
    const header = container.querySelector(".custom-header");
    expect(header).not.toBeNull();
    cleanup();
  });

  it("passes through native HTML attributes like title and aria-labelledby without collision", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Header title="Native Tooltip" aria-labelledby="external-label">
          Header
        </Card.Header>
      </Card>
    ));
    const header = container.querySelector(`.${styles.header}`);
    expect(header?.getAttribute("title")).toBe("Native Tooltip");
    expect(header?.getAttribute("aria-labelledby")).toBe("external-label");
    cleanup();
  });
});

describe("Card.Title", () => {
  it("renders children inside an h3 by default", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Title>Card Title Text</Card.Title>
      </Card>
    ));
    const heading = container.querySelector("h3");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe("Card Title Text");
    expect(heading?.classList.contains(styles.headerTitle!)).toBe(true);
    cleanup();
  });

  it("renders the heading element specified by the as prop", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Title as="h2">Section Heading</Card.Title>
      </Card>
    ));
    expect(container.querySelector("h2")).not.toBeNull();
    expect(container.querySelector("h3")).toBeNull();
    cleanup();
  });

  it("merges consumer class on Card.Title", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Title class="custom-title">Title</Card.Title>
      </Card>
    ));
    const heading = container.querySelector(".custom-title");
    expect(heading).not.toBeNull();
    expect(heading?.classList.contains(styles.headerTitle!)).toBe(true);
    cleanup();
  });

  it("passes through HTML attributes on Card.Title", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Title id="card-heading-1">Title</Card.Title>
      </Card>
    ));
    expect(container.querySelector("#card-heading-1")).not.toBeNull();
    cleanup();
  });
});

describe("Card.Description", () => {
  it("renders children inside a <p> with caption styling", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Description>Description text</Card.Description>
      </Card>
    ));
    const desc = container.querySelector("p");
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toBe("Description text");
    expect(desc?.classList.contains(styles.headerDescription!)).toBe(true);
    cleanup();
  });

  it("merges consumer class on Card.Description", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Description class="custom-desc">Description</Card.Description>
      </Card>
    ));
    const desc = container.querySelector(".custom-desc");
    expect(desc).not.toBeNull();
    expect(desc?.classList.contains(styles.headerDescription!)).toBe(true);
    cleanup();
  });
});

describe("Card.Action", () => {
  it("renders children inside an action container", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Action>
          <button data-testid="action-btn">Action</button>
        </Card.Action>
      </Card>
    ));
    const action = container.querySelector(`.${styles.headerAction}`);
    expect(action).not.toBeNull();
    expect(container.querySelector('[data-testid="action-btn"]')).not.toBeNull();
    cleanup();
  });

  it("merges consumer class on Card.Action", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Action class="custom-action">Action</Card.Action>
      </Card>
    ));
    const action = container.querySelector(".custom-action");
    expect(action).not.toBeNull();
    expect(action?.classList.contains(styles.headerAction!)).toBe(true);
    cleanup();
  });
});

describe("Card.Body", () => {
  it("renders children", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Body>body content</Card.Body>
      </Card>
    ));
    expect(container.textContent).toContain("body content");
    cleanup();
  });

  it("merges consumer class on Card.Body", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Body class="custom-body">body</Card.Body>
      </Card>
    ));
    expect(container.querySelector(".custom-body")).not.toBeNull();
    cleanup();
  });
});

describe("Card.Footer", () => {
  it("renders children", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Footer>footer content</Card.Footer>
      </Card>
    ));
    expect(container.textContent).toContain("footer content");
    cleanup();
  });

  it("renders a divider by default (footerDivider class present)", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Footer>F</Card.Footer>
      </Card>
    ));
    const footer = container.querySelector(`.${styles.footer}`);
    expect(footer?.classList.contains(styles.footerDivider!)).toBe(true);
    cleanup();
  });

  it("suppresses divider when divider={false}", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Footer divider={false}>F</Card.Footer>
      </Card>
    ));
    const footer = container.querySelector(`.${styles.footer}`);
    expect(footer?.classList.contains(styles.footerDivider!)).toBe(false);
    cleanup();
  });

  it("merges consumer class on Card.Footer", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Footer class="custom-footer">F</Card.Footer>
      </Card>
    ));
    expect(container.querySelector(".custom-footer")).not.toBeNull();
    cleanup();
  });
});

describe("Card composition", () => {
  it("renders Header with Title, Description, Action, Body, and Footer in correct DOM structure", () => {
    const { container, cleanup } = mount(() => (
      <Card>
        <Card.Header title="Card Header Tooltip">
          <div>
            <Card.Title as="h2">Monthly Budget</Card.Title>
            <Card.Description>Track your active monthly spending</Card.Description>
          </div>
          <Card.Action>
            <button data-testid="edit-btn">Edit</button>
          </Card.Action>
        </Card.Header>
        <Card.Body>Main budget charts and data</Card.Body>
        <Card.Footer>Last updated: today</Card.Footer>
      </Card>
    ));

    const root = container.firstElementChild!;
    expect(root.children).toHaveLength(3);

    const [headerEl, bodyEl, footerEl] = Array.from(root.children);
    expect(headerEl?.classList.contains(styles.header!)).toBe(true);
    expect(headerEl?.getAttribute("title")).toBe("Card Header Tooltip");
    expect(bodyEl?.classList.contains(styles.body!)).toBe(true);
    expect(footerEl?.classList.contains(styles.footer!)).toBe(true);

    const titleEl = headerEl?.querySelector("h2");
    expect(titleEl).not.toBeNull();
    expect(titleEl?.textContent).toBe("Monthly Budget");

    const descEl = headerEl?.querySelector("p");
    expect(descEl).not.toBeNull();
    expect(descEl?.textContent).toBe("Track your active monthly spending");

    expect(container.querySelector('[data-testid="edit-btn"]')).not.toBeNull();
    expect(container.textContent).toContain("Main budget charts and data");
    expect(container.textContent).toContain("Last updated: today");

    cleanup();
  });
});
