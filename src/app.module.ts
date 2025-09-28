import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TgBotModule} from './tg_bot/tg_bot.module';
import {ConfigModule} from '@nestjs/config'
import {FileStorageModule} from "./file-storage/file-storage.module";


@Module({
    imports: [TgBotModule,
        ConfigModule.forRoot({}),
        FileStorageModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
