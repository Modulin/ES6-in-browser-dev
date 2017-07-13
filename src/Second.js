export default class Second {
  constructor() {
    this.name = 'second';
  }

  async printName() {
    await sleep(1000);
    console.log(this.name);
  }
}

function sleep(time) {
   return new Promise(resolve =>{
      setTimeout(resolve, time);
   });
}