"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newAnimeHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class NewAnimeHandler {
    _axios;
    _data = { date: "", detail: [] };
    constructor() {
        this._axios = axios_1.default.create({
            baseURL: process.env.NEWANIME_URL,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
            }
        });
    }
    async fetchPage() {
        try {
            const { data } = await this._axios("/");
            return data;
        }
        catch (error) {
            console.log(`* Error NewAnimeHandler fetchPage:`, error);
            return null;
        }
    }
    parseHTML(html) {
        try {
            const $ = cheerio.load(html);
            const date = $("a.table-period_pageTitle_3gjxH").first().text().trim();
            if (this._data.date === date)
                return this._data;
            this._data = { date: date, detail: [] };
            $("h3.table-period_title_2A9Er").each((i, elem) => {
                const detailElem = $(`div.table-period_itemContent_3vfbR`).eq(i);
                const original = detailElem
                    .find("span.source")
                    .text()
                    .replace("라노베", "라이트노벨").trim() || "미정";
                const date = detailElem.find("span.date").text() || "미정";
                const studio = detailElem.find("span.studio").text() || "미정";
                this._data.detail.push({
                    title: $(elem).text().trim(),
                    studio,
                    original,
                    date,
                });
            });
            return this._data;
        }
        catch (error) {
            console.log(`* Error NewAnimeHandler parseHTML:`, error);
            return this._data;
        }
    }
}
exports.newAnimeHandler = new NewAnimeHandler();
