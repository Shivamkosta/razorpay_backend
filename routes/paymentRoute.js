const express = require("express");
const router = express.Router();

const {
  createOrder,
  paymentCallback,
  getLogo,
  getPaymentDetails,
} = require("../controller/paymentController");

router.get("/createorder", createOrder);
router.post("/payment/callback", paymentCallback);
router.get("/payments/:paymentId", getPaymentDetails);
router.get("/logo", getLogo);

module.exports = router;
