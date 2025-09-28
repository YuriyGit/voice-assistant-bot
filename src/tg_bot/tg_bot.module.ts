import {Module} from '@nestjs/common';
import {TgBotService} from './tg_bot.service';
import {ConfigModule} from '@nestjs/config';
import {FileStorageModule} from "../file-storage/file-storage.module";

@Module({
    imports: [
        FileStorageModule,
        ConfigModule],
    providers: [TgBotService],
    exports: [TgBotService],
})
export class TgBotModule {
}