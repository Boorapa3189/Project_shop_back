// src/products/products.constants.ts

// กำหนดชื่อโฟลเดอร์รูปภาพสินค้า
export const PRODUCT_STORAGE_FOLDER = 'products';

// กำหนดขนาดไฟล์และชนิดไฟล์ที่อนุญาตให้อัปโหลด
export const PRODUCT_IMAGE = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB

    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};