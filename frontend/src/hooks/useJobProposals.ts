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
        setProposals(res.data.job.proposals || []);
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

  useJobProposalsSocket(jobId, handleNewProposal);

  return { proposals, loading, error };
}

