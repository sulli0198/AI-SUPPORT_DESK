import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { onUserSignup } from "@/inngest/functions/on-signup";
import { onTicketCreated } from "@/inngest/functions/on-ticket-create";

// This creates the Inngest webhook endpoint
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    onUserSignup,
    onTicketCreated,
  ],
});