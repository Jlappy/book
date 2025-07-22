import { Request, Response } from 'express';
import * as OpenLibraryService from '../services/openlibrary.service';

/**
 * Controller để tìm kiếm sách trên OpenLibrary.
 * Endpoint: GET /api/openlibrary/search?q=query
 */
export const searchOpenLibraryBooks = async (req: Request, res: Response) => {
    const query = req.query.q as string;

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
    } catch (error: any) {
        console.error('Lỗi trong openlibrary.controller.ts search:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi tìm kiếm sách trên OpenLibrary.' });
    }
};