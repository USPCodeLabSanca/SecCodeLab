import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Vulnerability } from "@/data/vulnerabilities";
import { vulnerabilities as defaultVulnerabilities } from "@/data/vulnerabilities";
import {
  createCustomVulnerability,
  deleteCustomVulnerability,
  fetchCustomVulnerabilities,
  updateCustomVulnerability,
} from "@/lib/vulnerabilities-api";

const QUERY_KEY = ["custom-vulnerabilities"];

export function useVulnerabilities() {
  const queryClient = useQueryClient();

  const { data: custom = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchCustomVulnerabilities,
  });

  const addMutation = useMutation({
    mutationFn: createCustomVulnerability,
    onSuccess: (created) => {
      queryClient.setQueryData<Vulnerability[]>(QUERY_KEY, (previous = []) => [...previous, created]);
    },
  });

  const removeMutation = useMutation({
    mutationFn: deleteCustomVulnerability,
    onSuccess: ({ id }) => {
      queryClient.setQueryData<Vulnerability[]>(QUERY_KEY, (previous = []) =>
        previous.filter((item) => item.id !== id),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomVulnerability,
    onSuccess: (updated) => {
      queryClient.setQueryData<Vulnerability[]>(QUERY_KEY, (previous = []) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      );
    },
  });

  const all = [...defaultVulnerabilities, ...custom];

  const add = useCallback(
    async (v: Vulnerability) => {
      await addMutation.mutateAsync(v);
    },
    [addMutation],
  );

  const remove = useCallback(
    async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
    [removeMutation],
  );

  const update = useCallback(
    async (v: Vulnerability) => {
      await updateMutation.mutateAsync(v);
    },
    [updateMutation],
  );

  const isCustom = useCallback((id: string) => {
    return custom.some((v) => v.id === id);
  }, [custom]);

  return {
    vulnerabilities: all,
    add,
    remove,
    update,
    isCustom,
    customCount: custom.length,
    isLoading,
    isSaving: addMutation.isPending || removeMutation.isPending || updateMutation.isPending,
    error,
  };
}
