import {Module} from '@nestjs/common';
import {TgBotService} from './tg_bot.service';
import {FileStorageModule} from "../file-storage/file-storage.module"; // ← ДОБАВИЛ!

@Module({
    imports: [FileStorageModule],
    providers: [TgBotService],
    exports: [TgBotService],
})
export class TgBotModule {
}