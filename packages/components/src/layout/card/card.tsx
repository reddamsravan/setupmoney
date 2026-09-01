import { type Component, type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cva, type VariantProps } from "class-variance-authority";
import type { HeadingLevel } from "../../utils/types";
import styles from "./card.module.css";

export const cardVariants = cva(styles.card, {
  variants: {
    variant: {
      default: styles.variantDefault,
      ghost: styles.variantGhost,
    },
    padding: {
      sm: styles.paddingSm,
      md: styles.paddingMd,
      lg: styles.paddingLg,
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

export type CardVariantProps = VariantProps<typeof cardVariants>;

export const cardHeaderVariants = cva(styles.header, {
  variants: {
    divider: {
      true: styles.headerDivider,
      false: "",
    },
  },
  defaultVariants: {
    divider: true,
  },
});

export type CardHeaderVariantProps = VariantProps<typeof cardHeaderVariants>;

export const cardFooterVariants = cva(styles.footer, {
  variants: {
    divider: {
      true: styles.footerDivider,
      false: "",
    },
  },
  defaultVariants: {
    divider: true,
  },
});

export type CardFooterVariantProps = VariantProps<typeof cardFooterVariants>;

/** Props for the root `Card` container. */
export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement>, CardVariantProps {
  /** Inline layout overrides (e.g. `grid-column`, `min-height`). Applied to the root `<div>` only. */
  style?: JSX.CSSProperties;
  children?: JSX.Element;
}

/** Props for `Card.Header`. Container for `Card.Title`, `Card.Description`, and `Card.Action`. */
export interface CardHeaderProps
  extends JSX.HTMLAttributes<HTMLDivElement>, CardHeaderVariantProps {
  children?: JSX.Element;
}

/** Props for `Card.Title`. Renders a semantic heading element with h4-scale typography. */
export interface CardTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  /** Controls the heading element used for the title. Defaults to `"h3"`. */
  as?: HeadingLevel;
  children?: JSX.Element;
  class?: string;
}

/** Props for `Card.Description`. Renders secondary caption text. */
export interface CardDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  children?: JSX.Element;
  class?: string;
}

/** Props for `Card.Action`. Container for header action elements like buttons or badges. */
export interface CardActionProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
  class?: string;
}

/** Props for `Card.Body`. A plain padding wrapper with no imposed layout. */
export interface CardBodyProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
  class?: string;
}

/** Props for `Card.Footer`. A plain padding wrapper with an optional top divider. */
export interface CardFooterProps
  extends JSX.HTMLAttributes<HTMLDivElement>, CardFooterVariantProps {
  children?: JSX.Element;
}

const CardHeader: Component<CardHeaderProps> = (props) => {
  const [local, variantProps, rest] = splitProps(props, ["children", "class"], ["divider"]);

  return (
    <div
      class={cardHeaderVariants({
        divider: variantProps.divider,
        class: local.class,
      })}
      {...rest}
    >
      {local.children}
    </div>
  );
};

const CardTitle: Component<CardTitleProps> = (props) => {
  const [local, rest] = splitProps(props, ["as", "children", "class"]);

  const headingTag = () => local.as ?? "h3";

  return (
    <Dynamic
      component={headingTag()}
      class={[styles.headerTitle, local.class].filter(Boolean).join(" ")}
      {...rest}
    >
      {local.children}
    </Dynamic>
  );
};

const CardDescription: Component<CardDescriptionProps> = (props) => {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <p class={[styles.headerDescription, local.class].filter(Boolean).join(" ")} {...rest}>
      {local.children}
    </p>
  );
};

const CardAction: Component<CardActionProps> = (props) => {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <div class={[styles.headerAction, local.class].filter(Boolean).join(" ")} {...rest}>
      {local.children}
    </div>
  );
};

const CardBody: Component<CardBodyProps> = (props) => {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <div class={[styles.body, local.class].filter(Boolean).join(" ")} {...rest}>
      {local.children}
    </div>
  );
};

const CardFooter: Component<CardFooterProps> = (props) => {
  const [local, variantProps, rest] = splitProps(props, ["children", "class"], ["divider"]);

  return (
    <div
      class={cardFooterVariants({
        divider: variantProps.divider,
        class: local.class,
      })}
      {...rest}
    >
      {local.children}
    </div>
  );
};

const CardRoot: Component<CardProps> = (props) => {
  const [local, variantProps, rest] = splitProps(
    props,
    ["children", "class", "style"],
    ["variant", "padding"],
  );

  return (
    <div
      class={cardVariants({
        variant: variantProps.variant,
        padding: variantProps.padding,
        class: local.class,
      })}
      style={local.style}
      {...rest}
    >
      {local.children}
    </div>
  );
};

/**
 * Compound card component for the setupmoney finance dashboard.
 *
 * Compose with `Card.Header`, `Card.Title`, `Card.Description`, `Card.Action`, `Card.Body`, and `Card.Footer`:
 * ```tsx
 * <Card padding="lg" variant="default">
 *   <Card.Header>
 *     <div>
 *       <Card.Title>Net Worth</Card.Title>
 *       <Card.Description>Across all linked accounts</Card.Description>
 *     </div>
 *     <Card.Action>
 *       <Button size="sm">Export</Button>
 *     </Card.Action>
 *   </Card.Header>
 *   <Card.Body>…</Card.Body>
 *   <Card.Footer>Last updated: today</Card.Footer>
 * </Card>
 * ```
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Body: CardBody,
  Footer: CardFooter,
});
