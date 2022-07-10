import { entity } from "simpler-state";
import { SupabaseClient } from "../supabaseClient";

export const User = entity(SupabaseClient.auth.user() || null);