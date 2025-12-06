"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _mongoose = require("mongoose");
const _mongoose1 = require("@nestjs/mongoose");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _common = require("@nestjs/common");
const _userschema = require("../schemas/user.schema");
const _password = require("../../utils/password");
const _seedusers = require("../../utils/seed-users");
const _roleenum = require("../../types/role.enum");
const _awss3service = require("../../aws-s3/aws-s3.service");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let UsersService = class UsersService {
    async findByEmail(email) {
        // Convert to lowercase to ensure case-insensitive matching
        const lowercaseEmail = email.toLowerCase();
        return this.userModel.findOne({
            email: lowercaseEmail
        }).exec();
    }
    async create(user) {
        try {
            const existingUser = await this.findByEmail(user.email?.toLowerCase() ?? '');
            if (existingUser) {
                throw new _common.ConflictException('Email already exists');
            }
            const hashedPassword = await (0, _password.hashPassword)(user.password ?? '');
            // Store email in lowercase
            return await this.userModel.create({
                ...user,
                email: user.email?.toLowerCase(),
                password: hashedPassword,
                role: user.role ?? _roleenum.Role.User
            });
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
            if (error.code === 11000) {
                throw new _common.BadRequestException('Email already exists');
            }
            if (error.name === 'ValidationError') {
                throw new _common.BadRequestException(error.message);
            }
            throw new _common.BadRequestException('Failed to create user');
        }
    }
    async createSeller(dto, logoFile) {
        try {
            const existingUser = await this.userModel.findOne({
                email: dto.email
            });
            if (existingUser) {
                throw new _common.ConflictException('User with this email already exists');
            }
            let logoPath;
            if (logoFile) {
                // Upload logo to AWS S3
                try {
                    logoPath = await this.awsS3Service.uploadImage(logoFile.originalname, logoFile.buffer);
                } catch (error) {
                    this.logger.error('Failed to upload logo:', error);
                // Continue without logo if upload fails
                }
            }
            const sellerData = {
                ...dto,
                name: dto.storeName,
                role: _roleenum.Role.Seller,
                password: dto.password,
                storeLogo: logoPath
            };
            return await this.create(sellerData);
        } catch (error) {
            this.logger.error(`Failed to create seller: ${error.message}`);
            if (error.code === 11000) {
                throw new _common.ConflictException('User with this email already exists');
            }
            throw error;
        }
    }
    async createMany(users) {
        try {
            const usersWithLowercaseEmails = users.map((user)=>({
                    ...user,
                    email: user.email?.toLowerCase()
                }));
            return await this.userModel.insertMany(usersWithLowercaseEmails);
        } catch (error) {
            this.logger.error(`Failed to create users: ${error.message}`);
            throw new _common.BadRequestException('Failed to create users');
        }
    }
    async findOne(email) {
        return this.findByEmail(email);
    }
    async findById(id) {
        if (!_mongoose.Types.ObjectId.isValid(id)) {
            throw new _common.BadRequestException('Invalid user ID');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new _common.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userModel.find({}).sort({
                createdAt: -1
            }).skip(skip).limit(limit).exec(),
            this.userModel.countDocuments({})
        ]);
        return {
            items: users,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }
    async deleteOne(id) {
        if (!_mongoose.Types.ObjectId.isValid(id)) {
            throw new _common.BadRequestException('Invalid user ID');
        }
        const result = await this.userModel.findOneAndDelete({
            _id: id
        });
        if (!result) {
            throw new _common.NotFoundException(`User with ID ${id} not found`);
        }
    }
    async update(id, attrs, adminRole = false) {
        if (!_mongoose.Types.ObjectId.isValid(id)) {
            throw new _common.BadRequestException('Invalid user ID');
        }
        const user = await this.findById(id);
        if (!user) {
            throw new _common.NotFoundException(`User with ID ${id} not found`);
        }
        // Only validate email if it's being updated
        if (attrs.email && attrs.email !== user.email) {
            attrs.email = attrs.email.toLowerCase();
            const existingUser = await this.findByEmail(attrs.email);
            if (existingUser && existingUser._id.toString() !== id) {
                throw new _common.BadRequestException('Email is already in use');
            }
        }
        // Handle password update if provided
        if (attrs.password && !adminRole) {
            const passwordMatch = await _bcrypt.compare(attrs.password, user.password);
            if (passwordMatch) {
                throw new _common.BadRequestException('New password must be different from the current password');
            }
            attrs.password = await (0, _password.hashPassword)(attrs.password);
        }
        // Prepare update data, filter out undefined values
        const updateData = {
            ...attrs
        };
        // Prevent role changes unless admin
        if (!adminRole) delete updateData.role;
        // Filter out undefined values to ensure only provided fields are updated
        Object.keys(updateData).forEach((key)=>{
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(id, {
                $set: updateData
            }, {
                new: true,
                runValidators: true
            });
            if (!updatedUser) {
                throw new _common.NotFoundException(`User with ID ${id} not found`);
            }
            this.logger.log(`User ${id} updated successfully`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`Failed to update user ${id}: ${error.message}`);
            throw new _common.BadRequestException(error.message || 'Failed to update user');
        }
    }
    async adminUpdate(id, updateDto) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new _common.NotFoundException('User not found');
            }
            // Convert email to lowercase if provided
            if (updateDto.email) {
                updateDto.email = updateDto.email.toLowerCase();
                // Check if the email is already in use by another user
                const existingUser = await this.findByEmail(updateDto.email);
                if (existingUser && existingUser._id.toString() !== id) {
                    throw new _common.ConflictException('Email already exists');
                }
            }
            // Update fields only if they are provided
            if (updateDto.name) user.name = updateDto.name;
            if (updateDto.email) user.email = updateDto.email;
            if (updateDto.role) user.role = updateDto.role;
            // Only hash and update password if it's provided and not empty
            if (updateDto.password && updateDto.password.trim() !== '') {
                this.logger.log('Updating password for user', id);
                user.password = await (0, _password.hashPassword)(updateDto.password);
            }
            await user.save();
            return user;
        } catch (error) {
            this.logger.error(`Failed to update user: ${error.message}`);
            throw error;
        }
    }
    async deleteMany() {
        try {
            await this.userModel.deleteMany({});
            this.logger.log('All users deleted successfully');
        } catch (error) {
            this.logger.error(`Failed to delete users: ${error.message}`);
            throw new _common.BadRequestException('Failed to delete users');
        }
    }
    async generateUsers(count) {
        const generatedUsers = await (0, _seedusers.generateUsers)(count);
        return this.createMany(generatedUsers);
    }
    async updateProfileImage(userId, filePath, fileBuffer) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new _common.NotFoundException('User not found');
            }
            // Delete old image if it exists
            if (user.profileImagePath) {
                try {
                    await this.awsS3Service.deleteImageByFileId(user.profileImagePath);
                } catch (error) {
                    console.error('Failed to delete old profile image', error);
                // Continue even if deletion fails
                }
            }
            // Upload new image
            const profileImagePath = await this.awsS3Service.uploadImage(filePath, fileBuffer);
            // Update user record
            await this.userModel.findByIdAndUpdate(userId, {
                profileImagePath
            });
            // Get image URL
            const imageUrl = await this.awsS3Service.getImageByFileId(profileImagePath);
            return {
                message: 'Profile image updated successfully',
                profileImage: imageUrl
            };
        } catch (error) {
            throw new _common.BadRequestException('Failed to update profile image: ' + error.message);
        }
    }
    async uploadImage(filePath, fileBuffer) {
        try {
            return await this.awsS3Service.uploadImage(filePath, fileBuffer);
        } catch (error) {
            this.logger.error(`Failed to upload image: ${error.message}`);
            throw new _common.BadRequestException('Failed to upload image: ' + error.message);
        }
    }
    async getProfileData(userId) {
        const user = await this.userModel.findById(userId, {
            password: 0
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Get profile image URL if it exists
        let profileImage = null;
        if (user.profileImagePath) {
            profileImage = await this.awsS3Service.getImageByFileId(user.profileImagePath);
        }
        return {
            ...user.toObject(),
            profileImage
        };
    }
    async getProfileImageUrl(profileImagePath) {
        if (!profileImagePath) return null;
        try {
            return await this.awsS3Service.getImageByFileId(profileImagePath);
        } catch (error) {
            this.logger.error(`Failed to get image URL: ${error.message}`);
            return null;
        }
    }
    async remove(id) {
        if (!(0, _mongoose.isValidObjectId)(id)) {
            throw new _common.BadRequestException('Invalid user ID');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Remove user's profile image if exists
        if (user.profileImagePath) {
            try {
                await this.awsS3Service.deleteImageByFileId(user.profileImagePath);
            } catch (error) {
                console.error('Failed to delete profile image', error);
            // Continue even if image deletion fails
            }
        }
        await this.userModel.findByIdAndDelete(id);
        return {
            message: 'User deleted successfully'
        };
    }
    constructor(userModel, awsS3Service){
        this.userModel = userModel;
        this.awsS3Service = awsS3Service;
        this.logger = new _common.Logger(UsersService.name);
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose1.InjectModel)(_userschema.User.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.Model === "undefined" ? Object : _mongoose.Model,
        typeof _awss3service.AwsS3Service === "undefined" ? Object : _awss3service.AwsS3Service
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map