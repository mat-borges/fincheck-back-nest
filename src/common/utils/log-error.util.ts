import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { QueryFailedError } from 'typeorm';

export function logUnknownError(
  logger: Logger,
  action: string,
  user?: { username: string },
  extra?: unknown,
  error?: unknown,
): never {
  let message = `Failed to ${action}`;

  if (user?.username != null) {
    message += ` for user "${user.username}"`;
  }

  if (extra) {
    message += `. Context: ${JSON.stringify(extra)}`;
  }

  if (error instanceof QueryFailedError) {
    const dbError = error as QueryFailedError & { code?: string };
    logger.error(`${message}: ${dbError.message}`, dbError.stack);

    if (dbError.code === '23505') {
      throw new ConflictException('Resource already exists');
    }
  }

  if (error instanceof Error) {
    logger.error(`${message}: ${error.message}`, error.stack);
  } else {
    logger.error(`${message}: Unknown error`, JSON.stringify(error));
  }

  throw new InternalServerErrorException('An unexpected error occurred');
}
