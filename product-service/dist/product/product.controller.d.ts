import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceProductDto } from './dto/reduce-product.dto';
export declare class ProductController {
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
    getProducts(): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            name: string;
            id: number;
            created_at: Date;
            updated_at: Date;
        } & {};
    } & {
        name: string;
        description: string | null;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
        created_at: Date;
        updated_at: Date;
    } & {})[]>;
    getProductById(id: number): Promise<{
        category: {
            name: string;
            id: number;
            created_at: Date;
            updated_at: Date;
        } & {};
    } & {
        name: string;
        description: string | null;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
        created_at: Date;
        updated_at: Date;
    } & {}>;
    getCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        name: string;
        id: number;
        created_at: Date;
        updated_at: Date;
    } & {})[]>;
    getProductsByCategory(categoryId: number): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            name: string;
            id: number;
            created_at: Date;
            updated_at: Date;
        } & {};
    } & {
        name: string;
        description: string | null;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
        created_at: Date;
        updated_at: Date;
    } & {})[]>;
}
