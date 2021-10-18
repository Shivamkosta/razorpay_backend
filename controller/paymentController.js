const Razorpay = require("razorpay");
const uniqId = require("uniqid");
const path = require("path");
const Formidable = require("formidable");
const { createHmac } = require("crypto");
const orderSchema = require("../model/orderSchema");
const request = require("request");

let orderId;

/*
{
  hidden: '',
  razorpay_payment_id: 'pay_I9BHO45Nhk2kVf',
  razorpay_order_id: 'order_I9BEdmNxagZYUx',
  razorpay_signature: '31934d3a89a099ff96bd3027f0a1cedd72a7c301c0fefa75031ee078ded9cc7e',
  org_logo: '',
  org_name: 'Razorpay Software Private Ltd',
  checkout_logo: 'https://cdn.razorpay.com/logo.png',
  custom_branding: 'false'
}

*/

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRETE_KEY,
});

exports.createOrder = async (req, res) => {
  try {
    var options = {
      amount: 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: uniqId(),
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      orderId = order.id;
      res.json(order);
      console.log(order);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.paymentCallback = async (req, res) => {
  try {
    const form = Formidable();
    form.parse(req, (err, fields, files) => {
      if (fields) {
        console.log("FIELDS", fields);

        const hash = createHmac("sha256", process.env.SECRETE_KEY)
          .update(orderId + "|" + fields.razorpay_payment_id)
          .digest("hex");

        if (fields.razorpay_signature === hash) {
          // store details in DB
          const info = {
            _id: fields.razorpay_payment_id,
            razorpay_order_id: fields.razorpay_order_id,
          };
          const order = new orderSchema({
            _id: info._id,
            orders: info.razorpay_order_id,
          });

          order.save((err, data) => {
            if (err) {
              res.status(400).json({ error: "Not able to save in DB" });
            } else {
              res.redirect(
                `${process.env.FRONTEND}/payment/status/${fields.razorpay_payment_id}`
              );
            }
          });
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPaymentDetails = async (req, res) => {
  orderSchema.findById(req.params.paymentId).exec((err, data) => {
    if (err) {
      return res.status(404).json({ error: "No Orders Found" });
    } else {
      request(
        `https://${process.env.KEY_ID}:${process.env.SECRETE_KEY}@api.razorpay.com/v1/payments/${req.params.paymentId}`,
        function (error, response, body) {
          if (error) {
            res.status(500).json({ error: "Internal server error" });
          }
          const result = JSON.parse(body);
          console.log("RESULT:", result);
          return res.status(200).json(result);
        }
      );
    }
  });
};

exports.getLogo = async (req, res) => {
  res.sendFile(path.join(__dirname, "../wear-mask.svg"));
};
