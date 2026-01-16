// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { safeUnlinkByRelativePath } from '../common/utils/file.utils';
import type { Express } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  // เปลี่ยน path เป็นแบบ public ที่ FE เรียกได้
  // ex: uploads/products/uuid.jpg -> products/uuid.jpg
  private toPublicImagePath(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/');
    return normalized
      .replace(/^\.?\/?uploads\//, '')
      .replace(/^uploads\//, '');
  }

  // --- สร้างสินค้า (Create) ---
  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    // diskPath: path จริงบนดิสก์ (ใช้สำหรับลบไฟล์หาก DB error)
    const diskPath = file?.path?.replace(/\\/g, '/'); // เช่น ./uploads/products/uuid.jpg
    // image: path สำหรับเก็บใน DB (ไว้ทำ URL ฝั่ง FE)
    const image = diskPath ? this.toPublicImagePath(diskPath) : undefined; // products/uuid.jpg

    // แปลงค่า dto ให้พร้อมบันทึก (เพราะ form-data ส่งเป็น string)
    const payload: any = { ...dto };
    if (payload.price !== undefined && payload.price !== null && payload.price !== '') {
      payload.price = Number(payload.price);
    }

    try {
      return await this.productModel.create({
        ...payload,
        ...(image ? { image } : {}), // ใช้ field "image" ให้ตรงกับ Product entity ที่ทำไว้
      });
    } catch (err) {
      // log เพื่อดูสาเหตุจริงใน terminal
      console.error('Create product error:', err);

      // ถ้าอัปโหลดไฟล์มาแล้ว แต่บันทึก DB ไม่สำเร็จ -> ลบไฟล์ทิ้ง
      if (diskPath) await safeUnlinkByRelativePath(diskPath);

      throw new InternalServerErrorException('Create product failed');
    }
  }

  // --- ดึงข้อมูลทั้งหมด (Read All) ---
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // --- ดึงข้อมูลรายตัว (Read One) ---
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // --- แก้ไขข้อมูล (Update) ---
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const payload: any = { ...updateProductDto };
    if (payload.price !== undefined && payload.price !== null && payload.price !== '') {
      payload.price = Number(payload.price);
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  // --- ลบข้อมูล (Delete) ---
  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return deletedProduct;
  }
}
