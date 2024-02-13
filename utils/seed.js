const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connected! Seeding...');

    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }

    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
        await connection.dropCollection('thoughts');
    }

    const users = [
        {
            username: 'jreacher',
            email: 'jreacher@gmail.com'
        },
        {
            username: 'dfuss',
            email: 'dfuss@yahoo.com'
        },
        {
            username: 'wickj',
            email: 'jwick@hotmail.com'
        }
    ];

    const thoughts = [
        {
            thoughtText: 'You were the chosen one! It was said that you would destroy the Sith, not join them!',
            username: 'skyanak'
        },
        {
            thoughtText: 'This is pretty dang cool',
            username: 'somerandomuser'
        },
        {
            thoughtText: 'Anotha one',
            username: 'djkhaled'
        }
    ];

    await User.collection.insertMany(users);
    await Thought.collection.insertMany(thoughts);

    console.table(users);
    console.table(thoughts);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});