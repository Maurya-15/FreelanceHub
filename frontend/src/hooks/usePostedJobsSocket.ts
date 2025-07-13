import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function usePostedJobsSocket(clientId: string | undefined, onProposal: (proposal: any) => void) {
  useEffect(() => {
    if (!clientId) return;
    const socket: Socket = io("http://localhost:5000");
    socket.emit("joinClientRoom", clientId);

    socket.on("proposalSubmitted", (proposal) => {
      if (proposal.clientId === clientId) {
        onProposal(proposal);
      }
    });

    return () => {
      socket.emit("leaveClientRoom", clientId);
      socket.disconnect();
    };
  }, [clientId, onProposal]);
}
