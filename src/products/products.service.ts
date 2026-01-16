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
  // Inject Product Model เข้ามาใช้งาน โดยเก็บไว้ในตัวแปรชื่อ productModel
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  // -------------------------------------------------------
  // -------------------------------------------------------
  // -------------------------------------------------------

  private toPublicImagePath(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/'); // กัน Windows path
    // ตัด 'uploads/' หรือ './uploads/' ออกให้หมด
    return normalized.replace(/^\.?\/?uploads\//, '').replace(/^uploads\//, '');
  }

  // --- สร้างสินค้า (Create) ---
  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const diskPath = file?.path?.replace(/\\/g, '/'); // เช่น uploads/products/uuid.jpg
    const imageUrl = diskPath ? this.toPublicImagePath(diskPath) : undefined; // products/uuid.jpg

    try {
      return await this.productModel.create({
        ...dto,
        ...(imageUrl ? { imageUrl } : {}),
      });
    } catch (err) {
      if (diskPath) await safeUnlinkByRelativePath(diskPath); // ลบ “disk path” เท่านั้น
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
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
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
