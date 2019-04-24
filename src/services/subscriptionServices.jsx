import openSocket from 'socket.io-client';
const  socket = openSocket('http://18.191.24.252:3900');

 async function subscribeToTimer(cb, userID) {
   console.log("sub timer");
   console.log(userID);
  socket.on('tickerUpdate', ticker => cb(ticker));
  socket.emit('subscribeToTimer', userID);
}

export default subscribeToTimer;
