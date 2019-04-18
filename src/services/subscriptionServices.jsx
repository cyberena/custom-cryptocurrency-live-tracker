import openSocket from 'socket.io-client';
const  socket = openSocket('http://18.221.49.186:3900');

 async function subscribeToTimer(cb, userID) {
   console.log("sub timer");
   console.log(userID);
  socket.on('tickerUpdate', ticker => cb(ticker));
  socket.emit('subscribeToTimer', userID);
}

export default subscribeToTimer;
