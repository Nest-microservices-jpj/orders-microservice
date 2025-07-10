import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from 'generated/prisma';
import { RpcException } from '@nestjs/microservices';

import { ChangeOrderStatusDto, CreateOrderDto, OrderPaginationDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  create(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: createOrderDto,
    });
  }

  async findAll(orderPaginatioDto: OrderPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        status: orderPaginatioDto.status,
      }
    });
    const currentPage = orderPaginatioDto.page;
    const perPage = orderPaginatioDto.limit;
    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginatioDto.status,
        }
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      }
    }
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: {
        id,
      },
    });
    if (!order) {
      throw new RpcException({
        message: `Order #${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return order;
  }

  async changeStatus(changeOrderStatus: ChangeOrderStatusDto) {
    const {id, status} = changeOrderStatus;
    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }
    return this.order.update({
      where: {id},
      data: {status},
    });
  }
}

