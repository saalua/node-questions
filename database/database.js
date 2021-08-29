const Sequelize = require('sequelize');

// const connection = new Sequelize('postgres', 'usuario', 'senha', {
//     host: 'localhost',
//     dialect: 'postgres'
// });

const connection = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = connection;

