import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { LoggerModule } from "nestjs-pino";
import { BlackModule } from "./black/black.module";
import { GreenModule } from "./green/green.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { ExternalServicesModule } from "./external/external-services.module";

let pinoHttp = {
  level: process.env.LOG_LEVEL,
  genReqId: (request) => {
    const xCorrelationId = request.headers["x-correlation-id"] || randomUUID();
    if (!request.headers["x-correlation-id"]) {
      request.headers["x-correlation-id"] = xCorrelationId;
    }
    return xCorrelationId;
  },
  quietReqLogger: true,
  redact: {
    paths: [
      "arguments.authorization",
      "arguments.token",
      "['0'].*.authorization",
      "['0'].authorization",
      "['0'].token",
      "req.headers",
      "res.headers",
    ],
    censor: "REDACTED",
  },
  messageFormat: "{reqId} [{context}] {msg}",
  transport: null,
};

if (process.env.PRETTY_PRINT) {
  pinoHttp.transport = { target: "pino-pretty", options: { colorize: true, singleLine: true } };
}

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return { pinoHttp };
      },
    }),
    BlackModule,
    GreenModule,
    CommonModule,
    ExternalServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
