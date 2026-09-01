/**
 * Constrained union of HTML heading tag names and `span`, used to configure
 * the rendered heading element of compound sub-components such as Card.Header.
 *
 * All future components that need a configurable heading element SHALL import
 * HeadingLevel from this file.
 */
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
