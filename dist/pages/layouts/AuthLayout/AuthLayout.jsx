import React, { useMemo } from "react";
import Image from "next/image";
import styles from "./AuthLayout.module.css";
import useBodyStyle from "../../../hooks/useBodyStyle";
import useIsMobile from "../../../hooks/useIsMobile";
import useRedirectOnSession from "../../../hooks/useRedirectOnSession";
var AuthLayout = function (_a) {
    var children = _a.children, title = _a.title, subtitle = _a.subtitle;
    var isMobile = useIsMobile();
    useRedirectOnSession();
    var bodyStyles = useMemo(function () { return ({
        backgroundColor: "#f3f3f3",
        backgroundImage: 'url("/images/first-background-image.svg"), url("/images/second-background-image.svg")',
        backgroundSize: isMobile
            ? "500% auto, 100% auto"
            : "100% auto, 100% auto",
        backgroundPosition: "center top, center bottom",
        backgroundRepeat: "no-repeat, no-repeat",
        height: "100vh",
        margin: "0",
        width: "100vw",
    }); }, [isMobile]);
    useBodyStyle(bodyStyles);
    return (<div className={styles.container}>
      <div className={styles.logo}>
        <Image src="/images/logo.png" alt="Logo" width={150} height={90}/>
      </div>
      <div className={styles.titleBlock}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.formContainer}>{children}</div>
    </div>);
};
export default AuthLayout;
