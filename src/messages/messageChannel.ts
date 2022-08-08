import 'dotenv/config';
import { Channel , connect } from 'amqplib';

/* criar conexao e canal de mensagens para comunicação */
export const createMessageChannel = async (): Promise<Channel | null> => {
  try {
    const connection = await connect(`${process.env.AMQP_SERVER}`);
    const channel = await connection.createChannel();
    await channel.assertQueue(`${process.env.QUEUE_NAME}`);
    console.log('====== Connected to RabbitMQ =========');
    return channel;
    
  } catch (error) {
    console.log('====== Error while trying to connect to RabbitMQ ======');
    console.log(error);
    return null;
  }
}