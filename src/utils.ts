import { User } from "./entities/User";
import { DataSource } from "typeorm";
require('dotenv').config()

console.log('ENV VARIABLES', process.env)
const datasource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User],
  logging: ["query", "error"],
});

export default datasource;
