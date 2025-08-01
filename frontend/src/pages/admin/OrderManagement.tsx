import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Package,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Timeline } from "@/components/ui/timeline"; // Assume a timeline component or use a placeholder
import { useToast } from "@/hooks/use-toast";

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}



export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftOrder, setDraftOrder] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Mock data for preview/demo
  const mockOrders = [
    {
      _id: "order1",
      client: { _id: "client1", name: "John Doe", profilePicture: "/placeholder.svg" },
      freelancer: { _id: "freelancer1", name: "Alice Smith", profilePicture: "/placeholder.svg" },
      gig: { title: "Logo Design" },
      amount: 2500,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentStatus: "Paid",
    },
    {
      _id: "order2",
      client: { _id: "client2", name: "Jane Roe", profilePicture: "/placeholder.svg" },
      freelancer: { _id: "freelancer2", name: "Bob Lee", profilePicture: "/placeholder.svg" },
      gig: { title: "Website Development" },
      amount: 12000,
      status: "in_progress",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      paymentStatus: "Paid",
    },
    {
      _id: "order3",
      client: { _id: "client3", name: "Sam Patel", profilePicture: "/placeholder.svg" },
      freelancer: { _id: "freelancer3", name: "Priya Singh", profilePicture: "/placeholder.svg" },
      gig: { title: "SEO Optimization" },
      amount: 5000,
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      paymentStatus: "Paid",
    },
    {
      _id: "order4",
      client: { _id: "client4", name: "Alex Kim", profilePicture: "/placeholder.svg" },
      freelancer: { _id: "freelancer4", name: "Maria Garcia", profilePicture: "/placeholder.svg" },
      gig: { title: "App UI/UX Review" },
      amount: 3000,
      status: "disputed",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      paymentStatus: "Refunded",
    },
    {
      _id: "order5",
      client: { _id: "client5", name: "Chris Brown", profilePicture: "/placeholder.svg" },
      freelancer: { _id: "freelancer5", name: "Sara Lee", profilePicture: "/placeholder.svg" },
      gig: { title: "Social Media Marketing" },
      amount: 8000,
      status: "cancelled",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      paymentStatus: "Cancelled",
    },
  ];

  // Add timeline to mock orders
  mockOrders.forEach((order) => {
    if (!order.timeline) {
      order.timeline = [
        { type: "created", label: "Order Created", date: order.createdAt },
        { type: "status", label: `Status: ${order.status.replace("_", " ")}`, date: order.createdAt },
      ];
      if (order.status === "disputed") {
        order.timeline.push({ type: "dispute", label: "Dispute Opened", date: new Date(Date.parse(order.createdAt) + 3600000).toISOString() });
      }
      if (order.status === "completed") {
        order.timeline.push({ type: "completed", label: "Order Completed", date: new Date(Date.parse(order.createdAt) + 7200000).toISOString() });
      }
      if (order.status === "cancelled") {
        order.timeline.push({ type: "cancelled", label: "Order Cancelled", date: new Date(Date.parse(order.createdAt) + 5400000).toISOString() });
      }
    }
  });

  // For mock data, update local state for status, refund, dispute
  const [mockOrderState, setMockOrderState] = useState(mockOrders);
  const displayOrders = !loading && orders.length === 0 ? mockOrderState : orders;

  // Update stats and filteredOrders to use displayOrders
  const totalOrders = displayOrders.length;
  const activeOrders = displayOrders.filter((o) => o.status === "pending" || o.status === "in_progress").length;
  const completedOrders = displayOrders.filter((o) => o.status === "completed").length;
  const disputedOrders = displayOrders.filter((o) => o.status === "disputed").length;
  const totalValue = displayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  const filteredOrders = displayOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order._id.includes(searchQuery) ||
      order.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.freelancer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setDraftOrder({ ...order, timeline: [...(order.timeline || [])] });
    setModalOpen(true);
  };

  // When modal closes, discard draft changes
  const handleModalChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setDraftOrder(null);
  };



  // Save changes from draftOrder to real order
  const handleSave = () => {
    if (!draftOrder) return;
    setMockOrderState((prev) =>
      prev.map((order) =>
        order._id === draftOrder._id ? { ...draftOrder } : order
      )
    );
    setSelectedOrder(draftOrder);
    setDraftOrder(null);
    setModalOpen(false);
    toast({ title: "Order changes saved" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage all orders on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Stats/Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-bold">{activeOrders}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedOrders}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Disputed</p>
              <p className="text-2xl font-bold">{disputedOrders}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
            </div>
                                    <IndianRupee className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No orders found.</div>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-card dark:bg-[#18181b]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Freelancer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-background dark:bg-[#101014] divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{order._id.slice(-8)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/client/profile/${order.client?._id}`} className="flex items-center gap-2 hover:underline">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={order.client?.profilePicture || "/placeholder.svg"} />
                          <AvatarFallback>{order.client?.name?.[0] || "C"}</AvatarFallback>
                        </Avatar>
                        <span>{order.client?.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/freelancer/profile/${order.freelancer?._id}`} className="flex items-center gap-2 hover:underline">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={order.freelancer?.profilePicture || "/placeholder.svg"} />
                          <AvatarFallback>{order.freelancer?.name?.[0] || "F"}</AvatarFallback>
                        </Avatar>
                        <span>{order.freelancer?.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span>{order.title}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{order.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <button onClick={() => handleViewDetails(order)} className="flex items-center w-full">
                              <Eye className="mr-2 h-4 w-4" />View Details
                            </button>
                          </DropdownMenuItem>
                          {/* Add more admin actions here if needed */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {draftOrder ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-xs">{draftOrder._id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Client:</span>
                    <Avatar className="h-6 w-6"><AvatarImage src={draftOrder.client?.profilePicture || "/placeholder.svg"} /><AvatarFallback>{draftOrder.client?.name?.[0] || "C"}</AvatarFallback></Avatar>
                    <span>{draftOrder.client?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Freelancer:</span>
                    <Avatar className="h-6 w-6"><AvatarImage src={draftOrder.freelancer?.profilePicture || "/placeholder.svg"} /><AvatarFallback>{draftOrder.freelancer?.name?.[0] || "F"}</AvatarFallback></Avatar>
                    <span>{draftOrder.freelancer?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Gig:</span>
                    <span>{draftOrder.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Amount:</span>
                    <span>₹{draftOrder.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Created:</span>
                    <span>{formatDate(draftOrder.createdAt)}</span>
                  </div>
                </div>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
