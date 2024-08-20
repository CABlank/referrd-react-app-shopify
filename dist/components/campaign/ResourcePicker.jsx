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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { BlockStack, Button, Text, TextField } from "@shopify/polaris";
import { useState } from "react";
import React from "react";
var ResourcePicker = function (_a) {
    var initialQuery = _a.initialQuery, resourceType = _a.resourceType, onSelection = _a.onSelection, selectedResources = _a.selectedResources;
    var _b = useState(initialQuery), query = _b[0], setQuery = _b[1];
    var _c = useState(selectedResources), selection = _c[0], setSelection = _c[1];
    function openResourcePicker(initQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var selected, newSelection;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = window === null || window === void 0 ? void 0 : window.shopify) === null || _a === void 0 ? void 0 : _a.resourcePicker({
                            type: resourceType,
                            query: initQuery,
                            filter: {
                                hidden: false,
                                variants: true,
                            },
                            action: "select",
                            multiple: true,
                            initialSelectionIds: selection.map(function (item) { return ({ id: item.id }); }),
                        }))];
                    case 1:
                        selected = _b.sent();
                        if (selected) {
                            newSelection = __spreadArray(__spreadArray([], selection, true), selected.filter(function (item) {
                                return !selection.some(function (selectedItem) { return selectedItem.id === item.id; });
                            }), true);
                            setSelection(newSelection);
                            setQuery("");
                            onSelection(newSelection);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    var removeSelection = function (id) {
        var newSelection = selection.filter(function (item) { return item.id !== id; });
        setSelection(newSelection);
        onSelection(newSelection);
    };
    return (<>
      <BlockStack gap="200">
        <Text variant="headingMd" as="dd">
          Start typing to search for a product or collection
        </Text>
        <TextField label="" autoComplete="off" value={query} onChange={function (value) {
            setQuery(value);
        }} connectedRight={<>
              <Button variant="primary" onClick={function () {
                openResourcePicker(query);
            }}>
                Search
              </Button>
            </>}/>
        <div className="space-y-4 mt-4">
          {selection.slice(0, 3).map(function (item, index) { return (<div key={index} className="flex items-center space-x-4">
              <div className="w-16 h-16 overflow-hidden border rounded">
                {item.images && item.images.length > 0 ? (<img src={item.images[0].originalSrc} alt={item.title} className="object-cover w-full h-full"/>) : (<div className="flex items-center justify-center w-full h-full bg-gray-200">
                    No Image
                  </div>)}
              </div>
              <span className="truncate w-40" title={item.title}>
                {item.title}
              </span>
              <Button onClick={function () { return removeSelection(item.id); }}>Remove</Button>
            </div>); })}
          {selection.length > 3 && (<Text variant="bodyMd" as="p">
              <p className="text-center">And {selection.length - 3} more...</p>
            </Text>)}
        </div>
      </BlockStack>
    </>);
};
export default ResourcePicker;
