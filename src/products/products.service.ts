import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
//จำลอง product it สินค้า 20 รายการ
// Mock data 10 products

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Mouse',
      price: 25.99,
      description: 'Ergonomic wireless mouse with long battery life.',
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      price: 79.99,
      description: 'RGB mechanical keyboard with blue switches.',
    },
    {
      id: 3,
      name: 'USB-C Hub',
      price: 39.99,
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.',
    },
    {
      id: 4,
      name: 'External SSD 1TB',
      price: 129.99,
      description: 'High-speed portable SSD for data storage.',
    },
    {
      id: 5,
      name: 'Noise-Cancelling Headphones',
      price: 199.99,
      description: 'Over-ear headphones with active noise cancellation.',
    },
    {
      id: 6,
      name: 'Webcam 1080p',
      price: 49.99,
      description: 'Full HD webcam with built-in microphone.',
    },
    {
      id: 7,
      name: 'Monitor 27-inch 4K',
      price: 349.99,
      description: 'UHD monitor with IPS panel and thin bezels.',
    },
    {
      id: 8,
      name: 'Gaming Chair',
      price: 159.99,
      description: 'Ergonomic gaming chair with lumbar support.',
    },
    {
      id: 9,
      name: 'Smartwatch',
      price: 89.99,
      description: 'Fitness tracker smartwatch with heart rate monitor.',
    },
    {
      id: 10,
      name: 'Portable Bluetooth Speaker',
      price: 59.99,
      description: 'Waterproof portable speaker with rich bass.',
    },
    {
      id: 11,
      name: 'Laptop Stand',
      price: 29.99,
      description: 'Adjustable aluminum laptop stand.',
    },
    {
      id: 12,
      name: 'Graphics Tablet',
      price: 99.99,
      description: 'Digital drawing tablet with pressure-sensitive pen.',
    },
    {
      id: 13,
      name: 'Mesh Wi-Fi System',
      price: 179.99,
      description: 'Whole-home mesh Wi-Fi system, dual-band.',
    },
  ];

  create(createProductDto: CreateProductDto) {
    const nextId = this.products.length
      ? Math.max(...this.products.map((p: Product) => p.id)) + 1
      : 1;
    const product: Product = {
      id: nextId,
      ...(createProductDto as any),
    } as Product;
    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find((p: Product) => p.id === id);
  }

  // ในส่วนของ update และ remove
  update(id: number, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id); // เรียกใช้ findOne ที่เราเขียนไว้แล้ว
    if (!product) return `Product #${id} not found`;

    const idx = this.products.findIndex((p) => p.id === id);
    this.products[idx] = { ...this.products[idx], ...updateProductDto };
    return this.products[idx];
  }

  remove(id: number) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return `Product #${id} not found`;

    const removed = this.products[idx];
    this.products = this.products.filter((p) => p.id !== id);
    return removed;
  }
}
