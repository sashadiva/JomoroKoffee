"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const cart_service_1 = require("./cart.service");
const add_cart_item_dto_1 = require("./dto/add-cart-item.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
const swagger_1 = require("@nestjs/swagger");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(req) {
        return this.cartService.getCart(req.user.id);
    }
    addItem(req, body) {
        return this.cartService.addItem(req.user.id, body.productId, body.quantity);
    }
    updateCartItem(req, productId, body) {
        return this.cartService.updateItem(req.user.id, productId, body.quantity);
    }
    deleteCartItem(req, productId) {
        return this.cartService.deleteItem(req.user.id, productId);
    }
    clearCart(req) {
        return this.cartService.clearCart(req.user.id);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Cart data retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Missing or invalid JWT session token.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Item added to cart successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Requested quantity exceeds stock or item already exists.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized token context.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_cart_item_dto_1.AddCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Post)(':productId/update'),
    (0, swagger_1.ApiOkResponse)({ description: 'Cart item quantity updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Quantity exceeds available stock.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - Targeted product is not present in user\'s cart.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Post)(':productId/delete'),
    (0, swagger_1.ApiOkResponse)({ description: 'Item removed from cart successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - Targeted product is not present in user\'s cart.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "deleteCartItem", null);
__decorate([
    (0, common_1.Post)('clear'),
    (0, swagger_1.ApiOkResponse)({ description: 'Cart cleared successfully.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('cart'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map