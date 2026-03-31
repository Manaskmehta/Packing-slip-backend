"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackingSlipController = void 0;
const common_1 = require("@nestjs/common");
const packing_slip_service_1 = require("./packing-slip.service");
const packing_slip_dto_1 = require("./dto/packing-slip.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PackingSlipController = class PackingSlipController {
    packingSlip;
    constructor(packingSlip) {
        this.packingSlip = packingSlip;
    }
    findAll(query) {
        const dir = query.sortDir === 'asc' || query.sortDir === 'desc' ? query.sortDir : undefined;
        const pid = query.partyId ? Number(query.partyId) : undefined;
        const prid = query.projectId ? Number(query.projectId) : undefined;
        const prodId = query.productId ? Number(query.productId) : undefined;
        const y = query.year ? Number(query.year) : undefined;
        const locked = query.isLocked === 'true' ? true : query.isLocked === 'false' ? false : undefined;
        return this.packingSlip.findAll({
            search: query.search,
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 50,
            sortBy: query.sortBy,
            sortDir: dir,
            partyId: pid != null && Number.isFinite(pid) ? pid : undefined,
            projectId: prid != null && Number.isFinite(prid) ? prid : undefined,
            productId: prodId != null && Number.isFinite(prodId) ? prodId : undefined,
            year: y != null && Number.isFinite(y) ? y : undefined,
            isLocked: locked,
        });
    }
    findOne(id) {
        return this.packingSlip.findOne(id);
    }
    create(dto, req) {
        return this.packingSlip.create(dto, req.user.id);
    }
    lock(id) {
        return this.packingSlip.lock(id);
    }
    update(id, dto) {
        return this.packingSlip.update(id, dto);
    }
    remove(id) {
        return this.packingSlip.remove(id);
    }
};
exports.PackingSlipController = PackingSlipController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PackingSlipController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PackingSlipController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [packing_slip_dto_1.CreatePackingSlipDto, Object]),
    __metadata("design:returntype", void 0)
], PackingSlipController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/lock'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PackingSlipController.prototype, "lock", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, packing_slip_dto_1.CreatePackingSlipDto]),
    __metadata("design:returntype", void 0)
], PackingSlipController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PackingSlipController.prototype, "remove", null);
exports.PackingSlipController = PackingSlipController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('packing-slips'),
    __metadata("design:paramtypes", [packing_slip_service_1.PackingSlipService])
], PackingSlipController);
//# sourceMappingURL=packing-slip.controller.js.map