import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PurchaseSubscriptionDto } from './dto/purchaseSubscriptionDto';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlan(createPlan: CreateSubscriptionPlanDto) {
    return this.prisma.subscriptionPlan.create({
      data: {
        name: createPlan.name,
        price: createPlan.price,
        durationDays: createPlan.durationDays,
        features: createPlan.features,
        isActive: createPlan.isActive,
      },
    });
  }

  async getPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    return { success: true, data: plans };
  }

  async purchasePlan(userId: string, dto: PurchaseSubscriptionDto) {
    const { plan_id, payment_method, auto_renew, payment_details } = dto;

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: plan_id },
    });

    if (!plan || !plan.isActive) {
      throw new NotFoundException('Tanlangan obuna rejasi mavjud emas');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const userSubscription = await this.prisma.userSubscription.create({
      data: {
        userId,
        planId: plan.id,
        startDate,
        endDate,
        status: SubscriptionStatus.active,
        autoRenew: auto_renew,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        userSubscriptionId: userSubscription.id,
        amount: plan.price,
        paymentMethod: payment_method,
        paymentDetails: payment_details,
        status: PaymentStatus.completed,
        externalTransactionId: `txn_${Math.floor(Math.random() * 1000000000)}`,
      },
    });

    return {
      success: true,
      message: 'Obuna muvaffaqiyatli sotib olindi',
      data: {
        subscription: {
          id: userSubscription.id,
          plan: {
            id: plan.id,
            name: plan.name,
          },
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: userSubscription.status,
          auto_renew: userSubscription.autoRenew,
        },
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          external_transaction_id: payment.externalTransactionId,
          payment_method: payment.paymentMethod,
        },
      },
    };
  }
}
