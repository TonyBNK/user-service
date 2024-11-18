import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from 'apps/notification-service/src/notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('transfer_notification')
  async handleTransferNotification(
    @Payload() data: { fromUserId: string; toUserId: string; amount: number },
  ) {
    await this.notificationService.processTransferNotification(data);
  }
}
