import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function useJobProposalsSocket(jobId: string | undefined, onProposal: (proposal: any) => void) {
  useEffect(() => {
    if (!jobId) return;
    const socket: Socket = io("http://localhost:5000");
    socket.emit("joinJobRoom", jobId);

    socket.on("proposalSubmitted", (proposal) => {
      if (proposal.jobId === jobId) {
        onProposal(proposal);
      }
    });

    return () => {
      socket.emit("leaveJobRoom", jobId);
      socket.disconnect();
    };
  }, [jobId, onProposal]);
}
