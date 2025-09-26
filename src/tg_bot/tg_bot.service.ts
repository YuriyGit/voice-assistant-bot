import {Injectable, OnModuleInit, Logger} from '@nestjs/common';
import {Bot} from 'grammy';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TgBotService implements OnModuleInit {
    private readonly logger = new Logger(TgBotService.name);
    private bot: Bot;

    constructor(private readonly configService: ConfigService) {
    }

    async onModuleInit() {
        const token = this.configService.get('TG_BOT_TOKEN');

        if (!token) {
            this.logger.error('Токен Telegram не найден!');
            throw new Error('Токен Telegram не найден!')
        }

        this.bot = new Bot(token);

        this.bot.command('start', (ctx) => {
            this.logger.log('////Starting bot////');
            ctx.reply('Hello World!');
        })

        this.bot.on('msg:voice', (ctx) => {
            this.logger.log('////msg:voice////');
            ctx.reply('voice');
        })
        this.bot.on('msg:text', (ctx) => {
            this.logger.log('////msg:text////');
            ctx.reply('text');
        })

        await this.bot.start();
    }
}
