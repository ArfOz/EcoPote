import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // mysql, sqlite, mariadb, vb. ile değiştirin
      host: 'localhost',
      port: 5432,
      username: 'your_user',
      password: 'your_password',
      database: 'your_database',
      entities: [__dirname + '/../**/*.entity.{js,ts}'], // Entity'leri otomatik tarar
      synchronize: true, // Geliştirme sırasında true, üretimde false
    }),
  ],
})
export class AppModule {}
