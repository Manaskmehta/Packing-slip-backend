"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InwardModule = void 0;
const common_1 = require("@nestjs/common");
const inward_service_1 = require("./inward.service");
const inward_controller_1 = require("./inward.controller");
let InwardModule = class InwardModule {
};
exports.InwardModule = InwardModule;
exports.InwardModule = InwardModule = __decorate([
    (0, common_1.Module)({
        controllers: [inward_controller_1.InwardController],
        providers: [inward_service_1.InwardService],
    })
], InwardModule);
//# sourceMappingURL=inward.module.js.map