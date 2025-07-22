import axios from 'axios';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

export interface IOpenLibrarySearchResult {
    key: string; 
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    isbn?: string[];
    publisher?: string[];
    cover_i?: number;
}

export interface IOpenLibrarySearchResponse {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    docs: IOpenLibrarySearchResult[];
    q: string;
    offset: number | null;
}

/**
 * Tìm kiếm sách trên OpenLibrary API.
 * @param query Từ khóa tìm kiếm (tiêu đề, tác giả, ISBN).
 * @returns Promise chứa phản hồi từ OpenLibrary.
 */
export const searchBooks = async (query: string): Promise<IOpenLibrarySearchResponse> => {
    try {
        const response = await axios.get<IOpenLibrarySearchResponse>(
            `${OPEN_LIBRARY_BASE_URL}/search.json`,
            {
                params: { q: query }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi OpenLibrary Search API:', error);
        throw new Error('Không thể tìm kiếm sách trên OpenLibrary.');
    }
};

/**
 * Lấy thông tin chi tiết một tác phẩm từ OpenLibrary Key.
 * Hữu ích nếu bạn muốn lấy thêm mô tả hoặc thông tin chi tiết khác.
 * @param key OpenLibrary key (e.g., /works/OL12345W).
 * @returns Promise chứa dữ liệu chi tiết của tác phẩm.
 */
export const getWorkDetails = async (key: string): Promise<any> => {
    try {
        const response = await axios.get(`${OPEN_LIBRARY_BASE_URL}${key}.json`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết tác phẩm từ OpenLibrary (${key}):`, error);
        throw new Error('Không thể lấy chi tiết tác phẩm từ OpenLibrary.');
    }
};

/**
 * Xây dựng URL hình ảnh bìa từ OpenLibrary cover ID.
 * @param coverId OpenLibrary cover ID (cover_i).
 * @param size Kích thước ảnh ('S', 'M', 'L'). Mặc định 'M'.
 * @returns URL ảnh bìa.
 */
export const buildCoverImageUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M'): string => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};