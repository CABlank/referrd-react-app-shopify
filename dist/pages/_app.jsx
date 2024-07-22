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
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import App from "next/app";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "../contexts/SessionContext";
import "../styles/globals.css";
import BrandLayout from "./layouts/BrandLayout";
import LoadingOverlay from "../components/common/LoadingOverlay";
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
            var appProps, ctx, _a, shop, host, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, App.getInitialProps(appContext)];
                    case 1:
                        appProps = _b.sent();
                        ctx = appContext.ctx;
                        _a = ctx.query, shop = _a.shop, host = _a.host;
                        return [2 /*return*/, __assign(__assign({}, appProps), { pageProps: __assign(__assign({}, appProps.pageProps), { shop: shop, host: host }) })];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Error in getInitialProps:", error_1);
                        return [2 /*return*/, { pageProps: {} }]; // Return an empty pageProps object to avoid breaking the app
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if the app is running inside Shopify.
     *
     * @function isShopify
     * @returns {boolean} True if running inside Shopify, false otherwise.
     */
    MyApp.prototype.isShopify = function () {
        var pageProps = this.props.pageProps;
        // Ensure both 'shop' and 'host' are string types to avoid falsy values such as empty strings
        return ((typeof pageProps.shop === "string" && pageProps.shop.length > 0) ||
            (typeof pageProps.host === "string" && pageProps.host.length > 0));
    };
    /**
     * Renders the App component.
     *
     * @function render
     * @returns {JSX.Element} The rendered component.
     */
    MyApp.prototype.render = function () {
        var _a = this.props, Component = _a.Component, pageProps = _a.pageProps;
        var isShopify = this.isShopify();
        return (<SessionProvider>
        <ContentWrapper isShopify={isShopify} Component={Component} pageProps={pageProps}/>
      </SessionProvider>);
    };
    return MyApp;
}(App));
var ContentWrapper = function (_a) {
    var isShopify = _a.isShopify, Component = _a.Component, pageProps = _a.pageProps;
    var _b = useSession(), session = _b.session, loading = _b.loading;
    var _c = useState(false), isAuthenticated = _c[0], setIsAuthenticated = _c[1];
    var _d = useState(false), pageLoading = _d[0], setPageLoading = _d[1];
    var router = useRouter();
    useEffect(function () {
        var handleStart = function () { return setPageLoading(true); };
        var handleComplete = function () { return setPageLoading(false); };
        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);
        return function () {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router]);
    useEffect(function () {
        if (!loading && session && session.user.role === "Brand") {
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
        }
    }, [loading, session]);
    if (loading || pageLoading) {
        return <LoadingOverlay />;
    }
    if (isShopify) {
        return (<PolarisProvider i18n={translations}>
        <AppBridgeProvider>
          <ui-nav-menu>
            <Link href="/" rel="home">
              Home
            </Link>
            <Link href="/brand/dashboard">Dashboard</Link>
            <Link href="/brand/campaigns">Campaigns</Link>
            <Link href="/brand/support">Support</Link>
            <Link href="/brand/referrals">Referrals</Link>
            <Link href="/brand/settings">Settings</Link>
            <Link href="/brand/payments">Payments</Link>
            <Link href="/brand/faqs">FAQS</Link>
          </ui-nav-menu>
          <div className="flex-1 overflow-y-auto">
            <main className="p-12">
              <Component {...pageProps}/>
            </main>
          </div>
        </AppBridgeProvider>
      </PolarisProvider>);
    }
    else if (Component.noLayout) {
        // If the page has noLayout property, render the component directly
        return <Component {...pageProps}/>;
    }
    else {
        return isAuthenticated ? (<BrandLayout>
        <Component {...pageProps}/>
      </BrandLayout>) : (<Component {...pageProps}/>);
    }
};
export default MyApp;
