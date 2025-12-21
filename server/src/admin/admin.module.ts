import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ENV_VARS } from '@config/env';
import { Admin, AdminSchema } from './models';
import { User, UserSchema } from '@/users/models';
import { Post, PostSchema } from '@/posts/models/post.model';
import { Report, ReportSchema } from '@/reports/models/report.model';
import { Comment, CommentSchema } from '@/comments/models/comment.model';
import {
  AdminService,
  AdminAuthService,
  AdminSeedService,
  AdminUsersService,
  AdminCommentsService,
  AdminReportsService,
} from './services';
import {
  AdminAuthController,
  AdminController,
  AdminUsersController,
  AdminCommentsController,
  AdminReportsController,
} from './controllers';
import { AdminJwtStrategy } from './strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Report.name, schema: ReportSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: ENV_VARS.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AdminAuthController,
    AdminController,
    AdminUsersController,
    AdminCommentsController,
    AdminReportsController,
  ],
  providers: [
    AdminService,
    AdminAuthService,
    AdminSeedService,
    AdminUsersService,
    AdminCommentsService,
    AdminReportsService,
    AdminJwtStrategy,
  ],
  exports: [
    AdminService,
    AdminAuthService,
    AdminUsersService,
    AdminCommentsService,
    AdminReportsService,
  ],
})
export class AdminModule {}
