const express = require("express");
const path = require("path");
const app = express();
const paypal = require("paypal-rest-sdk");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["POST"],
  })
);
const PaymentController = express.Router();
var PAYPAL_API = "https://api-m.sandbox.paypal.com";

paypal.configure({
  mode: "sandbox",
  client_id:
    "AXm3ViWfLHNa-iwq4ipvXvJ6oMXh5_kJeDJHJYBS0WlUshsce26gebFdSZ5Yg6xMU2QTyhSC1wQ6wLWj",
  client_secret:
    "EDhq-PkAwhbRwfCqHGXbL4Gi0TozeT3CCQ8Rq2P_4X7bBpsffVU1GYO-tQUYnf7W55FpSyRU0IoxCd_6",
});

// start payment process
PaymentController.post("/", async (req, res) => {
  const { total, redirect, cancelRedirect } = req.body;

  if (!total || !redirect) {
    return res.status(400).json({
      message:
        "Fields are missing from request body. Requires a subtotal and a redirect URL.",
    });
    // create payment object
  }

  var payment = {
    intent: "authorize",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      /*"return_url": "http://127.0.0.1:3000/success",
		"cancel_url": "http://127.0.0.1:3000/err"*/
      return_url: redirect,
      cancel_url: cancelRedirect || redirect,
    },
    transactions: [
      {
        amount: {
          total: total,
          currency: "CAD",
        },
        description: " Your PawsApp purchase ",
      },
    ],
  };

  // call the create Pay method
  createPay(payment)
    .then((transaction) => {
      var id = transaction.id;
      var links = transaction.links;
      var counter = links.length;
      while (counter--) {
        if (links[counter].method == "REDIRECT") {
          // redirect to paypal where user approves the transaction
          // return res.redirect(links[counter].href);
          return res.json({
            paypal: links[counter].href
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: `Payment failed. We'll get 'em next time.`,
      });
    });
});

var createPay = (payment) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, function (err, payment) {
      if (err) {
        reject(err);
      } else {
        resolve(payment);
      }
    });
  });
};

exports.PaymentController = PaymentController;
