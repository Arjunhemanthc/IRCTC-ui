export interface RazorpayOrder { 
  orderId: string; 
  amount: number; 
  currency: string; 
  keyId: string; 
  pnr: string; 
  userName: string; 
  userEmail: string; 
  userPhone: string; 
  paymentDeadline: string; 
}

export interface VerifyPaymentRequest { 
  razorpayOrderId: string; 
  razorpayPaymentId: string; 
  razorpaySignature: string; 
  pnr: string; 
}
