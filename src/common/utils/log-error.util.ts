import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';

import { QueryFailedError } from 'typeorm';

export function logUnknownError(
  logger: Logger,
  action: string,
  user?: { email: string },
  extra?: unknown,
  error?: unknown,
): never {
  let message = `❗❗ Failed to ${action}`;

  if (user?.email != null) {
    message += ` for user "${user.email}"`;
  }

  if (extra) {
    message += `. Context: ${JSON.stringify(extra)}`;
  }

  // Handle database specific errors
  if (error instanceof QueryFailedError) {
    const dbError = error as QueryFailedError & { code?: string };
    logger.error(`${message}: ${dbError.message}`, dbError.stack);

    switch (dbError.code) {
      case '23505':
        throw new ConflictException('Resource already exists');
      case '23503':
        throw new ConflictException('Referenced resource does not exist');
      default:
        break;
    }
  }

  // Handle other error types
  if (error instanceof Error) {
    logger.error(`${message}: ${error.message}`, error.stack);
  } else {
    logger.error(`${message}: Unknown error`, JSON.stringify(error));
  }

  throw new InternalServerErrorException('An unexpected error occurred');
}
