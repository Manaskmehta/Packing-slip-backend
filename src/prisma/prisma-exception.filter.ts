import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

/**
 * Global filter that catches Prisma ORM errors and converts them into
 * human-readable HTTP responses instead of leaking raw DB error messages.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.warn(`Prisma error ${exception.code}: ${exception.message}`);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'A database error occurred. Please try again.';

    switch (exception.code) {
      // Unique constraint violation (e.g. duplicate code / email)
      case 'P2002': {
        const fields = (exception.meta?.target as string[]) ?? [];
        status = HttpStatus.CONFLICT;
        message = fields.length
          ? `A record with the same ${fields.join(', ')} already exists.`
          : 'A duplicate record already exists.';
        break;
      }

      // Foreign-key constraint failed on DELETE (record is still referenced)
      case 'P2003': {
        status = HttpStatus.CONFLICT;
        message =
          'This record is referenced by other data and cannot be removed. ' +
          'Remove or reassign the dependent records first, or mark this record as Inactive.';
        break;
      }

      // Required related record does not exist
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'The requested record was not found.';
        break;
      }

      // Relation violation
      case 'P2014': {
        status = HttpStatus.CONFLICT;
        message = 'This operation violates a relationship constraint.';
        break;
      }

      default:
        this.logger.error(
          `Unhandled Prisma error ${exception.code}`,
          exception.stack,
        );
    }

    response.status(status).json({
      statusCode: status,
      message,
      errorCode: exception.code,
    });
  }
}
