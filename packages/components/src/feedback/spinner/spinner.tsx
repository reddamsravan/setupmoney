import { splitProps, type Component, type JSX } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./spinner.module.css";

export const spinnerVariants = cva(styles.spinner, {
  variants: {
    size: {
      inherit: styles.sizeInherit,
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    size: "inherit",
  },
});

export type SpinnerVariantProps = VariantProps<typeof spinnerVariants>;

export interface SpinnerProps extends JSX.SvgSVGAttributes<SVGSVGElement>, SpinnerVariantProps {
  label?: string;
  strokeWidth?: number | string;
}

export const Spinner: Component<SpinnerProps> = (props) => {
  const [local, variantProps, rest] = splitProps(
    props,
    ["label", "strokeWidth", "class", "classList", "role", "aria-label", "aria-hidden"],
    ["size"],
  );

  const isAccessible = () => Boolean(local["aria-label"] || local.role === "status");

  const svgElement = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={local.strokeWidth ?? 2}
      stroke-linecap="round"
      stroke-linejoin="round"
      role={local.role ?? (local["aria-label"] ? "status" : undefined)}
      aria-label={local["aria-label"]}
      aria-hidden={
        local["aria-hidden"] !== undefined
          ? local["aria-hidden"]
          : isAccessible() || local.label
            ? local.label
              ? "true"
              : undefined
            : "true"
      }
      class={spinnerVariants({
        size: variantProps.size,
        class: local.class,
      })}
      classList={local.classList}
      {...rest}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );

  return local.label ? (
    <span role="status" class={styles.statusWrapper}>
      {svgElement}
      <span class={styles.srOnly}>{local.label}</span>
    </span>
  ) : (
    svgElement
  );
};
