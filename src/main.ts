import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { FireBaseConfigService } from './config/firebase/config.service';
import * as firebaseAdmin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.APP_PORT;
  const SWAGGER_LINK = process.env.SWAGGER_LINK;

  const firebaseConfig: FireBaseConfigService = app.get(FireBaseConfigService);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: firebaseConfig.projectId,
      privateKey: firebaseConfig.privateKey,
      clientEmail: firebaseConfig.clientEmail,
    }),
    storageBucket: firebaseConfig.storageBucket,
  });

  const config = new DocumentBuilder()
    .setTitle('Firebase example')
    .setDescription('Demo setup firebase with NestJS')
    .setVersion('1.0.0')
    .addTag('default')
    .build();
  const documnent = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documnent);

  await app.listen(PORT, () => {
    console.info(`Server runing on port: ${PORT}`);
    console.info(`Swagger link: ${SWAGGER_LINK}`);
  });
}
bootstrap();
