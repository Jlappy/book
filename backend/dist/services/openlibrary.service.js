"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCoverImageUrl = exports.getWorkDetails = exports.searchBooks = void 0;
const axios_1 = __importDefault(require("axios"));
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
/**
 * Tìm kiếm sách trên OpenLibrary API.
 * @param query Từ khóa tìm kiếm (tiêu đề, tác giả, ISBN).
 * @returns Promise chứa phản hồi từ OpenLibrary.
 */
const searchBooks = async (query) => {
    try {
        const response = await axios_1.default.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, {
            params: { q: query }
        });
        return response.data;
    }
    catch (error) {
        console.error('Lỗi khi gọi OpenLibrary Search API:', error);
        throw new Error('Không thể tìm kiếm sách trên OpenLibrary.');
    }
};
exports.searchBooks = searchBooks;
/**
 * Lấy thông tin chi tiết một tác phẩm từ OpenLibrary Key.
 * Hữu ích nếu bạn muốn lấy thêm mô tả hoặc thông tin chi tiết khác.
 * @param key OpenLibrary key (e.g., /works/OL12345W).
 * @returns Promise chứa dữ liệu chi tiết của tác phẩm.
 */
const getWorkDetails = async (key) => {
    try {
        const response = await axios_1.default.get(`${OPEN_LIBRARY_BASE_URL}${key}.json`);
        return response.data;
    }
    catch (error) {
        console.error(`Lỗi khi lấy chi tiết tác phẩm từ OpenLibrary (${key}):`, error);
        throw new Error('Không thể lấy chi tiết tác phẩm từ OpenLibrary.');
    }
};
exports.getWorkDetails = getWorkDetails;
/**
 * Xây dựng URL hình ảnh bìa từ OpenLibrary cover ID.
 * @param coverId OpenLibrary cover ID (cover_i).
 * @param size Kích thước ảnh ('S', 'M', 'L'). Mặc định 'M'.
 * @returns URL ảnh bìa.
 */
const buildCoverImageUrl = (coverId, size = 'M') => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};
exports.buildCoverImageUrl = buildCoverImageUrl;
