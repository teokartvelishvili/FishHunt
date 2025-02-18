import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../types/role.enum'; 

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, enum: Role, required: true, default: Role.User }) // აქ `role` დავამატე
  role!: Role;

  @Prop({ type: String, default: null })
  refreshToken?: string | null;


// 👇 **ეს ველები მხოლოდ Seller-ს დასჭირდება, ამიტომ `required: false` ვუტოვებთ**  
@Prop({ type: String, default: null }) 
storeName?: string;

@Prop({ type: String, default: null }) 
storeLogo?: string;

@Prop({ type: String, default: null }) 
ownerFirstName?: string;

@Prop({ type: String, default: null }) 
ownerLastName?: string;

@Prop({ type: String, default: null }) 
phoneNumber?: string;

@Prop({ type: String, default: null }) 
identificationNumber?: string;

@Prop({ type: String, default: null }) 
accountNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
