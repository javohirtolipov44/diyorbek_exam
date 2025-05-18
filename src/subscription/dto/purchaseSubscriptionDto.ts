import { IsEnum, IsBoolean, IsObject, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class PurchaseSubscriptionDto {
  @IsString()
  plan_id: string;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsBoolean()
  auto_renew: boolean;

  @IsObject()
  payment_details: any;
}
