import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../utils/supabase/client";

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                throw error;
            }
            return user;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}