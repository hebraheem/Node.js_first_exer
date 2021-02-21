const express = require("express");
const routes = require("./routes");
const http = require("http");
const path = require("path");
const urlencoded = require("url");
const bodyParser = require("body-parser");
const json = require("json");
const logger = require("logger");
const methodOveride = require("method-override");
const { process } = require("ipaddr.js");
const nano = require("nano")("http://localhost:5984");
const db = nano.use("address");
const app = express();

app.set("port", process.env?.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOveride());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", routes.index);

app.post("/createdb", (req, res) => {
  nano.db.create(req.body_dbname, (err) => {
    if (err) {
      res.send("Error creating database" + " " + req.body.dbname);
      return;
    }
    res.send("Database" + " " + req.body.dbname + " " + "created succesfully");
  });
});

app.post("/new_contact", (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;

  db.insert({ name, phone, crazy: true }, phone, (err, body, header) => {
    if (err) res.send("Creating contact failed");
    res.send("Contact created succesfully");
  });
});

app.post("/view_contact", (req, res) => {
  const alldoc = "Following are the contact";
  db.get(req, body, header, { revs_info: true }, (err, body) => {
    if (!err) console.log(body);
    if (body) {
      alldoc += "Name: " + body.name + "</br>Phone number: " + body.phone;
    } else {
      alldoc = "No records found";
    }
    res.send(alldoc);
  });
});

app.post("/delete_contact", (req, res) => {
  db.get(req.body.phone, { revs_info: true }, (err, body) => {
    if (!err) {
      db.destroy(req.body.phone, body._rev, (err, body) => {
        if (err) res.send("Error deleting contact");
      });
    }
    res.send("Successfully deleted contact");
  });
});

http.createServer(app).listen(app.get("port"), () => {
  console.log("express server listening on port" + " " + app.get("port"));
});
