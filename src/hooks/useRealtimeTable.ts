import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";

// Define a type that includes all valid table names in our database
// plus allows for a string (for tables not yet in the schema)
type TableName = keyof Database['public']['Tables'] | string;

// This hook fetches data from a Supabase table and sets up a realtime subscription
export function useRealtimeTable<T extends { id?: string }>(table: TableName, initialQuery: Record<string, unknown> = {}) {
  const [rows, setRows] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tableName = table as string;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error(`Error fetching data from ${tableName}:`, error);
          setError(`Failed to load data from ${tableName}: ${error.message}`);
          if (isMounted) {
            toast({
              title: "Data fetch error",
              description: `Could not load ${tableName} data. Please try again later.`,
              variant: "destructive",
            });
          }
        } else if (isMounted && data) {
          setRows(data as T[]);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`Unexpected error with ${tableName}:`, errorMsg);
        setError(`Unexpected error: ${errorMsg}`);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [tableName, ...Object.values(initialQuery || {})]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          setRows((prev) => {
            try {
              if (payload.eventType === "INSERT") {
                return [payload.new as T, ...prev];
              }
              if (payload.eventType === "UPDATE") {
                return prev.map((row) =>
                  row.id === payload.new.id ? (payload.new as T) : row
                );
              }
              if (payload.eventType === "DELETE") {
                return prev.filter((row) => row.id !== payload.old.id);
              }
            } catch (err) {
              const errorMsg = err instanceof Error ? err.message : String(err);
              console.error("Error processing realtime update:", errorMsg);
            }
            return prev;
          });
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.warn(`Realtime subscription to ${tableName} status:`, status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);

  return { rows, isLoading, error, setRows };
}
