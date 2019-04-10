import openSocket from 'socket.io-client';
const  socket = openSocket('http://18.191.24.252:3900');

 async function subscribeToTimer(cb, userID) {
//   socket.on('ticketUpdate', this.handleIt());
  //  socket.on('ticketUpdate2', ticker => console.log(ticker))
  //   socket.on('tickerUpdate', async function(data){
  //     await data.json();
  //     console.log('The data is '+data)
  //   })
  socket.on('tickerUpdate', ticker => cb(ticker));
  socket.emit('subscribeToTimer', userID);
}

export async function subscribeToTimerAnon(cb) {
  //   socket.on('ticketUpdate', this.handleIt());
    //  socket.on('ticketUpdate2', ticker => console.log(ticker))
    //   socket.on('tickerUpdate', async function(data){
    //     await data.json();
    //     console.log('The data is '+data)
    //   })
    socket.on('tickerUpdate', ticker => cb(ticker));
    socket.emit('subscribeToTimerAnon');
  }
  

export default subscribeToTimer;

// import openSocket from 'socket.io-client';
// const  socket = openSocket('http://18.191.24.252:3900');

// function subscribeToTimer(cb, userID) {
//   socket.on('timer', timestamp => cb(timestamp));
//   socket.emit('subscribeToTimer', userID);
// }

// export default subscribeToTimer;