import fetchPhaseData from "@/utils/fetchPhaseData";
import { useQuery } from "@tanstack/react-query";

const usePhaseData = (sessionId: string, playerId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["phase", sessionId, playerId],
    queryFn: () => fetchPhaseData(sessionId, playerId),
    gcTime: 0,
    staleTime: Infinity,
  });
};

export default usePhaseData;
