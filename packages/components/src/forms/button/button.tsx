import { splitProps, type Component, type JSX } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "../../feedback/spinner";
import styles from "./button.module.css";

export const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      danger: styles.danger,
      ghost: styles.ghost,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
    fullWidth: {
      true: styles.fullWidth,
    },
    iconOnly: {
      true: styles.iconOnly,
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  loading?: boolean;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
}

export const Button: Component<ButtonProps> = (props) => {
  const [local, variantProps, rest] = splitProps(
    props,
    [
      "type",
      "disabled",
      "loading",
      "leadingIcon",
      "trailingIcon",
      "children",
      "class",
      "classList",
    ],
    ["variant", "size", "fullWidth", "iconOnly"],
  );

  const isDisabled = () => local.disabled || local.loading;

  return (
    <button
      type={local.type ?? "button"}
      disabled={isDisabled()}
      aria-busy={local.loading ? "true" : undefined}
      class={buttonVariants({
        variant: variantProps.variant,
        size: variantProps.size,
        fullWidth: variantProps.fullWidth,
        iconOnly: variantProps.iconOnly,
        class: local.class,
      })}
      classList={local.classList}
      {...rest}
    >
      {local.loading ? (
        <Spinner size="inherit" />
      ) : (
        local.leadingIcon && <span class={styles.iconSlot}>{local.leadingIcon}</span>
      )}
      {local.children}
      {!local.loading && local.trailingIcon && (
        <span class={styles.iconSlot}>{local.trailingIcon}</span>
      )}
    </button>
  );
};
