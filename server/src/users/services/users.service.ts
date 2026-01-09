import { Model, Types, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { User, UserDocument } from '../schemas/user.schema';
import { hashPassword } from '@/utils/password';
import { generateUsers } from '@/utils/seed-users';
import { PaginatedResponse } from '@/types';
import { Role } from '@/types/role.enum';
import { SellerRegisterDto } from '../dtos/seller-register.dto';
import { AdminProfileDto } from '../dtos/admin.profile.dto';
import { AwsS3Service } from '@/aws-s3/aws-s3.service';
import { SlugService } from '@/utils/slug.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly awsS3Service: AwsS3Service,
    private readonly slugService: SlugService,
  ) {}

  async findByEmail(email: string) {
    // Convert to lowercase to ensure case-insensitive matching
    const lowercaseEmail = email.toLowerCase();
    return this.userModel.findOne({ email: lowercaseEmail }).exec();
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    try {
      const existingUser = await this.findByEmail(
        user.email?.toLowerCase() ?? '',
      );

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await hashPassword(user.password ?? '');

      // Store email in lowercase
      return await this.userModel.create({
        ...user,
        email: user.email?.toLowerCase(),
        password: hashedPassword,
        role: user.role ?? Role.User,
      });
    } catch (error: any) {
      this.logger.error(`Failed to create user: ${error.message}`);

      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Failed to create user');
    }
  }

  async createSeller(
    dto: SellerRegisterDto,
    logoFile?: Express.Multer.File,
  ): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel.findOne({ email: dto.email });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      let logoPath: string | undefined;
      if (logoFile) {
        this.logger.log('Logo file received:', {
          originalname: logoFile.originalname,
          size: logoFile.size,
          mimetype: logoFile.mimetype,
        });
        // Upload logo to AWS S3
        try {
          logoPath = await this.awsS3Service.uploadImage(
            logoFile.originalname,
            logoFile.buffer,
          );
          this.logger.log('Logo uploaded successfully, path:', logoPath);
        } catch (error) {
          this.logger.error('Failed to upload logo:', error);
          // Continue without logo if upload fails
        }
      } else {
        this.logger.log('No logo file provided');
      }

      // Generate unique slug for the store
      // If user provided a storeSlug, validate and use it, otherwise generate from storeName
      let storeSlug: string;
      if (dto.storeSlug && dto.storeSlug.trim()) {
        // Validate and ensure uniqueness of user-provided slug
        storeSlug = await this.slugService.generateUniqueSlug(dto.storeSlug);
      } else {
        storeSlug = await this.slugService.generateUniqueSlug(dto.storeName);
      }

      const sellerData = {
        ...dto,
        name: dto.storeName,
        role: Role.Seller,
        password: dto.password,
        storeLogoPath: logoPath, // Add logo path to seller data
        storeSlug, // Add generated slug
      };

      return await this.create(sellerData);
    } catch (error: any) {
      this.logger.error(`Failed to create seller: ${error.message}`);
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async createMany(users: Partial<User>[]): Promise<UserDocument[]> {
    try {
      const usersWithLowercaseEmails = users.map((user) => ({
        ...user,
        email: user.email?.toLowerCase(),
      }));
      return (await this.userModel.insertMany(
        usersWithLowercaseEmails,
      )) as unknown as UserDocument[];
    } catch (error: any) {
      this.logger.error(`Failed to create users: ${error.message}`);
      throw new BadRequestException('Failed to create users');
    }
  }

  async findOne(email: string): Promise<UserDocument | null> {
    return this.findByEmail(email);
  }

  async findById(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByStoreSlug(slug: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ storeSlug: slug, role: Role.Seller });
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<UserDocument>> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments({}),
    ]);

    return {
      items: users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async deleteOne(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const result = await this.userModel.findOneAndDelete({ _id: id });
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async update(
    id: string,
    attrs: Partial<User>,
    adminRole = false,
  ): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Only validate email if it's being updated
    if (attrs.email && attrs.email !== user.email) {
      attrs.email = attrs.email.toLowerCase();

      const existingUser = await this.findByEmail(attrs.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new BadRequestException('Email is already in use');
      }
    }

    // Handle password update if provided
    if (attrs.password && !adminRole) {
      const passwordMatch = await bcrypt.compare(attrs.password, user.password);
      if (passwordMatch) {
        throw new BadRequestException(
          'New password must be different from the current password',
        );
      }
      attrs.password = await hashPassword(attrs.password);
    }

    // Handle storeSlug validation for sellers
    if (attrs.storeSlug && user.role === Role.Seller) {
      // Validate slug format
      if (!this.slugService.validateSlug(attrs.storeSlug)) {
        throw new BadRequestException(
          'Store slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen',
        );
      }

      // Check uniqueness (exclude current user)
      const existingSlugUser = await this.userModel.findOne({
        storeSlug: attrs.storeSlug,
        _id: { $ne: id },
      });

      if (existingSlugUser) {
        throw new BadRequestException('This store slug is already taken');
      }
    }

    // Prepare update data, filter out undefined values

    // Prevent role changes unless admin
    if (!adminRole) delete attrs.role;

    // Filter out undefined values to ensure only provided fields are updated
    Object.keys(attrs).forEach((key) => {
      if (attrs[key] === undefined) {
        delete attrs[key];
      }
    });

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: attrs },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      this.logger.log(`User ${id} updated successfully`);
      return updatedUser;
    } catch (error: any) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to update user');
    }
  }

  async adminUpdate(id: string, updateDto: AdminProfileDto) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Convert email to lowercase if provided
      if (updateDto.email) {
        updateDto.email = updateDto.email.toLowerCase();

        // Check if the email is already in use by another user
        const existingUser = await this.findByEmail(updateDto.email);
        if (existingUser && existingUser._id.toString() !== id) {
          throw new ConflictException('Email already exists');
        }
      }

      // Update fields only if they are provided
      if (updateDto.name) user.name = updateDto.name;
      if (updateDto.email) user.email = updateDto.email;
      if (updateDto.role) user.role = updateDto.role;

      // Seller specific fields
      if (updateDto.storeName !== undefined)
        user.storeName = updateDto.storeName;
      if (updateDto.storeAddress !== undefined)
        user.storeAddress = updateDto.storeAddress;
      if (updateDto.ownerFirstName !== undefined)
        user.ownerFirstName = updateDto.ownerFirstName;
      if (updateDto.ownerLastName !== undefined)
        user.ownerLastName = updateDto.ownerLastName;
      if (updateDto.phoneNumber !== undefined)
        user.phoneNumber = updateDto.phoneNumber;
      if (updateDto.identificationNumber !== undefined)
        user.identificationNumber = updateDto.identificationNumber;
      if (updateDto.accountNumber !== undefined)
        user.accountNumber = updateDto.accountNumber;

      // Only hash and update password if it's provided and not empty
      if (updateDto.password && updateDto.password.trim() !== '') {
        this.logger.log('Updating password for user', id);
        user.password = await hashPassword(updateDto.password);
      }

      await user.save();
      return user;
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }

  async deleteMany(): Promise<void> {
    try {
      await this.userModel.deleteMany({});
      this.logger.log('All users deleted successfully');
    } catch (error: any) {
      this.logger.error(`Failed to delete users: ${error.message}`);
      throw new BadRequestException('Failed to delete users');
    }
  }

  async generateUsers(count: number): Promise<UserDocument[]> {
    const generatedUsers = await generateUsers(count);
    return this.createMany(generatedUsers);
  }

  async updateProfileImage(
    userId: string,
    filePath: string,
    fileBuffer: Buffer,
  ) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Delete old image if it exists
      if (user.profileImagePath) {
        try {
          await this.awsS3Service.deleteImageByFileId(
            user.profileImagePath as string,
          );
        } catch (error) {
          console.error('Failed to delete old profile image', error);
          // Continue even if deletion fails
        }
      }

      // Upload new image
      const profileImagePath = await this.awsS3Service.uploadImage(
        filePath,
        fileBuffer,
      );

      // Update user record
      await this.userModel.findByIdAndUpdate(userId, { profileImagePath });

      // Get image URL
      const imageUrl =
        await this.awsS3Service.getImageByFileId(profileImagePath);

      return {
        message: 'Profile image updated successfully',
        profileImage: imageUrl,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to update profile image. Please try again.',
      );
    }
  }

  async updateStoreLogo(userId: string, filePath: string, fileBuffer: Buffer) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Delete old logo if it exists
      if (user.storeLogoPath) {
        try {
          await this.awsS3Service.deleteImageByFileId(
            user.storeLogoPath as string,
          );
        } catch (error) {
          console.error('Failed to delete old store logo', error);
          // Continue even if deletion fails
        }
      }

      // Upload new logo
      const storeLogoPath = await this.awsS3Service.uploadImage(
        filePath,
        fileBuffer,
      );

      // Update user record
      await this.userModel.findByIdAndUpdate(userId, { storeLogoPath });

      // Get logo URL
      const logoUrl = await this.awsS3Service.getImageByFileId(storeLogoPath);

      return {
        message: 'Store logo updated successfully',
        storeLogo: logoUrl,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to update store logo. Please try again.',
      );
    }
  }

  async uploadImage(filePath: string, fileBuffer: Buffer): Promise<string> {
    try {
      return await this.awsS3Service.uploadImage(filePath, fileBuffer);
    } catch (error) {
      this.logger.error(`Failed to upload image: ${error.message}`);
      throw new BadRequestException('Failed to upload image: ' + error.message);
    }
  }

  async getProfileData(userId: string) {
    const user = await this.userModel.findById(userId, { password: 0 });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log('User object from database:', user.toObject()); // Debug log

    // Get profile image URL if it exists
    let profileImage = null;
    if (user.profileImagePath) {
      profileImage = await this.awsS3Service.getImageByFileId(
        user.profileImagePath as string,
      );
    }

    // Get store logo URL if it exists
    let storeLogo = null;
    if (user.storeLogoPath) {
      storeLogo = await this.awsS3Service.getImageByFileId(
        user.storeLogoPath as string,
      );
    }

    const result = {
      ...user.toObject(),
      profileImage,
      storeLogo,
    };

    console.log('Profile data result:', result); // Debug log

    return result;
  }

  async getProfileImageUrl(profileImagePath: string): Promise<string | null> {
    if (!profileImagePath) return null;
    try {
      return await this.awsS3Service.getImageByFileId(profileImagePath);
    } catch (error) {
      this.logger.error(`Failed to get image URL: ${error.message}`);
      return null;
    }
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove user's profile image if exists
    if (user.profileImagePath) {
      try {
        await this.awsS3Service.deleteImageByFileId(
          user.profileImagePath as string,
        );
      } catch (error) {
        console.error('Failed to delete profile image', error);
        // Continue even if image deletion fails
      }
    }

    await this.userModel.findByIdAndDelete(id);
    return { message: 'User deleted successfully' };
  }
}
