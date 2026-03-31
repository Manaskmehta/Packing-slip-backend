import { PrismaService } from '../prisma/prisma.service';
import { CreatePartyDto, UpdatePartyDto } from './dto/party.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreatePoDto, UpdatePoDto } from './dto/po.dto';
export declare class MastersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllParties(search?: string, activeOnly?: boolean, page?: number, limit?: number): Promise<{
        data: {
            id: number;
            name: string;
            createdAt: Date;
            deletedAt: Date | null;
            code: string | null;
            address: string | null;
            phone: string | null;
            gstNo: string | null;
            isActive: boolean;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOneParty(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
        updatedAt: Date;
    }>;
    createParty(dto: CreatePartyDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
        updatedAt: Date;
    }>;
    updateParty(id: number, dto: UpdatePartyDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
        updatedAt: Date;
    }>;
    removeParty(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        code: string | null;
        address: string | null;
        phone: string | null;
        gstNo: string | null;
        isActive: boolean;
        updatedAt: Date;
    }>;
    findAllProjects(search?: string, activeOnly?: boolean, partyId?: number, page?: number, limit?: number): Promise<{
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
            code: string | null;
            isActive: boolean;
            description: string | null;
            partyId: number | null;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
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
        code: string | null;
        isActive: boolean;
        description: string | null;
        partyId: number | null;
        updatedAt: Date;
    }>;
    createProject(dto: CreateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        code: string | null;
        isActive: boolean;
        description: string | null;
        partyId: number | null;
        updatedAt: Date;
    }>;
    updateProject(id: number, dto: UpdateProjectDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        code: string | null;
        isActive: boolean;
        description: string | null;
        partyId: number | null;
        updatedAt: Date;
    }>;
    removeProject(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        deletedAt: Date | null;
        code: string | null;
        isActive: boolean;
        description: string | null;
        partyId: number | null;
        updatedAt: Date;
    }>;
    assertSpecificationUnique(spec: string | null | undefined, excludeProductId?: number): Promise<void>;
    findAllProducts(search?: string, activeOnly?: boolean, page?: number, limit?: number, allowedIds?: number[]): Promise<{
        data: {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            isActive: boolean;
            description: string | null;
            productCode: string;
            productName: string;
            specification: string | null;
            businessLine: string | null;
            hsnCode: string | null;
            uom: string | null;
            defaultBundleQty: number | null;
            defaultNoOfBundles: number | null;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOneProduct(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        description: string | null;
        productCode: string;
        productName: string;
        specification: string | null;
        businessLine: string | null;
        hsnCode: string | null;
        uom: string | null;
        defaultBundleQty: number | null;
        defaultNoOfBundles: number | null;
        updatedAt: Date;
    }>;
    createProduct(dto: CreateProductDto): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        description: string | null;
        productCode: string;
        productName: string;
        specification: string | null;
        businessLine: string | null;
        hsnCode: string | null;
        uom: string | null;
        defaultBundleQty: number | null;
        defaultNoOfBundles: number | null;
        updatedAt: Date;
    }>;
    updateProduct(id: number, dto: UpdateProductDto): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        description: string | null;
        productCode: string;
        productName: string;
        specification: string | null;
        businessLine: string | null;
        hsnCode: string | null;
        uom: string | null;
        defaultBundleQty: number | null;
        defaultNoOfBundles: number | null;
        updatedAt: Date;
    }>;
    removeProduct(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        description: string | null;
        productCode: string;
        productName: string;
        specification: string | null;
        businessLine: string | null;
        hsnCode: string | null;
        uom: string | null;
        defaultBundleQty: number | null;
        defaultNoOfBundles: number | null;
        updatedAt: Date;
    }>;
    generateProductTemplate(): Buffer;
    previewProductsExcel(buffer: Buffer): Promise<{
        preview: unknown[];
        total: number;
    }>;
    importProductsFromExcel(buffer: Buffer): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    generatePartyTemplate(): Buffer;
    previewPartiesExcel(buffer: Buffer): Promise<{
        preview: unknown[];
        total: number;
    }>;
    importPartiesFromExcel(buffer: Buffer): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    generateProjectTemplate(): Buffer;
    previewProjectsExcel(buffer: Buffer): Promise<{
        preview: unknown[];
        total: number;
    }>;
    importProjectsFromExcel(buffer: Buffer): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    generatePoTemplate(): Buffer;
    previewPosExcel(buffer: Buffer): Promise<{
        preview: unknown[];
        total: number;
    }>;
    importPosFromExcel(buffer: Buffer): Promise<{
        imported: number;
        updated: number;
        skipped: number;
    }>;
    findAllPos(search?: string, partyId?: number, page?: number, limit?: number): Promise<{
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
            isActive: boolean;
            partyId: number | null;
            poNumber: string;
            imageLink: string | null;
            date: Date | null;
            projectId: number | null;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
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
        isActive: boolean;
        partyId: number | null;
        poNumber: string;
        imageLink: string | null;
        date: Date | null;
        projectId: number | null;
        updatedAt: Date;
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
        isActive: boolean;
        partyId: number | null;
        poNumber: string;
        imageLink: string | null;
        date: Date | null;
        projectId: number | null;
        updatedAt: Date;
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
        isActive: boolean;
        partyId: number | null;
        poNumber: string;
        imageLink: string | null;
        date: Date | null;
        projectId: number | null;
        updatedAt: Date;
    }>;
    removePo(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        partyId: number | null;
        poNumber: string;
        imageLink: string | null;
        date: Date | null;
        projectId: number | null;
        updatedAt: Date;
    }>;
}
