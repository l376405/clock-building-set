import { openDB } from 'idb' // IndexedDB
import { format } from 'date-fns' // 日期格式化
import { saveAs } from 'file-saver' // 文件保存

// 日誌管理器
class Logger {
    constructor() {
        this.isDebugMode = true; // 是否為調試模式
        this.logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'; // 日誌級別 預設為 info
        this.dbPromise = this.initDB(); // 初始化 IndexedDB
    }

    async initDB() {
      try {
          return await openDB('LoggerDB', 1, {
              upgrade(db) {
                  db.createObjectStore('logs', { autoIncrement: true }); // 創建日誌對象存儲
              },
          });
      } catch (error) {
          console.error('Failed to initialize IndexedDB:', error); // 初始化 IndexedDB 失敗
          return null;
      }
    }

    setDebugMode(isDebug) {
        this.isDebugMode = isDebug;
    }

    getCallerInfo() {
        const error = new Error();
        const stack = error.stack.split('\n');
        // 我們需要第四行，因為第一行是 Error，第二行是 getCallerInfo，第三行是 log 方法
        const caller = stack[3] ? stack[3].trim() : 'Unknown caller';
        return caller;
    }

    async log(level, message, details = null) {
        if (this.shouldLog(level)) {
            const caller = this.getCallerInfo();
            const logMessage = this.formatMessage(level, message, details, caller);
            console.log(logMessage);
            await this.saveToIndexedDB(level, message, details, caller);
        }
    }

    shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug'];
        return levels.indexOf(level) <= levels.indexOf(this.logLevel); // 判斷是否應該記錄日誌
    }

    formatMessage(level, message, details, caller) {
        const timestamp = new Date().toISOString(); // 獲取當前時間戳
        let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${caller}] ${message}`; // 格式化日誌消息
        
        if (this.isDebugMode && details) { // 如果為調試模式且有詳細信息，則添加詳細信息
            formattedMessage += `\nDetails: ${JSON.stringify(details, null, 2)}`;
        }
        
        return formattedMessage;
    }

    async saveToIndexedDB(level, message, details, caller) {
      const db = await this.dbPromise;
      if (!db) {
        console.warn('IndexedDB not available, skipping log storage'); // IndexedDB 不可用，跳過日誌存儲
        return;
      }
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        details: this.isDebugMode ? JSON.parse(JSON.stringify(details)) : null,
        caller
      };
      try {
        await db.add('logs', logEntry);
      } catch (error) {
        console.error('Failed to save log to IndexedDB:', error);
      }
    }

    async exportLogs() {
      const db = await this.dbPromise;
      if (!db) {
          console.warn('IndexedDB not available, cannot export logs');
          return;
      }
      try {
          const logs = await db.getAll('logs');
          const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
          saveAs(blob, `logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`); // 保存日誌到本地
      } catch (error) {
          console.error('Failed to export logs:', error); // 導出日誌失敗
      }
    }

    async debug(message, details = null) {
        await this.log('debug', message, details);
    }

    async info(message, details = null) {
        await this.log('info', message, details);
    }

    async warn(message, details = null) {
        await this.log('warn', message, details);
    }

    async error(message, details = null) {
        await this.log('error', message, details);
    }
}

export const logger = new Logger();