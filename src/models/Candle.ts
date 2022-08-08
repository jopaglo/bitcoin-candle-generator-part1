import CandleColor from "../enums/CandleColor"

export default class Candle {
  low: number 
  high: number
  open: number
  close: number
  color: CandleColor
  finalDateTime: Date
  values: number[]
  currency: string
  
  constructor(currency: string){
    this.currency = currency;
    this.low = Infinity; // maior valor possível
    this.high = 0; // menor valor possível
    this.close = 0;
    this.open = 0;
    this.values = [];
    this.color = CandleColor.UNDETERMINED;
    this.finalDateTime = new Date();
  }

  addValue(value:number){
    this.values.push(value);

    if(this.values.length === 1){
      this.open = value;
    }

    if(this.low > value){
      this.low = value;
    }

    if(this.high < value){
      this.high = value;
    }
  }

  closeCandle(){
    // precisa ao menos ter 1 leitura para fechar a candle
    if(this.values.length > 0){
      this.close = this.values[this.values.length - 1];
      this.finalDateTime = new Date();

      //definindo a cor do fechamento da candle
      if(this.open > this.close){
        this.color = CandleColor.RED;
      }

      if(this.close > this.open){
        this.color = CandleColor.GREEN;
      }
    }
  }

  // quero formatar o objeto antes de enviar para a mensageria
  toSimpleObject(){
    const { values , ...otherInfos} = this;
    return otherInfos;
  }
}