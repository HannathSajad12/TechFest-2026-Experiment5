// Optional: npm run seed  -> adds the same sample events used in the React app
require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Event.deleteMany({});
  await Event.insertMany([
    { name: 'Coding Contest', category: 'Technical', fee: 100, seats: 50 },
    { name: 'Web Dev Workshop', category: 'Workshop', fee: 300, seats: 60 },
    { name: 'Robotics Challenge', category: 'Technical', fee: 700, seats: 25 },
    { name: 'Cultural Night', category: 'Cultural', fee: 0, seats: 200 },
    { name: 'Football Tournament', category: 'Sports', fee: 150, seats: 80 }
  ]);
  console.log('Sample events added');
  process.exit();
});
