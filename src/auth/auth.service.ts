import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private JwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const hashedPass = await bcrypt.hash(dto.password, 10);
    const newUser = new this.userModel({
      email: dto.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    return this.createToken(user.email);
  }

  createToken(email: string) {
    return this.JwtService.sign({ email });
  }
}
