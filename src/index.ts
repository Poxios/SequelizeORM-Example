import express from "express";
import { Model, Sequelize, STRING } from "sequelize";
const app = express();
const port = 3000;

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // SQLite 사용할시에만
  storage: "test.sqlite",
});

sequelize
  .authenticate()
  .then(async () => {
    console.log("Connection has been established successfully.");
    interface IUser {
      firstName: string;
      lastName: string;
    }
    const User = sequelize.define<Model<IUser>>("user", {
      firstName: {
        type: STRING,
      },
      lastName: {
        type: STRING,
      },
    });
    await User.sync({ force: false });
    await User.create({
      firstName: "Test",
      lastName: "User",
    });
    await User.create({
      firstName: "Test",
      lastName: "User",
    });
    console.log(await User.findAll());
    const targetUser = await User.findOne({ where: { firstName: "Test" } });
    await targetUser.update({ firstName: "test" });
    console.log(targetUser.toJSON());
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
