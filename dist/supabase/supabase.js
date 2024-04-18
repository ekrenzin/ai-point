"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageUrls = exports.storeImageUrls = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = "https://jlkkzxybzwmsagtwacgh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "MISSING KEY";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.supabase = supabase;
function storeImageUrls(images) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = yield supabase.from("category_images").insert(images).select();
        if (error) {
            console.error(error);
            return;
        }
    });
}
exports.storeImageUrls = storeImageUrls;
function getImageUrls(category) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase
            .from("category_images")
            .select("*")
            .eq("category", category);
        if (error) {
            console.error(error);
            return [];
        }
        const images = data;
        if (images.length === 0) {
            return [];
        }
        const formattedImages = images.map((image) => {
            return { url: image.url, category: category };
        });
        return formattedImages;
    });
}
exports.getImageUrls = getImageUrls;
//# sourceMappingURL=supabase.js.map