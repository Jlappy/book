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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchOpenLibraryBooks = void 0;
const OpenLibraryService = __importStar(require("../services/openlibrary.service"));
/**
 * Controller để tìm kiếm sách trên OpenLibrary.
 * Endpoint: GET /api/openlibrary/search?q=query
 */
const searchOpenLibraryBooks = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Tham số tìm kiếm "q" là bắt buộc.' });
    }
    try {
        const results = await OpenLibraryService.searchBooks(query);
        // Bạn có thể xử lý, lọc, hoặc mapping dữ liệu ở đây trước khi gửi về frontend
        // Ví dụ: chỉ gửi về những trường cần thiết
        const mappedResults = results.docs.map(doc => ({
            openLibraryId: doc.key,
            title: doc.title,
            author: doc.author_name || [],
            first_publish_year: doc.first_publish_year,
            isbn: doc.isbn ? doc.isbn[0] : undefined, // Lấy ISBN đầu tiên
            cover: doc.cover_i, // OpenLibrary cover ID
            coverUrl: doc.cover_i ? OpenLibraryService.buildCoverImageUrl(doc.cover_i, 'M') : undefined,
            // Không bao gồm 'price' ở đây vì OpenLibrary không có thông tin giá
        }));
        res.status(200).json(mappedResults);
    }
    catch (error) {
        console.error('Lỗi trong openlibrary.controller.ts search:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi tìm kiếm sách trên OpenLibrary.' });
    }
};
exports.searchOpenLibraryBooks = searchOpenLibraryBooks;
