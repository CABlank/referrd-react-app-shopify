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
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
export var updateTokens = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var expiresAt, error_1;
    var PrismaUserId = _b.PrismaUserId, accessToken = _b.accessToken, refreshToken = _b.refreshToken, expires = _b.expires;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                expiresAt = new Date();
                expiresAt.setSeconds(expiresAt.getSeconds() + expires);
                return [4 /*yield*/, prisma.token.updateMany({
                        where: {
                            userId: PrismaUserId,
                        },
                        data: {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expiresAt: expiresAt,
                            updatedAt: new Date(),
                        },
                    })];
            case 1:
                _c.sent();
                console.log("Updated tokens in Prisma for user:", PrismaUserId);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error("Error updating tokens in Prisma:", error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
export default (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, PrismaUserId, accessToken, refreshToken, expires, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(req.method === "POST")) return [3 /*break*/, 5];
                _a = req.body, PrismaUserId = _a.PrismaUserId, accessToken = _a.accessToken, refreshToken = _a.refreshToken, expires = _a.expires;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, updateTokens({ PrismaUserId: PrismaUserId, accessToken: accessToken, refreshToken: refreshToken, expires: expires })];
            case 2:
                _b.sent();
                res.status(200).json({ message: "Tokens updated successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error("Error updating tokens:", error_2);
                res.status(500).json({ error: "Failed to update tokens" });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(405).json({ error: "Method not allowed" });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
