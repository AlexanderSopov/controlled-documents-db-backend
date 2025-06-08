import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['entities/**/*.ts'],
  migrations: ['migrations/**/*.ts'],
  synchronize: false, // Set to false to prevent auto-schema changes
  logging: true, // Enable for debugging
});

