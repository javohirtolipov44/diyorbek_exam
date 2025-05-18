import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { PurchaseSubscriptionDto } from './dto/purchaseSubscriptionDto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('plan')
  @Roles('admin', 'superadmin')
  @UseGuards(JwtAuthGuard)
  createPlan(@Body() createPlan: CreateSubscriptionPlanDto, @Req() req: any) {
    return this.subscriptionService.createPlan(createPlan);
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  purchaseSubscription(@Body() dto: PurchaseSubscriptionDto, @Req() req: any) {
    const userId = req.user['userId'];
    return this.subscriptionService.purchasePlan(userId, dto);
  }

  @Get('plans')
  findPlans() {
    return this.subscriptionService.getPlans();
  }
}
