import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TopicsModule } from './topics/topics.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [UserModule, AuthModule, CategoriesModule, TopicsModule, PostsModule],
})
export class AppModule {}
