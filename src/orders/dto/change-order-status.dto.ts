import { IsEnum, IsUUID } from "class-validator";
import { OrderStatus } from "generated/prisma";
import { OrderStatusList } from "../enum/order.enum";

export class ChangeOrderStatusDto {

    @IsUUID(4)
    id: string

    @IsEnum(OrderStatusList, {
        message: `status must be one of ${OrderStatusList}`
    })
    status: OrderStatus;
}