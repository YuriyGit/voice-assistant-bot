import {Injectable, Logger} from '@nestjs/common';
import {existsSync, mkdirSync} from 'fs';
import {join} from "path";
import dayjs from "dayjs";

@Injectable()
export class FileStorageService {
    private readonly uploadDir: string;
    private readonly logger = new Logger(FileStorageService.name);

    constructor() {
        this.uploadDir = join(process.cwd(), 'uploads');
    }

    generateFileName(file_id: string): string {
        return `${file_id}_${dayjs(Date.now()).format('YYYYMMDD_HHmmssSSS')}.opus`;
    }

    getFilePath(fileName: string): string {
        return join(this.uploadDir, fileName);
    }

    async downloadAndReturnPath(ctx): Promise<string | null> {

        try {
            const file = await ctx.getFile();
            const fileName = this.generateFileName(ctx.message.voice.file_id);
            const filePath = this.getFilePath(fileName);

            const fileDir = this.uploadDir;
            if (!existsSync(fileDir)) {
                mkdirSync(fileDir, { recursive: true });
                this.logger.log(`Папка ${fileDir} создана`);
            }

            await file.download(filePath);
            this.logger.log(` Голосовое сохранено: ${filePath}`);
            return filePath;
        } catch (e) {
            this.logger.error('Ошибка скачивания файла:', e);
            ctx.reply('Не удалось скачать голосовое. Попробуйте ещё раз.');
            return null
        }
    }
}
