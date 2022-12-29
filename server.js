process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥 Shutting Down ...');
  console.error(err.name, err.message);
  process.exit(1);
});

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// mongoose.connect(DB).then((con) => {
//   console.log(con.connections);
//   console.log('DB connection successful!');
// });

console.log(app.get('env'));
// console.log(process.env);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('ERROR 💥', err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('Server Listening...');
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log('UNHANDLED REJECTION!💥 Shutting Down ...');
  server.close(() => process.exit(1));
});
