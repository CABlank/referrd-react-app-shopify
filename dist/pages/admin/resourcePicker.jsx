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
import { BlockStack, Button, Card, Layout, Page, Text, TextField, Select, } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState } from "react";
import React from "react";
var ResourcePicker = function () {
    var router = useRouter();
    var _a = useState(""), initialQuery = _a[0], setInitialQuery = _a[1];
    var _b = useState(""), resourcePickerSelection = _b[0], setResourcePickerSelection = _b[1];
    var _c = useState("product"), resourceType = _c[0], setResourceType = _c[1]; // New state for resource type
    function openResourcePicker(initQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var selected;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = window === null || window === void 0 ? void 0 : window.shopify) === null || _a === void 0 ? void 0 : _a.resourcePicker({
                            type: resourceType, // Use selected resource type
                            query: initQuery,
                            filter: {
                                hidden: false,
                                variants: true,
                            },
                            action: "select",
                            multiple: true, // Allow multiple selections
                        }))];
                    case 1:
                        selected = _b.sent();
                        if (selected) {
                            setResourcePickerSelection(JSON.stringify(selected, null, 2));
                            setInitialQuery("");
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<>
      <Page title="Resource Picker" subtitle="Use AppBridge CDN to pick products or collections" primaryAction={{
            content: "Docs",
            onAction: function () {
                open("https://shopify.dev/docs/api/app-bridge-library/reference/resource-picker", "_blank");
            },
        }} backAction={{
            onAction: function () {
                router.push("/admin");
            },
        }}>
        <Layout>
          <Layout.Section variant="fullWidth">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">
                  Start typing to search for a product or collection
                </Text>
                <Select label="Select Resource Type" options={[
            { label: "Product", value: "product" },
            { label: "Collection", value: "collection" },
        ]} value={resourceType} onChange={function (value) { return setResourceType(value); }}/>
                <TextField value={initialQuery} onChange={function (value) {
            setInitialQuery(value);
            openResourcePicker(value);
        }} connectedRight={<>
                      <Button variant="primary" onClick={function () {
                openResourcePicker(initialQuery);
            }}>
                        Search
                      </Button>
                    </>}/>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text fontWeight="bold">Selection JSON</Text>
                <pre>{resourcePickerSelection}</pre>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>);
};
export default ResourcePicker;
