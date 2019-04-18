This is an custom cryptocurrency tracking app created by me using full MERN (React/Redux) stack system.
Features include:
-Real time ticker updates via socket.io pushed from Node
-Ability for users to register & login and create their own account
   .authentication uses JWT token
   .bcrypt and salt for password hashing
   .Joi Browser validation
-Backend uses express for http route / api handling
    .API accepts update calls with user ID to find list of coins user has customized lookup from MongoDB
    .API accepts update calls with NO user ID for anonymous dispalying of crypto coins handling demo
-Mongoose for object data structures
-Socket.IO subscription & disconnect handling for sending new ticker data real time
-React/Redux used to update ticker & user states
