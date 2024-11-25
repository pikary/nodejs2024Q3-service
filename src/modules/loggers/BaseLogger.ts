import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BaseLogger {
  logStream: fs.WriteStream;
  private readonly logger = new Logger('LOGS');

  constructor() {
    const logDirectory = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }

    // Create a writable stream for the log file
    const logFilePath = path.join(logDirectory, 'application.log');
    this.logStream = fs.createWriteStream(logFilePath, { flags: 'a' }); // Append mode
  }

  writeLog(type: string, message: string) {
    const date = new Date().toISOString();
    const logEntry = `${date} [${type.toUpperCase()}]: ${message}\n`;
    this.logStream.write(logEntry);
  }
  log(message: string) {
    this.writeLog('info', message);
  }

  error(message: string, trace: string) {
    this.writeLog('error', `${message} - ${trace}`);
  }

  warn(message: string) {
    this.writeLog('warn', message);
  }

  debug(message: string) {
    this.writeLog('debug', message);
  }

  // Close the stream gracefully when the application exits
  onModuleDestroy() {
    this.logStream.end();
  }
}
