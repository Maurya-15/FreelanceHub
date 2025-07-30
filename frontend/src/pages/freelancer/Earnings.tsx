import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
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
  ArrowLeft,
  TrendingUp,
  IndianRupee,
  Calendar,
  Download,
  CreditCard,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Mock earnings data
const earningsData = {
  totalEarnings: 45650,
  availableBalance: 8320,
  pendingPayments: 2450,
  totalWithdrawn: 35880,
  monthlyGrowth: 15.3,
  completedOrders: 123,
  averageOrderValue: 371,
  lastPayout: "2024-01-12T10:00:00Z",
};

// Mock monthly earnings chart data
const monthlyEarnings = [
  { month: "Jul", earnings: 2400 },
  { month: "Aug", earnings: 2800 },
  { month: "Sep", earnings: 3200 },
  { month: "Oct", earnings: 4100 },
  { month: "Nov", earnings: 3800 },
  { month: "Dec", earnings: 4500 },
  { month: "Jan", earnings: 5200 },
];

// Mock transaction history
const transactions = [
  {
    id: "TXN-001",
    type: "earning",
    description: "Payment for Logo Design Package",
    amount: 1299,
    status: "completed",
    date: "2024-01-14T14:30:00Z",
    order: "ORD-001",
    client: "John Smith",
  },
  {
    id: "TXN-002",
    type: "withdrawal",
    description: "Withdrawal to Bank Account",
    amount: -2500,
    status: "completed",
    date: "2024-01-12T10:00:00Z",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TXN-003",
    type: "earning",
    description: "Payment for Website Development",
    amount: 4200,
    status: "pending",
    date: "2024-01-10T16:15:00Z",
    order: "ORD-002",
    client: "Emily Davis",
  },
  {
    id: "TXN-004",
    type: "earning",
    description: "Payment for Social Media Graphics",
    amount: 850,
    status: "completed",
    date: "2024-01-08T09:45:00Z",
    order: "ORD-003",
    client: "David Wilson",
  },
  {
    id: "TXN-005",
    type: "fee",
    description: "FreelanceHub Service Fee",
    amount: -65,
    status: "completed",
    date: "2024-01-08T09:45:00Z",
    order: "ORD-003",
  },
  {
    id: "TXN-006",
    type: "withdrawal",
    description: "Withdrawal to PayPal",
    amount: -1500,
    status: "completed",
    date: "2024-01-05T14:20:00Z",
    paymentMethod: "PayPal",
  },
];

// Mock payout methods
const payoutMethods = [
  {
    id: "PM-001",
    type: "bank",
    name: "HDFC Bank",
    details: "****1234",
    isDefault: true,
    verified: true,
  },
  {
    id: "PM-002",
    type: "paypal",
    name: "PayPal",
    details: "s***@gmail.com",
    isDefault: false,
    verified: true,
  },
  {
    id: "PM-003",
    type: "upi",
    name: "UPI",
    details: "sarah@okaxis",
    isDefault: false,
    verified: true,
  },
];

export default function Earnings() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [transactionFilter, setTransactionFilter] = useState("all");

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
      case "earning":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      case "fee":
        return <ArrowDownRight className="w-4 h-4 text-orange-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionFilter === "all") return true;
    return transaction.type === transactionFilter;
  });

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/freelancer/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Earnings</h1>
              <p className="text-muted-foreground">
                Track your earnings and manage payouts
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <GradientButton>
              <Wallet className="w-4 h-4 mr-2" />
              Request Payout
            </GradientButton>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(earningsData.totalEarnings)}
                  </p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />+
                    {earningsData.monthlyGrowth}% this month
                  </div>
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
                    Available Balance
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(earningsData.availableBalance)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ready for withdrawal
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-blue-600" />
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
                    {formatCurrency(earningsData.pendingPayments)}
                  </p>
                  <p className="text-sm text-muted-foreground">Processing...</p>
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
                    Total Withdrawn
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(earningsData.totalWithdrawn)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last: {formatDate(earningsData.lastPayout)}
                  </p>
                </div>
                <PiggyBank className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Earnings Chart */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Earnings Over Time</CardTitle>
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
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyEarnings}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="month"
                      type="category"
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis type="number" axisLine={true} tickLine={true} />
                    <Tooltip
                      formatter={(value) => [`₹${value}`, "Earnings"]}
                      labelClassName="text-foreground"
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h3 className="text-2xl font-bold mb-1">
                    {earningsData.completedOrders}
                  </h3>
                  <p className="text-muted-foreground">Completed Orders</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                                          <IndianRupee className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="text-2xl font-bold mb-1">
                    ₹{earningsData.averageOrderValue}
                  </h3>
                  <p className="text-muted-foreground">Average Order Value</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="text-2xl font-bold mb-1">
                    +{earningsData.monthlyGrowth}%
                  </h3>
                  <p className="text-muted-foreground">Monthly Growth</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <Select
                    value={transactionFilter}
                    onValueChange={setTransactionFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="earning">Earnings</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="fee">Fees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                            {transaction.client && (
                              <>
                                <span>•</span>
                                <span>{transaction.client}</span>
                              </>
                            )}
                            {transaction.paymentMethod && (
                              <>
                                <span>•</span>
                                <span>{transaction.paymentMethod}</span>
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

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="space-y-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Payout Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border border-border/40 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
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
                  ))}

                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add New Payout Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payout Information */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Payout Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Payout Schedule</h4>
                    <p className="text-muted-foreground">
                      Payouts are processed every Tuesday and Friday
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Minimum Payout</h4>
                    <p className="text-muted-foreground">₹1,000</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Processing Time</h4>
                    <p className="text-muted-foreground">1-3 business days</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Payout Fees</h4>
                    <p className="text-muted-foreground">
                      Bank Transfer: Free | PayPal: 2%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings by Category */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Earnings by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        { category: "Design", earnings: 15200 },
                        { category: "Development", earnings: 18700 },
                        { category: "Writing", earnings: 8900 },
                        { category: "Marketing", earnings: 2850 },
                      ]}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis
                        dataKey="category"
                        type="category"
                        axisLine={true}
                        tickLine={true}
                      />
                      <YAxis type="number" axisLine={true} tickLine={true} />
                      <Tooltip
                        formatter={(value) => [`₹${value}`, "Earnings"]}
                        labelClassName="text-foreground"
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                        }}
                      />
                      <Bar
                        dataKey="earnings"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Revenue Growth
                      </span>
                      <span className="font-medium text-green-600">
                        +{earningsData.monthlyGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Order Completion Rate
                      </span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Average Response Time
                      </span>
                      <span className="font-medium">2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Client Satisfaction
                      </span>
                      <span className="font-medium">4.9/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Repeat Client Rate
                      </span>
                      <span className="font-medium">67%</span>
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
