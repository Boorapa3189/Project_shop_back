import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { PRODUCT_IMAGE } from './products.constants';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  // ของเดิมที่ไม่ได้แก้ไข
  // @Post()
  // create(@Body() createProductDto: CreateProductDto) {
  //   return this.productsService.create(createProductDto);
  // }

  // สร้างสินค้า (Create) แบบมีไฟล์แนบ
  @Post()
  @UseInterceptors(FileInterceptor('image')) // ชื่อฟิลด์ที่รับไฟล์จาก form-data “image”
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: PRODUCT_IMAGE.MAX_SIZE })
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.productsService.create(dto, file);
  }


  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- code ที่ปรับแก้ไขให้สอดคล้องกับ service
  // ลบ + ออกเนื่องจากกำหนดให้เป็น String

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

}
