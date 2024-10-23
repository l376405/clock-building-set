import { openDB } from 'idb'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
class Logger {
    constructor() {
      this.isDebugMode = false;
      this.logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
    }
  
    setDebugMode(isDebug) {
      this.isDebugMode = isDebug;
    }
  
    log(level, message, details = null) {
      if (this.shouldLog(level)) {
        const logMessage = this.formatMessage(level, message, details);
        console.log(logMessage);
      }
    }
  
    shouldLog(level) {
      const levels = ['error', 'warn', 'info', 'debug'];
      return levels.indexOf(level) <= levels.indexOf(this.logLevel);
    }
  
    formatMessage(level, message, details) {
      const timestamp = new Date().toISOString();
      let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      if (this.isDebugMode && details) {
        formattedMessage += `\nDetails: ${JSON.stringify(details, null, 2)}`;
      }
      
      return formattedMessage;
    }
  
    debug(message, details = null) {
      this.log('debug', message, details);
    }
  
    info(message, details = null) {
      this.log('info', message, details);
    }
  
    warn(message, details = null) {
      this.log('warn', message, details);
    }
  
    error(message, details = null) {
      this.log('error', message, details);
    }
  }
  
  export const logger = new Logger();