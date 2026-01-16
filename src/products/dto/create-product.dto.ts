import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@Min(50)
	@Max(100)
	@Type(() => Number) // แปลงจาก form-data (string) เป็น number
	price: number;

	@IsOptional()
	@IsString()
	description?: string;
}
