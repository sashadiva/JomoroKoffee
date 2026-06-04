import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceProductDto } from './dto/reduce-product.dto';
export declare class ProductManagementController {
    private readonly productService;
    constructor(productService: ProductService);
    createProduct(dto: CreateProductDto): Promise<{
        message: string;
    }>;
    updateProduct(id: number, dto: CreateProductDto): Promise<{
        message: string;
    }>;
    reduceProduct(id: number, dto: ReduceProductDto): Promise<{
        message: string;
    }>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
}
