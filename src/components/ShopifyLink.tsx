import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import React from "react";
import { UrlObject } from "url";

interface ShopifyLinkProps extends LinkProps {
  children: React.ReactNode;
}

const ShopifyLink: React.FC<ShopifyLinkProps> = ({ children, ...props }) => {
  const router = useRouter();
  const { shop, host } = router.query;

  // Create a new href with the query parameters
  const hrefWithParams =
    typeof props.href === "string"
      ? { pathname: props.href, query: { shop, host } }
      : {
          ...props.href,
          query: {
            ...(props.href &&
              typeof props.href === "object" &&
              ((props.href as UrlObject).query as object)),
            shop,
            host,
          },
        };

  return (
    <Link {...props} href={hrefWithParams}>
      {children}
    </Link>
  );
};

export default ShopifyLink;
