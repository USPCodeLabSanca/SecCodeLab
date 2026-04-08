import { useState, useEffect, useCallback } from "react";
import type { Vulnerability } from "@/data/vulnerabilities";
import { vulnerabilities as defaultVulnerabilities } from "@/data/vulnerabilities";

const STORAGE_KEY = "secCodeLab_custom_vulnerabilities";

export function useVulnerabilities() {
  const [custom, setCustom] = useState<Vulnerability[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  }, [custom]);

  const all = [...defaultVulnerabilities, ...custom];

  const add = useCallback((v: Vulnerability) => {
    setCustom((prev) => [...prev, v]);
  }, []);

  const remove = useCallback((id: string) => {
    setCustom((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const isCustom = useCallback((id: string) => {
    return custom.some((v) => v.id === id);
  }, [custom]);

  return { vulnerabilities: all, add, remove, isCustom, customCount: custom.length };
}
