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
// pages/_app.tsx
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { AppProvider, AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import App from "next/app";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "../context/SessionContext";
import "../styles/globals.css";
import BrandLayout from "./layouts/BrandLayout/BrandLayout";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Link from "next/link";
var MyApp = /** @class */ (function (_super) {
    __extends(MyApp, _super);
    function MyApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyApp.getInitialProps = function (appContext) {
        return __awaiter(this, void 0, void 0, function () {
            var appProps, _a, shop, host, idToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, App.getInitialProps(appContext).catch(function (error) {
                            console.error("Error in getInitialProps:", error);
                            return { pageProps: {} };
                        })];
                    case 1:
                        appProps = _b.sent();
                        _a = appContext.ctx.query, shop = _a.shop, host = _a.host, idToken = _a.id_token;
                        return [2 /*return*/, __assign(__assign({}, appProps), { pageProps: __assign(__assign({}, appProps.pageProps), { shop: shop, host: host, idToken: idToken }) })];
                }
            });
        });
    };
    MyApp.prototype.isShopify = function () {
        var _a = this.props.pageProps, shop = _a.shop, host = _a.host;
        return Boolean(shop && shop.length > 0) || Boolean(host && host.length > 0);
    };
    MyApp.prototype.render = function () {
        var _a = this.props, Component = _a.Component, pageProps = _a.pageProps;
        return (<AppProvider i18n={translations}>
        <PolarisProvider i18n={translations}>
          <SessionProvider>
            <ContentWrapper isShopify={this.isShopify()} Component={Component} pageProps={pageProps}/>
          </SessionProvider>
        </PolarisProvider>
      </AppProvider>);
    };
    return MyApp;
}(App));
var ContentWrapper = function (_a) {
    var isShopify = _a.isShopify, Component = _a.Component, pageProps = _a.pageProps;
    var _b = useSession(), session = _b.session, loading = _b.loading;
    var router = useRouter();
    var _c = useState(false), sessionChecked = _c[0], setSessionChecked = _c[1];
    useEffect(function () {
        if (!loading)
            setSessionChecked(true);
    }, [loading]);
    useEffect(function () {
        if (sessionChecked) {
            if (session && router.pathname === "/login") {
                router.replace("/brand/dashboard");
            }
            else if (!session && router.pathname.startsWith("/brand")) {
                router.push("/login");
            }
        }
    }, [sessionChecked, session, router]);
    if (loading || !sessionChecked)
        return <LoadingOverlay />;
    var createLink = function (path) {
        var url = new URL(path, window.location.href);
        if (pageProps.shop)
            url.searchParams.set("shop", pageProps.shop);
        if (pageProps.idToken)
            url.searchParams.set("id_token", pageProps.idToken);
        return url.toString();
    };
    if (isShopify) {
        return (<AppBridgeProvider>
        <PolarisProvider i18n={translations}>
          <ui-nav-menu style={{ display: "none" }}>
            {[
                "/",
                "/brand/dashboard",
                "/brand/campaigns",
                "/brand/support",
                "/brand/referrals",
                "/brand/settings",
                "/brand/payments",
                "/brand/faqs",
            ].map(function (path, index) { return (<Link key={index} href={createLink(path)}>
                {path.split("/").pop()}
              </Link>); })}
          </ui-nav-menu>
          <div className="flex-1 overflow-y-auto">
            <main className="p-12">
              <Component {...pageProps}/>
            </main>
          </div>
        </PolarisProvider>
      </AppBridgeProvider>);
    }
    else if (Component.noLayout) {
        return <Component {...pageProps}/>;
    }
    else {
        var isBrandRoute = router.pathname.startsWith("/brand");
        return isBrandRoute ? (<BrandLayout title={pageProps.title}>
        <Component {...pageProps}/>
      </BrandLayout>) : (<Component {...pageProps}/>);
    }
};
export default MyApp;
