/**
 * This file defines the custom App component for a Next.js application.
 * It integrates the Shopify Polaris design system, AppBridge provider, and additional global styles.
 *
 * What This File Does:
 * 1. Imports Necessary Modules: It imports required components from Polaris, hooks from React and Next.js, and global styles.
 * 2. Extends JSX Intrinsic Elements: It extends JSX intrinsic elements for custom HTML elements.
 * 3. Defines the Custom App Component: It defines the `MyApp` component which wraps the application with necessary providers.
 * 4. Fetches Initial Props: It defines a static method to fetch initial props for the app.
 * 5. Renders the Component: It renders the Next.js component with pageProps within the providers.
 * 6. Exports the Custom App Component: Finally, it exports the `MyApp` component for use in the application.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import AppBridgeProvider from "../components/providers/AppBridgeProvider"; // Import custom AppBridgeProvider component
import { AppProvider as PolarisProvider } from "@shopify/polaris"; // Import Polaris AppProvider
import "@shopify/polaris/build/esm/styles.css"; // Import Polaris styles
import translations from "@shopify/polaris/locales/en.json"; // Import English translations for Polaris
import Link from "next/link"; // Import Link component from Next.js
import App from "next/app"; // Import App component and types from Next.js
import Head from "next/head"; // Import Head component from Next.js
import React from "react"; // Import React
/**
 * Custom App component for the Next.js application.
 *
 * @class MyApp
 * @extends {App<AppProps>}
 */
var MyApp = /** @class */ (function (_super) {
    __extends(MyApp, _super);
    function MyApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fetches initial props for the App component.
     *
     * @static
     * @async
     * @function getInitialProps
     * @param {AppContext} appContext - The application context.
     * @returns {Promise<any>} The initial props for the app.
     */
    MyApp.getInitialProps = function (appContext) {
        return __awaiter(this, void 0, void 0, function () {
            var appProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, App.getInitialProps(appContext)];
                    case 1:
                        appProps = _a.sent();
                        return [2 /*return*/, __assign({}, appProps)];
                }
            });
        });
    };
    /**
     * Renders the App component.
     *
     * @function render
     * @returns {JSX.Element} The rendered component.
     */
    MyApp.prototype.render = function () {
        var _a = this.props, Component = _a.Component, pageProps = _a.pageProps;
        return (<>
        <Head>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet"/>
        </Head>
        <PolarisProvider i18n={translations}>
          <AppBridgeProvider>
            <ui-nav-menu>
              <Link href="/" rel="home">
                Home
              </Link>
              <Link href="/admin">Debug Cards</Link>
              <Link href="/templates">Templates</Link>
              <Link href="/settings">Settings</Link>
            </ui-nav-menu>
            <Component {...pageProps}/>
          </AppBridgeProvider>
        </PolarisProvider>
      </>);
    };
    return MyApp;
}(App));
export default MyApp; // Export the MyApp component
