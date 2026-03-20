"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaExceptionFilter = PrismaExceptionFilter_1 = class PrismaExceptionFilter {
    logger = new common_1.Logger(PrismaExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        this.logger.warn(`Prisma error ${exception.code}: ${exception.message}`);
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'A database error occurred. Please try again.';
        switch (exception.code) {
            case 'P2002': {
                const fields = exception.meta?.target ?? [];
                status = common_1.HttpStatus.CONFLICT;
                message = fields.length
                    ? `A record with the same ${fields.join(', ')} already exists.`
                    : 'A duplicate record already exists.';
                break;
            }
            case 'P2003': {
                status = common_1.HttpStatus.CONFLICT;
                message =
                    'This record is referenced by other data and cannot be removed. ' +
                        'Remove or reassign the dependent records first, or mark this record as Inactive.';
                break;
            }
            case 'P2025': {
                status = common_1.HttpStatus.NOT_FOUND;
                message = 'The requested record was not found.';
                break;
            }
            case 'P2014': {
                status = common_1.HttpStatus.CONFLICT;
                message = 'This operation violates a relationship constraint.';
                break;
            }
            default:
                this.logger.error(`Unhandled Prisma error ${exception.code}`, exception.stack);
        }
        response.status(status).json({
            statusCode: status,
            message,
            errorCode: exception.code,
        });
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = PrismaExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map