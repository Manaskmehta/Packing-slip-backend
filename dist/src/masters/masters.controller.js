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
exports.MastersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const masters_service_1 = require("./masters.service");
const party_dto_1 = require("./dto/party.dto");
const project_dto_1 = require("./dto/project.dto");
const product_dto_1 = require("./dto/product.dto");
const po_dto_1 = require("./dto/po.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MastersController = class MastersController {
    masters;
    constructor(masters) {
        this.masters = masters;
    }
    findAllParties(search, activeOnly, page, limit) {
        return this.masters.findAllParties(search, activeOnly === 'true', page ? Number(page) : 1, limit ? Number(limit) : 50);
    }
    downloadPartyTemplate(res) {
        const buffer = this.masters.generatePartyTemplate();
        res.setHeader('Content-Disposition', 'attachment; filename="parties_template.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
    previewPartyImport(file) {
        return this.masters.previewPartiesExcel(file.buffer);
    }
    confirmPartyImport(file) {
        return this.masters.importPartiesFromExcel(file.buffer);
    }
    findOneParty(id) {
        return this.masters.findOneParty(id);
    }
    createParty(dto) {
        return this.masters.createParty(dto);
    }
    updateParty(id, dto) {
        return this.masters.updateParty(id, dto);
    }
    removeParty(id) {
        return this.masters.removeParty(id);
    }
    findAllProjects(search, activeOnly, partyId, page, limit) {
        return this.masters.findAllProjects(search, activeOnly === 'true', partyId ? Number(partyId) : undefined, page ? Number(page) : 1, limit ? Number(limit) : 50);
    }
    downloadProjectTemplate(res) {
        const buffer = this.masters.generateProjectTemplate();
        res.setHeader('Content-Disposition', 'attachment; filename="projects_template.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
    previewProjectImport(file) {
        return this.masters.previewProjectsExcel(file.buffer);
    }
    confirmProjectImport(file) {
        return this.masters.importProjectsFromExcel(file.buffer);
    }
    findOneProject(id) {
        return this.masters.findOneProject(id);
    }
    createProject(dto) {
        return this.masters.createProject(dto);
    }
    updateProject(id, dto) {
        return this.masters.updateProject(id, dto);
    }
    removeProject(id) {
        return this.masters.removeProject(id);
    }
    findAllProducts(search, activeOnly, page, limit) {
        return this.masters.findAllProducts(search, activeOnly === 'true', page ? Number(page) : 1, limit ? Number(limit) : 50);
    }
    downloadProductTemplate(res) {
        const buffer = this.masters.generateProductTemplate();
        res.setHeader('Content-Disposition', 'attachment; filename="products_template.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
    previewProductImport(file) {
        return this.masters.previewProductsExcel(file.buffer);
    }
    confirmProductImport(file) {
        return this.masters.importProductsFromExcel(file.buffer);
    }
    findOneProduct(id) {
        return this.masters.findOneProduct(id);
    }
    createProduct(dto) {
        return this.masters.createProduct(dto);
    }
    updateProduct(id, dto) {
        return this.masters.updateProduct(id, dto);
    }
    removeProduct(id) {
        return this.masters.removeProduct(id);
    }
    findAllPos(search, partyId, page, limit) {
        return this.masters.findAllPos(search, partyId ? Number(partyId) : undefined, page ? Number(page) : 1, limit ? Number(limit) : 50);
    }
    downloadPoTemplate(res) {
        const buffer = this.masters.generatePoTemplate();
        res.setHeader('Content-Disposition', 'attachment; filename="pos_template.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
    previewPoImport(file) {
        return this.masters.previewPosExcel(file.buffer);
    }
    confirmPoImport(file) {
        return this.masters.importPosFromExcel(file.buffer);
    }
    findOnePo(id) {
        return this.masters.findOnePo(id);
    }
    createPo(dto) {
        return this.masters.createPo(dto);
    }
    updatePo(id, dto) {
        return this.masters.updatePo(id, dto);
    }
    removePo(id) {
        return this.masters.removePo(id);
    }
};
exports.MastersController = MastersController;
__decorate([
    (0, common_1.Get)('parties'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('activeOnly')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findAllParties", null);
__decorate([
    (0, common_1.Get)('parties/template/download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "downloadPartyTemplate", null);
__decorate([
    (0, common_1.Post)('parties/import/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "previewPartyImport", null);
__decorate([
    (0, common_1.Post)('parties/import/confirm'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "confirmPartyImport", null);
__decorate([
    (0, common_1.Get)('parties/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findOneParty", null);
__decorate([
    (0, common_1.Post)('parties'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [party_dto_1.CreatePartyDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "createParty", null);
__decorate([
    (0, common_1.Put)('parties/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, party_dto_1.UpdatePartyDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "updateParty", null);
__decorate([
    (0, common_1.Delete)('parties/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "removeParty", null);
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('activeOnly')),
    __param(2, (0, common_1.Query)('partyId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findAllProjects", null);
__decorate([
    (0, common_1.Get)('projects/template/download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "downloadProjectTemplate", null);
__decorate([
    (0, common_1.Post)('projects/import/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "previewProjectImport", null);
__decorate([
    (0, common_1.Post)('projects/import/confirm'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "confirmProjectImport", null);
__decorate([
    (0, common_1.Get)('projects/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findOneProject", null);
__decorate([
    (0, common_1.Post)('projects'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "createProject", null);
__decorate([
    (0, common_1.Put)('projects/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)('projects/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "removeProject", null);
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('activeOnly')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findAllProducts", null);
__decorate([
    (0, common_1.Get)('products/template/download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "downloadProductTemplate", null);
__decorate([
    (0, common_1.Post)('products/import/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "previewProductImport", null);
__decorate([
    (0, common_1.Post)('products/import/confirm'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "confirmProductImport", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findOneProduct", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "removeProduct", null);
__decorate([
    (0, common_1.Get)('pos'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('partyId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findAllPos", null);
__decorate([
    (0, common_1.Get)('pos/template/download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "downloadPoTemplate", null);
__decorate([
    (0, common_1.Post)('pos/import/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "previewPoImport", null);
__decorate([
    (0, common_1.Post)('pos/import/confirm'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "confirmPoImport", null);
__decorate([
    (0, common_1.Get)('pos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "findOnePo", null);
__decorate([
    (0, common_1.Post)('pos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [po_dto_1.CreatePoDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "createPo", null);
__decorate([
    (0, common_1.Put)('pos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, po_dto_1.UpdatePoDto]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "updatePo", null);
__decorate([
    (0, common_1.Delete)('pos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "removePo", null);
exports.MastersController = MastersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('masters'),
    __metadata("design:paramtypes", [masters_service_1.MastersService])
], MastersController);
//# sourceMappingURL=masters.controller.js.map