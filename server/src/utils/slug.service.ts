import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/users/schemas/user.schema';

@Injectable()
export class SlugService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Generate a unique slug for a store
   * @param baseName - The base name to create slug from
   * @param excludeId - User ID to exclude from uniqueness check (for updates)
   */
  async generateUniqueSlug(
    baseName: string,
    excludeId?: string,
  ): Promise<string> {
    // Clean the base name: remove special chars, convert to lowercase, replace spaces with hyphens
    let slug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    // If slug is empty, use a random string
    if (!slug) {
      slug = this.generateRandomSlug();
    }

    let uniqueSlug = slug;
    let counter = 1;

    // Check uniqueness
    while (await this.isSlugTaken(uniqueSlug, excludeId)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;

      // Prevent infinite loop
      if (counter > 1000) {
        uniqueSlug = `${slug}-${Date.now()}`;
        break;
      }
    }

    return uniqueSlug;
  }

  /**
   * Check if a slug is already taken
   */
  private async isSlugTaken(
    slug: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: any = { storeSlug: slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existingUser = await this.userModel.findOne(query);
    return !!existingUser;
  }

  /**
   * Generate a random slug
   */
  private generateRandomSlug(): string {
    return `store-${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Validate slug format
   */
  validateSlug(slug: string): boolean {
    // Slug should contain only lowercase letters, numbers, and hyphens
    // Should not start or end with hyphen
    // Should not have consecutive hyphens
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
  }
}
