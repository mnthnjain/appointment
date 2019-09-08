# Appointment
Appointmnet is appointment tracker web-app developed in MEAN stack
## Setup 
Pre-requisite

1)Mongo Db

2)Node

3)npm

Create a DB wtih name "appointment" in your MongoDB

## Installation
Go to the project folder, and install dependencies
```bash
npm install
```

## Runing the project Development Stage
Update the env variable in constant.js file to "dev", clone submodule "client/appointment-client" and follow its git readme.md for dev setup
```bash
nodemon server.js
```

## Running the project in production setup
Update the env variable in constant.js file to "prod"
```bash
npm start
```

If you have updated the angular code and want to test your changes, copy the build from its dist/appointment-client folder to client folder in this app and restart the server


