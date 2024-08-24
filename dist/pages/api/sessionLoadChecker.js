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
import { prisma } from "../../lib/prisma"; // Ensure this is the correct path to your singleton Prisma client
// Function to update tokens in the database
var updateTokens = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var expiresAt, error_1;
    var userId = _b.userId, accessToken = _b.accessToken, refreshToken = _b.refreshToken, expires = _b.expires;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                expiresAt = new Date();
                expiresAt.setSeconds(expiresAt.getSeconds() + expires);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.token.updateMany({
                        where: { userId: userId },
                        data: {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expiresAt: expiresAt,
                            updatedAt: new Date(),
                        },
                    })];
            case 2:
                _c.sent();
                console.log("Updated tokens in Prisma for user:", userId);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.error("Error updating tokens for userId: ".concat(userId), error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
// Function to get the refresh token from the database
var getRefreshToken = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenRecord, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.token.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                tokenRecord = _a.sent();
                if (!tokenRecord) {
                    throw new Error("No token found for the provided userId");
                }
                return [2 /*return*/, tokenRecord.refreshToken];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching refresh token for userId: ".concat(userId), error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
export default (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, apiRequestUserId, accessToken, refreshToken, expires, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 8]);
                if (req.method !== "POST") {
                    return [2 /*return*/, res.status(405).json({ error: "Method not allowed" })];
                }
                _a = req.body, apiRequestUserId = _a.apiRequestUserId, accessToken = _a.accessToken, refreshToken = _a.refreshToken, expires = _a.expires;
                if (!apiRequestUserId || isNaN(apiRequestUserId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid or missing userId" })];
                }
                if (!(accessToken && refreshToken && expires)) return [3 /*break*/, 2];
                return [4 /*yield*/, updateTokens({
                        userId: apiRequestUserId,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expires: expires,
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Tokens updated successfully" })];
            case 2: return [4 /*yield*/, getRefreshToken(apiRequestUserId)];
            case 3:
                token = _b.sent();
                return [2 /*return*/, res.status(200).json({ refreshToken: token })];
            case 4: return [3 /*break*/, 8];
            case 5:
                error_3 = _b.sent();
                console.error("Error handling token update:", error_3);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: error_3.message || "Internal Server Error" })];
            case 6: 
            // Ensure the Prisma client is disconnected after handling the request
            return [4 /*yield*/, prisma.$disconnect()];
            case 7:
                // Ensure the Prisma client is disconnected after handling the request
                _b.sent();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); });
