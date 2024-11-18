import { Injectable } from '@nestjs/common';
import { NotificationGateway } from 'apps/notification-service/src/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async processTransferNotification(data: {
    fromUserId: string;
    toUserId: string;
    amount: number;
  }) {
    const { amount, fromUserId, toUserId } = data;

    const senderMessage = `Вы перевели ${amount} $ пользователю ${toUserId}`;
    const receiverMessage = `Пользователь ${fromUserId} отправил вам ${amount} $`;

    await Promise.all([
      this.notificationGateway.sendNotification(
        fromUserId,
        'transfer_notification',
        senderMessage,
      ),
      this.notificationGateway.sendNotification(
        toUserId,
        'transfer_notification',
        receiverMessage,
      ),
    ]);
  }
}
