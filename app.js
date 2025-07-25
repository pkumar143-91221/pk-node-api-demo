var express = require("express")
var cors = require('cors')
var expenseStore = require("./expensedb.js")
var app = express()
app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
   console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
app.get("/", (req, res, next) => {
   res.json({ "message": "Ok" })
});
app.get("/api/expenses", (req, res, next) => {
   expenseStore.find({}, function (err, docs) {
      res.json(docs);
   });
});
app.get("/api/expense/:id", (req, res, next) => {
   var id = req.params.id;
   expenseStore.find({ _id: id }, function (err, docs) {
      res.json(docs);
   })
});
app.post("/api/expense/", (req, res, next) => {
   var errors = []
   // console.log("Request ::>", req.body);
   if (!req.body.item) {
      errors.push("No item specified");
   }
   var data = {
      name: req.body.item.name,
      amount: req.body.item.amount,
      category: req.body.item.category,
      spend_date: req.body.item.spend_date,
   }
   // console.log("Data ::>", data);
   expenseStore.insert(data, function (err, docs) {
      return res.json(docs);
   });
})
app.put("/api/expense/:id", (req, res, next) => {
   var id = req.params.id;
   var errors = []
   if (!req.body.item) {
      errors.push("No item specified");
   }
   var data = {
      _id: id,
      name: req.body.item.name,
      amount: req.body.item.amount,
      category: req.body.item.category,
      spend_date: new Date(req.body.item.spend_date),
   }
   expenseStore.update( { _id: id }, data, function (err, docs) {
      return res.json(data);
   });
})
app.delete("/api/expense/:id", (req, res, next) => {
   var id = req.params.id;
   expenseStore.remove({ _id: id }, function (err, numDeleted) {
      res.json({ "message": "deleted" })
   });
})
app.use(function (req, res) {
   res.status(404);
});