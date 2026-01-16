import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, Max } from 'class-validator';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@Min(50)
	@Max(100)
	price: number;

	@IsOptional()
	@IsString()
	description?: string;
}
