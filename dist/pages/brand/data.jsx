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
import { Layout, Card, Page, BlockStack, Text, InlineStack, Button, } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
var useDataFetcher = function (initialState, url, options) {
    var _a = useState(initialState), data = _a[0], setData = _a[1];
    var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setData("loading...");
                    return [4 /*yield*/, fetch(url, options)];
                case 1: return [4 /*yield*/, (_a.sent()).json()];
                case 2:
                    result = _a.sent();
                    setData(result.text);
                    return [2 /*return*/];
            }
        });
    }); };
    return [data, fetchData];
};
var DataCard = function (_a) {
    var method = _a.method, url = _a.url, data = _a.data, onRefetch = _a.onRefetch;
    return (<Layout.Section>
    <Card>
      <BlockStack gap="200">
        <Text>
          {method} <code>{url}</code>: {data}
        </Text>
        <InlineStack align="end">
          <Button variant="primary" onClick={onRefetch}>
            Refetch
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  </Layout.Section>);
};
var GetData = function () {
    var router = useRouter();
    var postOptions = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ content: "Body of POST request" }),
    };
    var _a = useDataFetcher("", "/api/shopify"), responseData = _a[0], fetchContent = _a[1];
    var _b = useDataFetcher("", "/api/shopify", postOptions), responseDataPost = _b[0], fetchContentPost = _b[1];
    var _c = useDataFetcher("", "/api/shopify/compliance"), responseDataGQL = _c[0], fetchContentGQL = _c[1];
    useEffect(function () {
        fetchContent();
        fetchContentPost();
        fetchContentGQL();
    }, []);
    return (<Page title="Data Fetching" subtitle="Make an authenticated GET, POST and GraphQL request to the apps backend" backAction={{ onAction: function () { return router.push("/brand"); } }}>
      <Layout>
        <DataCard method="GET" url="/api/apps" data={responseData} onRefetch={fetchContent}/>
        <DataCard method="POST" url="/api/apps" data={responseDataPost} onRefetch={fetchContentPost}/>
        <DataCard method="GET" url="/api/apps/debug/gql" data={responseDataGQL} onRefetch={fetchContentGQL}/>
      </Layout>
    </Page>);
};
export default GetData;
