import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * This is an asynchronous function that connects to a database when the module is initialized.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * This function enables shutdown hooks for a NestJS application to ensure it is properly closed before
   * exiting.
   * @param {INestApplication} app - INestApplication is an interface that represents a Nest application
   * instance. It provides methods for starting and stopping the application, configuring middleware, and
   * registering controllers, providers, and modules. In this case, the app parameter is an instance of
   * INestApplication that is passed to the enableShutdownHooks method. The
   */
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
