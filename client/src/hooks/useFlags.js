import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/flagsApi";

export const queryKeys = { flags: ["flags"], audit: ["audit"] };
const EMPTY = [];

export function useFlags() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.flags, queryFn: api.getFlags });

  // After any change, refetch the list and the audit log so the UI matches the server.
  const refresh = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: queryKeys.flags }),
      qc.invalidateQueries({ queryKey: queryKeys.audit }),
    ]);

  const toggle = useMutation({ mutationFn: api.setFlagEnabled, onSuccess: refresh });
  const save = useMutation({
    mutationFn: (flag) => (flag.id ? api.updateFlag(flag) : api.createFlag(flag)),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: api.deleteFlag, onSuccess: refresh });
  const restore = useMutation({ mutationFn: api.restoreFlag, onSuccess: refresh });

  return {
    flags: query.data ?? EMPTY,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    toggle,
    save,
    remove,
    restore,
  };
}

export function useAuditLogs() {
  return useQuery({ queryKey: queryKeys.audit, queryFn: api.getAuditLogs });
}
