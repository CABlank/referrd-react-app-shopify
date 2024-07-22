import { useEffect } from "react";

const useBodyStyle = (styles: { [key: string]: string }) => {
  useEffect(() => {
    // Apply the styles on mount
    for (const [key, value] of Object.entries(styles)) {
      (document.body.style as any)[key] = value;
    }

    // Revert the styles on unmount
    return () => {
      for (const key of Object.keys(styles)) {
        (document.body.style as any)[key] = "";
      }
    };
  }, [styles]);
};

export default useBodyStyle;
