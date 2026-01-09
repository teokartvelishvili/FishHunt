import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '@/users/services/users.service';
import { ProductsService } from '@/products/services/products.service';
import { UserDocument } from '@/users/schemas/user.schema';
import { ProductStatus } from '@/products/schemas/product.schema';
import { SlugService } from '@/utils/slug.service';
import { AwsS3Service } from '@/aws-s3/aws-s3.service';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly slugService: SlugService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Get('check-slug')
  @ApiOperation({ summary: 'Check if slug is available and suggest alternatives' })
  @ApiQuery({ name: 'slug', description: 'Slug to check' })
  @ApiResponse({
    status: 200,
    description: 'Slug availability status',
  })
  async checkSlugAvailability(@Query('slug') slug: string) {
    if (!slug || slug.trim().length < 3) {
      return {
        available: false,
        slug: slug,
        suggestedSlug: null,
        message: 'Slug must be at least 3 characters',
      };
    }

    // Check if slug is taken
    const existingUser = await this.usersService.findByStoreSlug(slug);
    
    if (!existingUser) {
      return {
        available: true,
        slug: slug,
        suggestedSlug: slug,
        message: 'Slug is available',
      };
    }

    // Slug is taken, generate a unique alternative
    const suggestedSlug = await this.slugService.generateUniqueSlug(slug);

    return {
      available: false,
      slug: slug,
      suggestedSlug: suggestedSlug,
      message: 'Slug is already taken',
    };
  }

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
      status: ProductStatus.APPROVED, // Only show approved products
    });

    // Get logo URL from S3 if logo path exists
    let logoUrl: string | null = null;
    if (user.storeLogoPath) {
      logoUrl = await this.awsS3Service.getImageByFileId(user.storeLogoPath);
    }

    // Return store data with products
    return {
      store: {
        id: user._id,
        name: user.storeName || user.name,
        slug: user.storeSlug,
        logo: logoUrl,
        address: user.storeAddress,
        owner:
          user.ownerFirstName && user.ownerLastName
            ? `${user.ownerFirstName} ${user.ownerLastName}`
            : user.name,
        createdAt: user.createdAt,
      },
      products,
    };
  }
}
