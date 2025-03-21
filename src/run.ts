import { CommandFactory } from 'nest-commander';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  await CommandFactory.run(AppModule, ['warn', 'error']);
  process.exit();
}

bootstrap().catch((e): void => {
  console.error(`🔥 Error running commands, ${e}`);
  process.exit(1);
});
