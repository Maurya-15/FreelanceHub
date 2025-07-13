import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  User,
  DollarSign,
  Bug,
  Send,
} from "lucide-react";

// Mock support tickets data
const ticketsData = [
  {
    id: "TICKET-001",
    subject: "Payment not received for completed order",
    description:
      "I completed an order 5 days ago but haven't received payment yet. The client has approved the work.",
    category: "payment",
    priority: "high",
    status: "open",
    user: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "/api/placeholder/40/40",
      role: "freelancer",
    },
    assignedTo: "John Admin",
    createdAt: "2024-01-12T10:30:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
    responses: 3,
    orderId: "ORD-123",
  },
  {
    id: "TICKET-002",
    subject: "Account verification issue",
    description:
      "I uploaded my documents for verification 2 weeks ago but my account is still not verified. Please help.",
    category: "account",
    priority: "medium",
    status: "in_progress",
    user: {
      name: "Mike Chen",
      email: "mike.chen@dev.com",
      avatar: "/api/placeholder/40/40",
      role: "freelancer",
    },
    assignedTo: "Jane Admin",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    responses: 5,
    orderId: null,
  },
  {
    id: "TICKET-003",
    subject: "Freelancer not responding to messages",
    description:
      "I hired a freelancer for my project but they haven't responded to my messages for 3 days. Need assistance.",
    category: "dispute",
    priority: "high",
    status: "escalated",
    user: {
      name: "Emily Davis",
      email: "emily.davis@startup.com",
      avatar: "/api/placeholder/40/40",
      role: "client",
    },
    assignedTo: "Senior Support",
    createdAt: "2024-01-11T15:20:00Z",
    updatedAt: "2024-01-13T11:30:00Z",
    responses: 7,
    orderId: "ORD-456",
  },
  {
    id: "TICKET-004",
    subject: "Website loading issues",
    description:
      "The FreelanceHub website is very slow and sometimes doesn't load at all. This is affecting my work.",
    category: "technical",
    priority: "medium",
    status: "resolved",
    user: {
      name: "Alex Rivera",
      email: "alex.rivera@marketing.com",
      avatar: "/api/placeholder/40/40",
      role: "client",
    },
    assignedTo: "Tech Team",
    createdAt: "2024-01-09T11:45:00Z",
    updatedAt: "2024-01-11T09:20:00Z",
    responses: 4,
    orderId: null,
  },
];

const categoryIcons = {
  payment: DollarSign,
  account: User,
  dispute: AlertCircle,
  technical: Bug,
  general: HelpCircle,
};

const categoryColors = {
  payment:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  account: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  dispute: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  technical:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  urgent:
    "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 animate-pulse",
};

const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  in_progress:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  escalated: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  resolved:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

export default function SupportTickets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");

  const filteredTickets = ticketsData.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const handleTicketAction = (action: string, ticketId: string) => {
    console.log(`${action} ticket:`, ticketId);
    // In real app, call API to perform action
  };

  const handleSendResponse = (ticketId: string) => {
    console.log("Sending response to ticket:", ticketId, response);
    setResponse("");
    // In real app, call API to send response
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">
              Handle customer support requests
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold">{ticketsData.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Open Tickets
                </p>
                <p className="text-2xl font-bold">
                  {
                    ticketsData.filter(
                      (t) => t.status === "open" || t.status === "in_progress",
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  High Priority
                </p>
                <p className="text-2xl font-bold">
                  {ticketsData.filter((t) => t.priority === "high").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved Today
                </p>
                <p className="text-2xl font-bold">
                  {ticketsData.filter((t) => t.status === "resolved").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="dispute">Dispute</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const CategoryIcon = categoryIcons[ticket.category];
              return (
                <div
                  key={ticket.id}
                  className="flex items-start justify-between p-4 border border-border/40 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold truncate">
                          {ticket.subject}
                        </h3>
                        <Badge className={categoryColors[ticket.category]}>
                          {ticket.category}
                        </Badge>
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {ticket.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>#{ticket.id}</span>
                        <span>Created {formatDate(ticket.createdAt)}</span>
                        <span>Updated {getTimeAgo(ticket.updatedAt)}</span>
                        <span>{ticket.responses} responses</span>
                        {ticket.orderId && <span>Order: {ticket.orderId}</span>}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3 min-w-[200px]">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={ticket.user.avatar} />
                        <AvatarFallback>
                          {ticket.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {ticket.user.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {ticket.user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Assigned To */}
                    <div className="text-sm min-w-[120px]">
                      <p className="text-muted-foreground">Assigned to</p>
                      <p className="font-medium">{ticket.assignedTo}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{ticket.subject}</DialogTitle>
                          <DialogDescription>
                            Ticket #{ticket.id} • {ticket.category} •{" "}
                            {ticket.priority} priority
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={ticket.user.avatar} />
                              <AvatarFallback>
                                {ticket.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{ticket.user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {ticket.user.email} • {ticket.user.role}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm">{ticket.description}</p>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Add Response</h4>
                            <Textarea
                              placeholder="Type your response..."
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              className="min-h-[100px]"
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleSendResponse(ticket.id)}
                                disabled={!response.trim()}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send Response
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleTicketAction("resolve", ticket.id)
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Resolved
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleTicketAction("escalate", ticket.id)
                                }
                              >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Escalate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {ticket.status === "open" && (
                      <Button
                        size="sm"
                        onClick={() => handleTicketAction("assign", ticket.id)}
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
