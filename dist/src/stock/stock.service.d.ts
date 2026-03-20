import { PrismaService } from '../prisma/prisma.service';
export declare class StockService {
    private prisma;
    constructor(prisma: PrismaService);
    getCurrentStock(search?: string): Promise<{
        stock: {
            productCode: string;
            productName: string;
            totalInward: number;
            totalOutward: number;
            available: number;
            totalKgInward: number;
            totalKgOutward: number;
            availableKg: number;
        }[];
        summary: {
            totalInwardPcs: number;
            totalOutwardPcs: number;
            totalAvailable: number;
        };
    }>;
    getDashboardStats(): Promise<{
        totalInwardPcs: number;
        totalOutwardPcs: number;
        availableStock: number;
        totalPackingSlips: number;
        printedSlips: number;
    }>;
}
