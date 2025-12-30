import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from '@/users/services/users.service';
import { ProductsService } from '@/products/services/products.service';
import { UserDocument } from '@/users/schemas/user.schema';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get store by slug with products' })
  @ApiParam({ name: 'slug', description: 'Store slug' })
  @ApiResponse({
    status: 200,
    description: 'Store data with products',
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStoreBySlug(
    @Param('slug') slug: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    // Find user by slug
    const user = await this.usersService.findByStoreSlug(slug);
    if (!user) {
      throw new NotFoundException('Store not found');
    }

    // Get products for this seller
    const products = await this.productsService.findMany({
      user: user,
      page,
      limit,
      status: 'APPROVED', // Only show approved products
    });

    // Return store data with products
    return {
      store: {
        id: user._id,
        name: user.storeName || user.name,
        slug: user.storeSlug,
        logo: user.storeLogoPath,
        address: user.storeAddress,
        owner: user.ownerFirstName && user.ownerLastName
          ? `${user.ownerFirstName} ${user.ownerLastName}`
          : user.name,
        description: user.storeDescription, // Add this field if needed
        createdAt: user.createdAt,
      },
      products,
    };
  }
}