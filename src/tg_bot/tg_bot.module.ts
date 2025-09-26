import { Module } from '@nestjs/common';
import { TgBotService } from './tg_bot.service';
import { ConfigModule } from '@nestjs/config'; // ← ДОБАВИЛ!

@Module({
    imports: [ConfigModule],
    providers: [TgBotService],
    exports: [TgBotService],
})
export class TgBotModule {}