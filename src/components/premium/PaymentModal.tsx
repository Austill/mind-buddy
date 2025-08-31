import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Shield, Star, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
  };
}

const paymentMethods = [
  {
    id: "instasend",
    name: "InstaSend",
    description: "Pay with mobile money or bank transfer",
    logo: "📱",
    supported: ["Mobile Money", "Bank Transfer", "Card"]
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Secure payments across Africa",
    logo: "🏦",
    supported: ["Cards", "Mobile Money", "Bank Transfer"]
  },
  {
    id: "paystack",
    name: "Paystack",
    description: "Nigeria's leading payment processor",
    logo: "💳",
    supported: ["Cards", "Bank Transfer", "USSD"]
  },
  {
    id: "paga",
    name: "Paga",
    description: "Pay with Paga wallet or bank",
    logo: "📊",
    supported: ["Paga Wallet", "Bank Transfer"]
  }
];

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("instasend");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Here you would integrate with your selected payment provider
    console.log("Processing payment with:", selectedMethod, paymentData, plan);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment processed successfully! Welcome to SereniTree Premium!");
      onClose();
    }, 3000);
  };

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Upgrade to SereniTree Premium
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card className="p-4 bg-gradient-to-r from-[hsl(var(--wellness-primary)/0.1)] to-[hsl(var(--wellness-secondary)/0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[hsl(var(--wellness-primary))]">
                  {plan.price}
                </div>
                <div className="text-sm text-muted-foreground">{plan.period}</div>
              </div>
            </div>
          </Card>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold mb-4">Choose Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-[hsl(var(--wellness-primary))] bg-[hsl(var(--wellness-primary)/0.05)]'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{method.logo}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {method.supported.map((support) => (
                          <Badge key={support} variant="secondary" className="text-xs">
                            {support}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-[hsl(var(--wellness-primary))] mr-2" />
              <h3 className="font-semibold">Payment Details</h3>
              <Badge className="ml-auto bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                SSL Secured
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={paymentData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {(selectedMethod === "instasend" || selectedMethod === "flutterwave" || selectedMethod === "paystack") && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Card Information</h4>
                    <div className="space-y-2">
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={paymentData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          type="text"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="text"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedMethod === "paga" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Paga Wallet Information</h4>
                    <div className="space-y-2">
                      <Label htmlFor="pagaAccount">Paga Account Number</Label>
                      <Input
                        id="pagaAccount"
                        name="pagaAccount"
                        type="text"
                        placeholder="Enter your Paga account number"
                        value={paymentData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))] text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${plan.price} with ${selectedPaymentMethod?.name}`
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 inline mr-1" />
            Your payment information is encrypted and secure. We don't store your card details.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}