const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const pathfile = path.join(__dirname, "userData.db");
let db = null;
const initialdbserver = async () => {
  try {
    db = await open({
      filename: pathfile,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server start at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Error:e.message`);
    process.exit(1);
  }
};
initialdbserver();

//API Ragister
functionresult1 = () => {
  return "User created successfully";
};
functionresult3 = () => {
  return "Password is too short";
};
functionresult = () => {
  return "User already exists";
};

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const isgetindb = `
  SELECT * 
  FROM user 
  WHERE username="${username}"`;
  const ispersent = await db.get(isgetindb);
  if (ispersent === undefined) {
    const insertquery = `
      INSERT INTO 
      user(username,name,password,gender,location)
      VALUES("${username}","${name}","${hashedPassword}","${gender}","${location}")`;
    const postqueryresult = await db.run(insertquery);
    response.status(200);
    response.send(functionresult1());
  } else if (password.length < 5) {
    response.status(400);
    response.send(functionresult3());
  } else {
    response.status(400);
    response.send(functionresult());
  }
});

//Login API 2

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const isueser = `
  SELECT * 
  FROM user 
  WHERE username="${username}"`;
  const userid = await db.get(isueser);
  if (userid === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    iscorrecrpass = await bcrypt.compare(password, userid.password);
    if (iscorrecrpass === true) {
      response.status(200);
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//UPdate API 3

app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const hasedNewPassword = await bcrypt.hash(newPassword, 10);
  const isuserpresent1 = `
  SELECT *
  FROM user
  WHERE username="${username}"`;
  const dbquery = await db.get(isuserpresent1);
  if (dbquery === undefined) {
    response.status(400);
    response.send("User is not ragistred");
  } else {
    const comppass = await bcrypt.compare(oldPassword, dbquery.password);
    if (comppass === true) {
      if (newPassword.length < 5) {
        response.status(400);
        response.send("Password is too short");
      } else {
        const updatepass = `
          UPDATE user
          SET password="${hasedNewPassword}"
          WHERE username="${username}"`;
        const final = await db.run(updatepass);
        response.status(200);
        response.send("Password updated");
      }
    } else {
      response.status(400);
      response.send("Invalid current password");
    }
  }
});

module.exports = app;
