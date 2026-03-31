import { StockService } from './stock.service';
export declare class StockController {
    private stock;
    constructor(stock: StockService);
    getCurrentStock(search?: string): Promise<{
        stock: {
            productCode: string;
            productName: string;
            totalInward: number;
            totalOutward: number;
            available: number;
        }[];
        summary: {
            totalInwardPcs: number;
            totalOutwardPcs: number;
            totalAvailable: number;
        };
    }>;
    getDashboard(): Promise<{
        totalInwardPcs: number;
        totalOutwardPcs: number;
        availableStock: number;
        totalPackingSlips: number;
        printedSlips: number;
    }>;
}
