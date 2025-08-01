import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  CheckCircle,
  X,
  UserCheck,
  User,
} from "lucide-react";

import useJobProposals from "@/hooks/useJobProposals"; // new hook for fetching proposals from backend

export default function JobProposals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, loading, error, handleRejectProposal } = useJobProposals(id);

  const [selectedProposal, setSelectedProposal] = React.useState<any>(null);
  const [showAcceptDialog, setShowAcceptDialog] = React.useState(false);
  const [showRejectDialog, setShowRejectDialog] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    }
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8"> {/* wider main container */}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to={`/job/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Proposals</h1>
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `${proposals.length} proposals received`}
              </p>
            </div>
          </div>
        </div>

        {/* Loading/Error/Empty State */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">Loading proposals...</div>
        )}
        {error && (
          <div className="text-center py-12 text-destructive">{error}</div>
        )}
        {!loading && proposals.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
              <p className="text-muted-foreground mb-6">
                Your job posting is live. Proposals will appear here as freelancers submit them.
              </p>
              <Button variant="outline" asChild>
                <Link to={`/job/${id}`}>Back to Job Details</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <Card
              key={proposal._id}
              className="border-0 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  {/* Freelancer Info */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={proposal.freelancer.avatar} />
                      <AvatarFallback>
                        {proposal.freelancer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {proposal.freelancer.name}
                          </h3>
                          <Badge className="bg-brand-gradient text-white">
                            {proposal.freelancer.level}
                          </Badge>
                          {proposal.isInvited && (
                            <Badge variant="outline">Invited</Badge>
                          )}
                        </div>

                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {proposal.bid}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          in {proposal.deliveryTime}
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="mb-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {proposal.coverLetter}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Submitted {formatTimeAgo(proposal.submittedAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setShowRejectDialog(true);
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setShowAcceptDialog(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => navigate(`/messages?userId=${proposal.freelancer._id}`)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/freelancer/${proposal.freelancer._id}`}>
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State if no proposals */}
        {proposals.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
              <p className="text-muted-foreground mb-6">
                Your job posting is live. Proposals will appear here as
                freelancers submit them.
              </p>
              <Button variant="outline" asChild>
                <Link to={`/job/${id}`}>Back to Job Details</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      {/* Accept Proposal Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Proposal</DialogTitle>
            <DialogDescription>
              You're about to accept {selectedProposal?.freelancer?.name}'s proposal for ₹{selectedProposal?.bid}. This will create an order and start the project.
            </DialogDescription>
          </DialogHeader>
          {selectedProposal && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedProposal.freelancer.avatar} />
                    <AvatarFallback>
                      {selectedProposal.freelancer.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">
                      {selectedProposal.freelancer.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{selectedProposal.bid} in {selectedProposal.deliveryTime}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedProposal.coverLetter?.substring(0, 150)}...
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAcceptDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedProposal) return;
                    try {
                      const response = await fetch(`/api/jobs/${id}/proposals/${selectedProposal._id}/accept`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'user-id': localStorage.getItem('userId') || '' },
                      });
                      if (response.ok) {
                        navigate('/client/orders');
                      } else {
                        const data = await response.json();
                        alert(data.message || 'Failed to accept proposal.');
                      }
                    } catch (err) {
                      alert('Failed to accept proposal.');
                    }
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept & Create Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Proposal Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Proposal</DialogTitle>
            <DialogDescription>
              You're about to reject {selectedProposal?.freelancer?.name}'s proposal. You can optionally provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          {selectedProposal && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedProposal.freelancer.avatar} />
                    <AvatarFallback>
                      {selectedProposal.freelancer.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">
                      {selectedProposal.freelancer.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedProposal.bid} in {selectedProposal.deliveryTime}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reason for rejection (Optional)
                </label>
                <textarea
                  placeholder="Provide feedback on why this proposal doesn't meet your requirements..."
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="min-h-[100px] w-full rounded border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedProposal) return;
                    try {
                      const response = await fetch(`/api/jobs/${id}/proposals/${selectedProposal._id}/reject`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'user-id': localStorage.getItem('userId') || '' },
                        body: JSON.stringify({ reason: rejectionReason }),
                      });
                      if (response.ok) {
                        handleRejectProposal(selectedProposal._id);
                        setShowRejectDialog(false);
                        setRejectionReason("");
                      } else {
                        const data = await response.json();
                        alert(data.message || 'Failed to reject proposal.');
                      }
                    } catch (err) {
                      alert('Failed to reject proposal.');
                    }
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject Proposal
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
