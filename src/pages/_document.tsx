import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const { shop, host } = ctx.query;
    return { ...initialProps, shop, host };
  }

  render() {
    const { shop, host } = this.props as any;

    return (
      <Html lang="en">
        <Head>
          {shop && host && (
            // Shopify App Bridge script should be directly inserted as the first script
            // eslint-disable-next-line @next/next/no-sync-scripts
            <script
              src={`https://cdn.shopify.com/shopifycloud/app-bridge.js?apiKey=${process.env.CONFIG_SHOPIFY_API_KEY}`}
              // This must be the first script and should not have async or defer attributes
            />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
