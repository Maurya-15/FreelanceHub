import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  Shield,
  CheckCircle,
  Settings,
  Download,
  Receipt,
  FileText,
  Globe,
  Banknote,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: "stripe" | "paypal" | "razorpay" | "bank";
  isEnabled: boolean;
  isConnected: boolean;
  commission: number;
  supportedCurrencies: string[];
  logo: string;
}

interface InvoiceSettings {
  companyName: string;
  companyAddress: string;
  gstNumber: string;
  panNumber: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  autoGenerate: boolean;
  includeGST: boolean;
  gstRate: number;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "stripe",
    name: "Stripe",
    type: "stripe",
    isEnabled: true,
    isConnected: true,
    commission: 2.9,
    supportedCurrencies: ["USD", "EUR", "GBP", "INR"],
    logo: "🟦",
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "paypal",
    isEnabled: true,
    isConnected: false,
    commission: 3.5,
    supportedCurrencies: ["USD", "EUR", "GBP"],
    logo: "🅿️",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    type: "razorpay",
    isEnabled: true,
    isConnected: true,
    commission: 2.0,
    supportedCurrencies: ["INR"],
    logo: "🟢",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    type: "bank",
    isEnabled: false,
    isConnected: true,
    commission: 0,
    supportedCurrencies: ["INR", "USD"],
    logo: "🏦",
  },
];

export function PaymentIntegration() {
  const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    companyName: "FreelanceHub Services",
    companyAddress: "123 Business Street, Mumbai, India",
    gstNumber: "27AAAAA0000A1Z5",
    panNumber: "AAAAA0000A",
    bankDetails: {
      accountName: "FreelanceHub Services",
      accountNumber: "1234567890",
      ifscCode: "HDFC0000123",
      bankName: "HDFC Bank",
    },
    autoGenerate: true,
    includeGST: true,
    gstRate: 18,
  });

  const togglePaymentMethod = (methodId: string) => {
    setMethods((prev) =>
      prev.map((method) =>
        method.id === methodId
          ? { ...method, isEnabled: !method.isEnabled }
          : method,
      ),
    );
  };

  const connectPaymentMethod = (methodId: string) => {
    // In a real app, this would open OAuth flow
    console.log(`Connecting to ${methodId}`);
    setMethods((prev) =>
      prev.map((method) =>
        method.id === methodId ? { ...method, isConnected: true } : method,
      ),
    );
  };

  const updateInvoiceSettings = (field: string, value: any) => {
    setInvoiceSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updateBankDetails = (field: string, value: string) => {
    setInvoiceSettings((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment & Billing</h2>
          <p className="text-muted-foreground">
            Manage payment methods, invoicing, and tax settings
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Reports
        </Button>
      </div>

      <Tabs defaultValue="methods" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
          <TabsTrigger value="taxes">Taxes & GST</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Payment Methods */}
        <TabsContent value="methods">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {methods.map((method) => (
              <Card
                key={method.id}
                className="border-0 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.logo}</span>
                      <div>
                        <h3 className="font-semibold">{method.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {method.commission}% transaction fee
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={method.isEnabled}
                      onCheckedChange={() => togglePaymentMethod(method.id)}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge
                      className={
                        method.isConnected
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }
                    >
                      {method.isConnected ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        "Not Connected"
                      )}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Supported Currencies
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {method.supportedCurrencies.map((currency) => (
                        <Badge
                          key={currency}
                          variant="outline"
                          className="text-xs"
                        >
                          {currency}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {!method.isConnected ? (
                    <Button
                      className="w-full"
                      onClick={() => connectPaymentMethod(method.id)}
                    >
                      Connect {method.name}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Test Payment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Invoicing */}
        <TabsContent value="invoicing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={invoiceSettings.companyName}
                    onChange={(e) =>
                      updateInvoiceSettings("companyName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Input
                    id="company-address"
                    value={invoiceSettings.companyAddress}
                    onChange={(e) =>
                      updateInvoiceSettings("companyAddress", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gst-number">GST Number</Label>
                    <Input
                      id="gst-number"
                      value={invoiceSettings.gstNumber}
                      onChange={(e) =>
                        updateInvoiceSettings("gstNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan-number">PAN Number</Label>
                    <Input
                      id="pan-number"
                      value={invoiceSettings.panNumber}
                      onChange={(e) =>
                        updateInvoiceSettings("panNumber", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    value={invoiceSettings.bankDetails.accountName}
                    onChange={(e) =>
                      updateBankDetails("accountName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    value={invoiceSettings.bankDetails.accountNumber}
                    onChange={(e) =>
                      updateBankDetails("accountNumber", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ifsc-code">IFSC Code</Label>
                    <Input
                      id="ifsc-code"
                      value={invoiceSettings.bankDetails.ifscCode}
                      onChange={(e) =>
                        updateBankDetails("ifscCode", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input
                      id="bank-name"
                      value={invoiceSettings.bankDetails.bankName}
                      onChange={(e) =>
                        updateBankDetails("bankName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-generate Invoices</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically create invoices when payments are received
                      </p>
                    </div>
                    <Switch
                      checked={invoiceSettings.autoGenerate}
                      onCheckedChange={(checked) =>
                        updateInvoiceSettings("autoGenerate", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Include GST</h4>
                      <p className="text-sm text-muted-foreground">
                        Add GST calculations to invoices
                      </p>
                    </div>
                    <Switch
                      checked={invoiceSettings.includeGST}
                      onCheckedChange={(checked) =>
                        updateInvoiceSettings("includeGST", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gst-rate">GST Rate (%)</Label>
                    <Select
                      value={invoiceSettings.gstRate.toString()}
                      onValueChange={(value) =>
                        updateInvoiceSettings("gstRate", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% (Exempt)</SelectItem>
                        <SelectItem value="5">5% (Reduced Rate)</SelectItem>
                        <SelectItem value="12">12% (Standard)</SelectItem>
                        <SelectItem value="18">18% (Standard)</SelectItem>
                        <SelectItem value="28">28% (Luxury)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Receipt className="w-4 h-4 mr-2" />
                    Preview Invoice Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Taxes & GST */}
        <TabsContent value="taxes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Tax Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900 dark:text-orange-100">
                        Tax Compliance Notice
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                        Ensure your tax settings comply with local regulations.
                        Consult a tax professional if needed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tax Registration Status
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Registered
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      GST Registration
                    </span>
                    <span className="font-medium">
                      {invoiceSettings.gstNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current Tax Rate
                    </span>
                    <span className="font-medium">
                      {invoiceSettings.gstRate}%
                    </span>
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Tax Report
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download GST Returns
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="w-4 h-4 mr-2" />
                  View All Invoices
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Tax Calculation Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Banknote className="w-4 h-4 mr-2" />
                  Payment History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold">₹45,320</p>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹8,158</p>
                    <p className="text-sm text-muted-foreground">
                      GST Collected
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹37,162</p>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Last Quarter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold">₹1,35,960</p>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹24,473</p>
                    <p className="text-sm text-muted-foreground">
                      GST Collected
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹1,11,487</p>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Financial Year</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold">₹4,83,750</p>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹87,075</p>
                    <p className="text-sm text-muted-foreground">
                      GST Collected
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹3,96,675</p>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
