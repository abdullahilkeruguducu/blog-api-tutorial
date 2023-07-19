import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot("mongodb://mongo:gotG4SNDH970XwmkYEJt@containers-us-west-53.railway.app:6964"),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
