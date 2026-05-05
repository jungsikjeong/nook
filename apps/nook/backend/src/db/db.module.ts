import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DbService, DATABASE } from "./db.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DbService,
    {
      provide: DATABASE,
      useFactory: (svc: DbService) => svc.db,
      inject: [DbService],
    },
  ],
  exports: [DbService, DATABASE],
})
export class DbModule {}
