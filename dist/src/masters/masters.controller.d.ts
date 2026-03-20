import type { Response } from 'express';
import { MastersService } from './masters.service';
import { CreatePartyDto, UpdatePartyDto } from './dto/party.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreatePoDto, UpdatePoDto } from './dto/po.dto';
export declare class MastersController {
    private masters;
    constructor(masters: MastersService);
    findAllParties(search?: string, activeOnly?: string, page?: string, limit?: string): Promise<{
        data: {
            id: number;
            name: string;
            createdAt: Date;
            deletedAt: Date | null;
            updatedAt: Date;
            code: string | null;
            address: string | null;
            phone: string | null;
            gstNo: string | null;
            isActive: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    downloadPartyTemplate(res: Response): void;
    previewPartyImport(file: Express.Multer.File): Promise<{
        preview: unknown[];
        total: number;
    }>;
    confirmPartyImport(file: Express.Multer.File): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    findOneParty(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
    }>;
    createParty(dto: CreatePartyDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
    }>;
    updateParty(id: number, dto: UpdatePartyDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
    }>;
    removeParty(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
    }>;
    findAllProjects(search?: string, activeOnly?: string, partyId?: string, page?: string, limit?: string): Promise<{
        data: ({
            party: {
                id: number;
                name: string;
                code: string | null;
            } | null;
        } & {
            id: number;
            name: string;
            createdAt: Date;
            deletedAt: Date | null;
            partyId: number | null;
            updatedAt: Date;
            code: string | null;
            isActive: boolean;
            description: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    downloadProjectTemplate(res: Response): void;
    previewProjectImport(file: Express.Multer.File): Promise<{
        preview: unknown[];
        total: number;
    }>;
    confirmProjectImport(file: Express.Multer.File): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    findOneProject(id: number): Promise<{
        party: {
            id: number;
            name: string;
            code: string | null;
        } | null;
    } & {
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        partyId: number | null;
        updatedAt: Date;
        code: string | null;
        isActive: boolean;
        description: string | null;
    }>;
    createProject(dto: CreateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        partyId: number | null;
        updatedAt: Date;
        code: string | null;
        isActive: boolean;
        description: string | null;
    }>;
    updateProject(id: number, dto: UpdateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        partyId: number | null;
        updatedAt: Date;
        code: string | null;
        isActive: boolean;
        description: string | null;
    }>;
    removeProject(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        partyId: number | null;
        updatedAt: Date;
        code: string | null;
        isActive: boolean;
        description: string | null;
    }>;
    findAllProducts(search?: string, activeOnly?: string, page?: string, limit?: string): Promise<{
        data: {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            specification: string | null;
            businessLine: string | null;
            productName: string;
            productCode: string;
            updatedAt: Date;
            isActive: boolean;
            description: string | null;
            hsnCode: string | null;
            uom: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    downloadProductTemplate(res: Response): void;
    previewProductImport(file: Express.Multer.File): Promise<{
        preview: unknown[];
        total: number;
    }>;
    confirmProductImport(file: Express.Multer.File): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    findOneProduct(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        specification: string | null;
        businessLine: string | null;
        productName: string;
        productCode: string;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        hsnCode: string | null;
        uom: string | null;
    }>;
    createProduct(dto: CreateProductDto): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        specification: string | null;
        businessLine: string | null;
        productName: string;
        productCode: string;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        hsnCode: string | null;
        uom: string | null;
    }>;
    updateProduct(id: number, dto: UpdateProductDto): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        specification: string | null;
        businessLine: string | null;
        productName: string;
        productCode: string;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        hsnCode: string | null;
        uom: string | null;
    }>;
    removeProduct(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        specification: string | null;
        businessLine: string | null;
        productName: string;
        productCode: string;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        hsnCode: string | null;
        uom: string | null;
    }>;
    findAllPos(search?: string, partyId?: string, page?: string, limit?: string): Promise<{
        data: ({
            party: {
                id: number;
                name: string;
                code: string | null;
            } | null;
            project: {
                id: number;
                name: string;
                code: string | null;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            date: Date | null;
            partyId: number | null;
            projectId: number | null;
            updatedAt: Date;
            isActive: boolean;
            poNumber: string;
            imageLink: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    downloadPoTemplate(res: Response): void;
    previewPoImport(file: Express.Multer.File): Promise<{
        preview: unknown[];
        total: number;
    }>;
    confirmPoImport(file: Express.Multer.File): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    findOnePo(id: number): Promise<{
        party: {
            id: number;
            name: string;
        } | null;
        project: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date | null;
        partyId: number | null;
        projectId: number | null;
        updatedAt: Date;
        isActive: boolean;
        poNumber: string;
        imageLink: string | null;
    }>;
    createPo(dto: CreatePoDto): Promise<{
        party: {
            id: number;
            name: string;
        } | null;
        project: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date | null;
        partyId: number | null;
        projectId: number | null;
        updatedAt: Date;
        isActive: boolean;
        poNumber: string;
        imageLink: string | null;
    }>;
    updatePo(id: number, dto: UpdatePoDto): Promise<{
        party: {
            id: number;
            name: string;
        } | null;
        project: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date | null;
        partyId: number | null;
        projectId: number | null;
        updatedAt: Date;
        isActive: boolean;
        poNumber: string;
        imageLink: string | null;
    }>;
    removePo(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date | null;
        partyId: number | null;
        projectId: number | null;
        updatedAt: Date;
        isActive: boolean;
        poNumber: string;
        imageLink: string | null;
    }>;
}
