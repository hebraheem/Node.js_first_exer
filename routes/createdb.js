const nano = require("nano");

exports.create = function (req, res) {
  nano.db.create(req.body.dbname, (err) => {
    if (err) res.send("error creating database");
    res.send("Database created successfully");
  });
};
