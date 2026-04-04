/**
 * Logger Service
 *
 * Centralized error and event logging for Salvar.
 * In production, this should send errors to a monitoring service like Sentry.
 *
 * For now, logs to console in development and stores recent errors in AsyncStorage
 * for debugging purposes.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const LOG_PREFIX = '[Salvar]'
const MAX_LOGGED_ERRORS = 50
const ERROR_STORAGE_KEY = '@salvar:errors:v1'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogEntry = {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  platform: string
}

class LoggerService {
  private isDevelopment = __DEV__

  private createEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      platform: Platform.OS
    }
  }

  private formatEntry(entry: LogEntry): string {
    const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : ''
    return `${LOG_PREFIX}[${entry.level.toUpperCase()}] ${entry.message}${contextStr}`
  }

  private async storeError(entry: LogEntry): Promise<void> {
    if (entry.level !== 'error') return

    try {
      const stored = await AsyncStorage.getItem(ERROR_STORAGE_KEY)
      const errors: LogEntry[] = stored ? JSON.parse(stored) : []

      errors.push(entry)

      // Keep only the most recent errors
      const trimmed = errors.slice(-MAX_LOGGED_ERRORS)

      await AsyncStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(trimmed))
    } catch (storageError) {
      // If we can't store errors, at least log the failure
      console.error(`${LOG_PREFIX}[ERROR] Failed to store error:`, storageError)
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.isDevelopment) return

    const entry = this.createEntry('debug', message, context)
    console.log(this.formatEntry(entry))
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createEntry('info', message, context)
    console.log(this.formatEntry(entry))
    this.storeError(entry)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createEntry('warn', message, context)
    console.warn(this.formatEntry(entry))
    this.storeError(entry)
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const entry = this.createEntry('error', message, {
      ...context,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error)
    })

    console.error(this.formatEntry(entry))

    if (error instanceof Error && error.stack) {
      console.error(`${LOG_PREFIX}[STACK] ${error.stack}`)
    }

    this.storeError(entry)
  }

  /**
   * Get stored errors from AsyncStorage
   * Useful for debugging and support
   */
  async getStoredErrors(): Promise<LogEntry[]> {
    try {
      const stored = await AsyncStorage.getItem(ERROR_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Clear stored errors
   */
  async clearStoredErrors(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ERROR_STORAGE_KEY)
    } catch {
      // Ignore
    }
  }

  /**
   * Export errors for support/debugging
   */
  async exportErrors(): Promise<string> {
    const errors = await this.getStoredErrors()
    return errors.map((e) => this.formatEntry(e)).join('\n')
  }
}

// Singleton instance
export const logger = new LoggerService()

/**
 * Global error handler for uncaught errors
 */
export function setupGlobalErrorHandler(): void {
  const originalHandler = ErrorUtils.getGlobalHandler()

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    logger.error('Uncaught error', error, { isFatal })

    // Call the original handler (shows red screen in dev, crashes in prod)
    originalHandler(error, isFatal)
  })

  // Handle unhandled promise rejections
  const originalWarn = console.warn
  console.warn = (message, ...args) => {
    if (message && typeof message === 'string' && message.includes('Possible Unhandled Promise')) {
      logger.warn('Unhandled promise rejection detected', { message, args })
    }
    originalWarn(message, ...args)
  }
}
