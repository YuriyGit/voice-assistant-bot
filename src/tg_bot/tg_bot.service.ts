//tg_bot.service.ts
import {existsSync, mkdirSync} from 'fs';
import {join} from 'path';
import {Injectable, OnModuleInit, Logger} from '@nestjs/common';
import {Bot, Context} from 'grammy';
import {FileFlavor, hydrateFiles} from '@grammyjs/files';
import {ConfigService} from "@nestjs/config";
import dayjs from 'dayjs';


@Injectable()
export class TgBotService implements OnModuleInit {
    private readonly logger = new Logger(TgBotService.name);
    private bot: Bot<FileFlavor<Context>>;

    constructor(private readonly configService: ConfigService) {
    }

    async onModuleInit() {
        const token = this.configService.get('TG_BOT_TOKEN');

        if (!token) {
            this.logger.error('Токен Telegram не найден!');
            throw new Error('Токен Telegram не найден!')
        }

        const uploadDir = join(process.cwd(), 'uploads');

        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, {recursive: true});
        }

        this.bot = new Bot<FileFlavor<Context>>(token);
        this.bot.api.config.use(hydrateFiles(this.bot.token));

        this.bot.command('start', (ctx) => {
            this.logger.log('////Starting bot////');
            ctx.reply('Hello World!');
        })

        this.bot.on('message:voice', async (ctx) => {
            this.logger.log('////msg:voice////');

            if (!ctx.message?.voice) {
                ctx.reply('нет voice сообщения');
                this.logger.log('нет voice сообщения');
                return
            }

            const filename = `${ctx.message.voice.file_id}_${dayjs(Date.now()).format('YYYYMMDD_HHmmssSSS')}.opus`;
            const filePath = `uploads/${filename}`;

            try {
                const file = await ctx.getFile();
                await file.download(filePath);
                this.logger.log(` Голосовое сохранено: ${filePath}`);
                ctx.reply('Принял в обработку... 🎙️');
            } catch (e) {
                this.logger.error('Ошибка скачивания файла:', e);
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
