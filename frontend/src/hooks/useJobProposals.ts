import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import useJobProposalsSocket from "./useJobProposalsSocket";

export interface Proposal {
  _id: string;
  freelancer: {
    _id: string;
    name: string;
    avatar?: string;
    level?: string;
    rating?: number;
    reviews?: number;
    responseTime?: string;
    completionRate?: number;
  };
  bid: number;
  deliveryTime: string;
  coverLetter: string;
  submittedAt: string;
  status?: 'pending' | 'accepted' | 'rejected';
  isInvited?: boolean;
}

export default function useJobProposals(jobId: string | undefined) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    axios
      .get(`/api/jobs/${jobId}`)
      .then((res) => {
        // Filter out rejected proposals
        const allProposals = res.data.job.proposals || [];
        const activeProposals = allProposals.filter((proposal: any) => proposal.status !== 'rejected');
        setProposals(activeProposals);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [jobId]);

  // Callback to add new proposal in real time
  const handleNewProposal = useCallback((proposal: any) => {
    setProposals((prev) => [proposal, ...prev]);
  }, []);

  // Callback to remove rejected proposal
  const handleRejectProposal = useCallback((proposalId: string) => {
    setProposals((prev) => prev.filter(proposal => proposal._id !== proposalId));
  }, []);

  useJobProposalsSocket(jobId, handleNewProposal);

  return { proposals, loading, error, handleRejectProposal };
}

