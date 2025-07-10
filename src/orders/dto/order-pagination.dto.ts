import { PaginationDto } from 'src/common';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';
import { OrderStatus } from 'generated/prisma';
export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `status must be one of ${OrderStatusList}`
    })
    status?: OrderStatus
}