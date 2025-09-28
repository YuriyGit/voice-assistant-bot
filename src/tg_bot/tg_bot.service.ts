import {Injectable, OnModuleInit, Logger} from '@nestjs/common';
import {Bot, Context} from 'grammy';
import {FileFlavor, hydrateFiles} from '@grammyjs/files';
import {ConfigService} from "@nestjs/config";
import {FileStorageService} from "../file-storage/file-storage.service";


@Injectable()
export class TgBotService implements OnModuleInit {
    private readonly logger = new Logger(TgBotService.name);
    private bot: Bot<FileFlavor<Context>>;

    constructor(private readonly configService: ConfigService,
                private readonly fileStorageService: FileStorageService,) {
    }

    async onModuleInit() {
        const token = this.configService.get('TG_BOT_TOKEN');

        if (!token) {
            this.logger.error('Токен Telegram не найден!');
            throw new Error('Токен Telegram не найден!')
        }

        this.bot = new Bot<FileFlavor<Context>>(token);
        this.bot.api.config.use(hydrateFiles(this.bot.token));

        this.bot.command('start', (ctx) => {
            this.logger.log('////Starting bot////');
            ctx.reply('Hello World!');
        })

        this.bot.on('message:voice', async (ctx) => {
            if (!ctx.message?.voice) {
                ctx.reply('нет voice сообщения');
                this.logger.log('нет voice сообщения');
                return
            }
            this.logger.log('////msg:voice////');

            const filePath = await this.fileStorageService.downloadAndReturnPath(ctx);
            if (filePath) {
                ctx.reply('Принял в обработку... 🎙️');
            } else {
                ctx.reply('Не удалось скачать голосовое. Попробуйте ещё раз.');
            }

        })

        this.bot.on('message:text', (ctx) => {
            this.logger.log('////msg:text////');
            ctx.reply('text');
        })
        await this.bot.start();
    }
}
