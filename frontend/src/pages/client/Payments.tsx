import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  CreditCard,
  Calendar,
  IndianRupee,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Building,
  Smartphone,
  Wallet,
  TrendingUp,
  PieChart,
} from "lucide-react";

// Mock payment data
const paymentData = {
  totalSpent: 78450,
  monthlySpent: 12650,
  pendingPayments: 2450,
  availableCredits: 580,
  savedCards: 3,
  lastPayment: "2024-01-14T10:30:00Z",
};

// Mock payment methods
const paymentMethods = [
  {
    id: "PM-001",
    type: "card",
    name: "Visa ****1234",
    details: "Expires 12/26",
    isDefault: true,
    verified: true,
    icon: CreditCard,
  },
  {
    id: "PM-002",
    type: "card",
    name: "Mastercard ****5678",
    details: "Expires 08/25",
    isDefault: false,
    verified: true,
    icon: CreditCard,
  },
  {
    id: "PM-003",
    type: "upi",
    name: "UPI",
    details: "john@okaxis",
    isDefault: false,
    verified: true,
    icon: Smartphone,
  },
  {
    id: "PM-004",
    type: "bank",
    name: "Bank Account",
    details: "HDFC Bank ****1234",
    isDefault: false,
    verified: true,
    icon: Building,
  },
];

// Mock transaction history
const transactions = [
  {
    id: "TXN-001",
    type: "payment",
    description: "Payment for Mobile App UI/UX Design",
    amount: -2500,
    status: "completed",
    date: "2024-01-14T10:30:00Z",
    method: "Visa ****1234",
    orderId: "ORD-001",
    freelancer: "Sarah Johnson",
  },
  {
    id: "TXN-002",
    type: "refund",
    description: "Refund for Website Development",
    amount: 1200,
    status: "completed",
    date: "2024-01-12T15:45:00Z",
    method: "Visa ****1234",
    orderId: "ORD-005",
    freelancer: "Mike Chen",
  },
  {
    id: "TXN-003",
    type: "payment",
    description: "Payment for Logo Design Package",
    amount: -850,
    status: "pending",
    date: "2024-01-10T09:20:00Z",
    method: "UPI",
    orderId: "ORD-002",
    freelancer: "Alex Rivera",
  },
  {
    id: "TXN-004",
    type: "fee",
    description: "FreelanceHub Service Fee",
    amount: -125,
    status: "completed",
    date: "2024-01-10T09:20:00Z",
    method: "Visa ****1234",
    orderId: "ORD-002",
  },
  {
    id: "TXN-005",
    type: "payment",
    description: "Payment for Content Writing",
    amount: -450,
    status: "completed",
    date: "2024-01-08T14:15:00Z",
    method: "Mastercard ****5678",
    orderId: "ORD-003",
    freelancer: "Priya Sharma",
  },
  {
    id: "TXN-006",
    type: "credit",
    description: "Promotional Credit",
    amount: 200,
    status: "completed",
    date: "2024-01-05T12:00:00Z",
    method: "FreelanceHub Credits",
  },
];

// Mock billing history
const billingHistory = [
  {
    id: "INV-001",
    invoiceNumber: "FH-2024-001",
    date: "2024-01-14T10:30:00Z",
    amount: 2625,
    status: "paid",
    dueDate: "2024-01-28T23:59:59Z",
    items: [
      { description: "Mobile App UI/UX Design", amount: 2500 },
      { description: "Service Fee (5%)", amount: 125 },
    ],
  },
  {
    id: "INV-002",
    invoiceNumber: "FH-2024-002",
    date: "2024-01-10T09:20:00Z",
    amount: 975,
    status: "pending",
    dueDate: "2024-01-24T23:59:59Z",
    items: [
      { description: "Logo Design Package", amount: 850 },
      { description: "Service Fee (5%)", amount: 125 },
    ],
  },
];

export default function Payments() {
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case "refund":
      case "credit":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "fee":
        return <ArrowDownRight className="w-4 h-4 text-orange-600" />;
      default:
        return <ArrowDownRight className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "failed":
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      transactionFilter === "all" || transaction.type === transactionFilter;
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/client/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Payments</h1>
              <p className="text-muted-foreground">
                View payment history and manage billing
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <GradientButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </GradientButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new payment method to your account.
                  </DialogDescription>
                </DialogHeader>
                {/* Payment method form would go here */}
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Payment method form would be implemented here
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Payment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(paymentData.totalSpent)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last payment: {formatDate(paymentData.lastPayment)}
                  </p>
                </div>
                                        <IndianRupee className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    This Month
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(paymentData.monthlySpent)}
                  </p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% from last month
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Payments
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(paymentData.pendingPayments)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2 transactions pending
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Credits
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(paymentData.availableCredits)}
                  </p>
                  <p className="text-sm text-muted-foreground">Use on orders</p>
                </div>
                <Wallet className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Filters */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={transactionFilter}
                      onValueChange={setTransactionFilter}
                    >
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="payment">Payments</SelectItem>
                        <SelectItem value="refund">Refunds</SelectItem>
                        <SelectItem value="fee">Fees</SelectItem>
                        <SelectItem value="credit">Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-border/40 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {transaction.description}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{formatDate(transaction.date)}</span>
                            <span>•</span>
                            <span>{transaction.method}</span>
                            {transaction.freelancer && (
                              <>
                                <span>•</span>
                                <span>{transaction.freelancer}</span>
                              </>
                            )}
                            {transaction.orderId && (
                              <>
                                <span>•</span>
                                <span>{transaction.orderId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="methods" className="space-y-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-border/40 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{method.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {method.details}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                          {method.verified && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              Verified
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Payment Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Choose a payment method to add to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex-col">
                          <CreditCard className="w-6 h-6 mb-2" />
                          Credit/Debit Card
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                          <Smartphone className="w-6 h-6 mb-2" />
                          UPI
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                          <Building className="w-6 h-6 mb-2" />
                          Bank Account
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                          <Wallet className="w-6 h-6 mb-2" />
                          Digital Wallet
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Payment Security */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Payment Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Secure Payments</h4>
                    <p className="text-muted-foreground">
                      All payments are processed securely using
                      industry-standard encryption
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Fraud Protection</h4>
                    <p className="text-muted-foreground">
                      Advanced fraud detection protects your transactions
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Dispute Resolution</h4>
                    <p className="text-muted-foreground">
                      24/7 support for payment disputes and issues
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Refund Policy</h4>
                    <p className="text-muted-foreground">
                      Eligible refunds processed within 5-7 business days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing History Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Invoices & Receipts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-4 border border-border/40 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">
                            Invoice {invoice.invoiceNumber}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(invoice.date)} • Due:{" "}
                            {formatDate(invoice.dueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatCurrency(invoice.amount)}
                          </div>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {invoice.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-muted-foreground"
                          >
                            <span>{item.description}</span>
                            <span>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Summary */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Spending Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Projects
                      </span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Average Project Cost
                      </span>
                      <span className="font-medium">₹3,268</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Most Expensive Project
                      </span>
                      <span className="font-medium">₹8,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Service Fees Paid
                      </span>
                      <span className="font-medium">₹3,923</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Refunds Received
                      </span>
                      <span className="font-medium text-green-600">₹1,200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Design & Creative
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: "60%" }}
                          />
                        </div>
                        <span className="font-medium">₹47,070</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Development & IT
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: "30%" }}
                          />
                        </div>
                        <span className="font-medium">₹23,535</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Digital Marketing
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: "15%" }}
                          />
                        </div>
                        <span className="font-medium">₹7,845</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
