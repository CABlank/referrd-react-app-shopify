/**
 * This file defines an AppBridgeProvider component for a Shopify app.
 * It ensures that the shop domain is available and provides the Polaris AppProvider with necessary translations.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required modules from React and Polaris.
 * 2. Defines Component Props Interface: It defines an interface for the component props.
 * 3. Sets Up Shop State: It sets up a state to store the shop domain.
 * 4. Extracts Shop from URL: It uses an effect to extract the shop domain from the URL query parameters.
 * 5. Provides Polaris AppProvider: It provides the Polaris AppProvider with translations and renders the children.
 * 6. Exports the Component: Finally, it exports the AppBridgeProvider component for use in the application.
 */
import React, { useEffect, useState } from "react"; // Import necessary modules from React
import { AppProvider as PolarisAppProvider } from "@shopify/polaris"; // Import Polaris AppProvider
import enPolarisTranslations from "@shopify/polaris/locales/en.json"; // Import Polaris translations
/**
 * AppBridgeProvider component for a Shopify app.
 *
 * @function AppBridgeProvider
 * @param {AppBridgeProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
var AppBridgeProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), shop = _b[0], setShop = _b[1]; // Set up state to store the shop domain
    useEffect(function () {
        if (typeof window !== "undefined") {
            var params = new URLSearchParams(window.location.search);
            var shopParam = params.get("shop");
            setShop(shopParam || null); // Extract shop domain from URL query parameters
        }
    }, []); // Empty dependency array to run only once on mount
    if (!shop) {
        return <p>No Shop Provided</p>; // Render message if shop domain is not provided
    }
    return (<PolarisAppProvider i18n={enPolarisTranslations}>
      {children}{" "}
      {/* Provide Polaris AppProvider with translations and render children */}
    </PolarisAppProvider>);
};
export default AppBridgeProvider; // Export the component
