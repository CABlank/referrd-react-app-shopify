// Styles.ts
import { TopBarConfig } from "../../common-components-builder/Types";

export const commonStyle = (config: TopBarConfig): React.CSSProperties => ({
  height: `${config.height}`,
  backgroundColor: config.backgroundColor,
  width: "100%",
});

export const desktopStyle = (config: TopBarConfig): React.CSSProperties => ({
  ...commonStyle(config),
  maxWidth: "100%",
  margin: "0 auto",
  overflowX: "hidden",
  position: "relative",
});

export const mobileStyle = (config: TopBarConfig): React.CSSProperties => ({
  ...commonStyle(config),
  maxWidth: "100%",
  margin: "0 auto",
});
