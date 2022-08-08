import 'dotenv/config'; // importando variaveis ambiente
import axios from 'axios';
import Period from './enums/Period';
import Candle from './models/Candle';
import { createMessageChannel } from './messages/messageChannel';

const readMarketPrice = async (): Promise<number> => {
  const response = await axios.get(`${process.env.PRICES_API}`);
  const price = response.data.bitcoin.usd;
  console.log(`====== Price: ${price} ========`);
  return price;
}

const generateCandles = async () => {
  // só vou gerar se tiver conexão
  const messageChannel = await createMessageChannel();

  if (messageChannel) {
    while (true) {
      //definindo o periodo e quantidade dos loops
      const loopTimes = Period.TEN_MINUTES / Period.TEN_SECONDS;
      const candle = new Candle('BTC');
      console.log('=========== Generating New Candle =========');

      for (let i = 0; i < loopTimes; i++) {
        const price = await readMarketPrice();
        candle.addValue(price);
        console.log(`==== Market price ${price} de ${i + 1} of ${loopTimes} =======`);
        await new Promise(resolve => setTimeout(resolve, Period.THIRTY_SECONDS));
      }

      candle.closeCandle();

      console.log(candle.toSimpleObject());

      const itemCandle = candle.toSimpleObject();

      //preciso converter para uma string json, é o formato aceito pela vida
      const candleJson = JSON.stringify(itemCandle);

      messageChannel.sendToQueue(`${process.env.QUEUE_NAME}`, Buffer.from(candleJson));

      console.log('Candle sent to qeue');
    }
  }
}

generateCandles();