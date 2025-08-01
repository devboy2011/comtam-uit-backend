module.exports = {
  vnp_TmnCode:process.env.VNPAY_TMNCODE,
  vnp_HashSecret:process.env.VNPAY_HASHSECRET,
  vnp_Url : "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api : "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl :  `https://localhost:443/api/v0/order/vnpay_return` 
}