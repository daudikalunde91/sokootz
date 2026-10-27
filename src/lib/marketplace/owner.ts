import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ownerService } from "@/lib/api/services";
import { useAuth } from "@/lib/auth/AuthProvider";

/** The signed-in owner's own business and listings (queries keyed by Firebase UID). */
export function useOwnerData() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const qc = useQueryClient();
  const business = useQuery({
    queryKey: ["owner", uid, "business"],
    queryFn: ownerService.myBusiness,
    enabled: !!uid,
    retry: false,
  });
  const listings = useQuery({
    queryKey: ["owner", uid, "listings"],
    queryFn: ownerService.myListings,
    enabled: !!uid,
    retry: false,
  });
  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["owner", uid] });
    await qc.invalidateQueries({ queryKey: ["listings"] });
    await qc.invalidateQueries({ queryKey: ["business"] });
  };
  return { uid, business, listings, refresh };
}
