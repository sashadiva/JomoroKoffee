import { ProductService } from './product.service';
export declare class ProductCatalogController {
    private readonly productService;
    constructor(productService: ProductService);
    getProducts(): import(".prisma/client").Prisma.PrismaPromise<({
        categories: {
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
        categories: {
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
        categories: {
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
