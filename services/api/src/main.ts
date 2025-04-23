import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { ValidationPipe } from "@nestjs/common";
import { LOCAL_TYPE } from "./common/constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Accept,Authorization,Access-Control-Allow-Origin",
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));

  if (process.env.ENV == LOCAL_TYPE) {
    const config = new DocumentBuilder()
      .setTitle("Golgari-Api")
      .setDescription("Golgari api server")
      .setVersion("0.0.1")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }
  
  await app.listen(3000);
}
bootstrap();
