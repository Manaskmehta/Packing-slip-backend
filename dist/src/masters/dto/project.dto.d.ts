export declare class CreateProjectDto {
    code?: string;
    name: string;
    description?: string;
    partyId?: number;
    isActive?: boolean;
}
export declare class UpdateProjectDto extends CreateProjectDto {
}
