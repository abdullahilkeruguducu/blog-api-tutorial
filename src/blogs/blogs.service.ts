import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { BlogDto } from './dto/blog.dto';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { UnsubscriptionError } from 'rxjs';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBlog(dto: BlogDto, req: any) {
    const currentUser = await this.userModel.findOne({ email: req.user.email });
    const newBlog = new this.blogModel({
      title: dto.title,
      content: dto.content,
      sharedBy: currentUser.email,
      userId: currentUser._id,
    });
    return await newBlog.save();
  }

  async updateBlog(dto: BlogDto, id: string, req: any) {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId) {
      throw new UnauthorizedException('This is not your blog');
    }
    return await this.blogModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async removeBlog(id: string, dto: BlogDto) {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId) {
      throw new UnauthorizedException('This is not your blog');
    }
    return await this.blogModel.findByIdAndRemove(id);
  }

  async getAllBlogs() {
    return await this.blogModel.find();
  }

  async getCurrentUsersBlog(req: any) {
    const currentUser = await this.userModel.findOne({ email: req.user.email });
    return await this.blogModel.find({ userId: currentUser._id });
  }

  async getOneBlog(id: string) {
    return await this.blogModel.findById(id);
  }
}
