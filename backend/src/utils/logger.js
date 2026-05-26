// Logging utility for Movie Stack Backend
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.isTest = process.env.NODE_ENV === 'test';
    this.logDir = path.join(__dirname, '../../logs');
    if (!this.isTest) {
      this.ensureLogDirectory();
    }
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  writeToFile(level, message, meta = {}) {
    if (this.isTest) return;
    const logFile = path.join(this.logDir, `${level}.log`);
    const formattedMessage = this.formatMessage(level, message, meta);
    
    fs.appendFileSync(logFile, formattedMessage + '\n');
  }

  info(message, meta = {}) {
    if (this.isTest) return;
    const formattedMessage = this.formatMessage('info', message, meta);
    console.log(`ℹ️  ${formattedMessage}`);
    this.writeToFile('info', message, meta);
  }

  warn(message, meta = {}) {
    if (this.isTest) return;
    const formattedMessage = this.formatMessage('warn', message, meta);
    console.warn(`⚠️  ${formattedMessage}`);
    this.writeToFile('warn', message, meta);
  }

  error(message, meta = {}) {
    if (this.isTest) return;
    const formattedMessage = this.formatMessage('error', message, meta);
    console.error(`❌ ${formattedMessage}`);
    this.writeToFile('error', message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, meta);
      console.debug(`🐛 ${formattedMessage}`);
      this.writeToFile('debug', message, meta);
    }
  }

  success(message, meta = {}) {
    if (this.isTest) return;
    const formattedMessage = this.formatMessage('success', message, meta);
    console.log(`✅ ${formattedMessage}`);
    this.writeToFile('info', message, meta);
  }
}

module.exports = new Logger();
