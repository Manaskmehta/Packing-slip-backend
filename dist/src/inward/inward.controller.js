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
exports.InwardController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const inward_service_1 = require("./inward.service");
const inward_dto_1 = require("./dto/inward.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let InwardController = class InwardController {
    inward;
    constructor(inward) {
        this.inward = inward;
    }
    findAll(query) {
        const dir = query.sortDir === 'asc' || query.sortDir === 'desc' ? query.sortDir : undefined;
        const pid = query.partyId ? Number(query.partyId) : undefined;
        const prid = query.projectId ? Number(query.projectId) : undefined;
        const prodId = query.productId ? Number(query.productId) : undefined;
        const po = query.poId ? Number(query.poId) : undefined;
        const y = query.year ? Number(query.year) : undefined;
        return this.inward.findAll({
            search: query.search,
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 50,
            sortBy: query.sortBy,
            sortDir: dir,
            partyId: pid != null && Number.isFinite(pid) ? pid : undefined,
            projectId: prid != null && Number.isFinite(prid) ? prid : undefined,
            productId: prodId != null && Number.isFinite(prodId) ? prodId : undefined,
            poId: po != null && Number.isFinite(po) ? po : undefined,
            year: y != null && Number.isFinite(y) ? y : undefined,
        });
    }
    getChallans(partyId, projectId, poId) {
        return this.inward.getChallans({
            partyId: partyId ? Number(partyId) : undefined,
            projectId: projectId ? Number(projectId) : undefined,
            poId: poId ? Number(poId) : undefined,
        });
    }
    getPoItems(partyId, projectId, poId) {
        return this.inward.getPoItems({
            partyId: partyId ? Number(partyId) : undefined,
            projectId: projectId ? Number(projectId) : undefined,
            poId: poId ? Number(poId) : undefined,
        });
    }
    findOne(id) {
        return this.inward.findOne(id);
    }
    create(dto, req) {
        return this.inward.create(dto, req.user.id);
    }
    update(id, dto) {
        return this.inward.update(id, dto);
    }
    remove(id, req) {
        return this.inward.remove(id, req.user.role);
    }
    previewImport(file) {
        return this.inward.previewExcel(file.buffer);
    }
    confirmImport(file, req) {
        return this.inward.importFromExcel(file.buffer, req.user.id);
    }
    downloadTemplate(res) {
        const buffer = this.inward.generateTemplate();
        res.setHeader('Content-Disposition', 'attachment; filename="inward_template.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
};
exports.InwardController = InwardController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('challans'),
    __param(0, (0, common_1.Query)('partyId')),
    __param(1, (0, common_1.Query)('projectId')),
    __param(2, (0, common_1.Query)('poId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "getChallans", null);
__decorate([
    (0, common_1.Get)('po-items'),
    __param(0, (0, common_1.Query)('partyId')),
    __param(1, (0, common_1.Query)('projectId')),
    __param(2, (0, common_1.Query)('poId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "getPoItems", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inward_dto_1.CreateInwardDto, Object]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, inward_dto_1.UpdateInwardDto]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "previewImport", null);
__decorate([
    (0, common_1.Post)('import/confirm'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "confirmImport", null);
__decorate([
    (0, common_1.Get)('template/download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InwardController.prototype, "downloadTemplate", null);
exports.InwardController = InwardController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('inward'),
    __metadata("design:paramtypes", [inward_service_1.InwardService])
], InwardController);
//# sourceMappingURL=inward.controller.js.map