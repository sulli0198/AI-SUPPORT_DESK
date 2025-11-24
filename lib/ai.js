import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  try {
    // Set the permanent personality and behavior of the AI agent here.
    const supportAgent = createAgent({
      model: gemini({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),
      name: "AI Ticket Triage Assistant",
      system: `You are an expert AI assistant that processes technical support tickets. 

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.

Repeat: Do not wrap your output in markdown or code fences.`,
    });

    // Here run() parameter (the prompt) provides the specific ticket details as user input
    const response = await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
          
Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);

    console.log("Full Agent Response:", response); // Debug the full response
    
    // Check if response exists and has output
    if (!response || !response.output || !response.output[0]) {
      console.error("Agent returned empty response");
      return null;
    }

    const raw = response.output[0].content;
    console.log("Raw AI context:", raw); // Debug the raw context

    if (!raw) {
      console.error("Raw context is undefined");
      return null;
    }

    try {
      // The AI should return raw JSON, so just parse it directly
      const jsonString = raw.trim();
      const parsed = JSON.parse(jsonString);
      console.log("Successfully parsed AI response:", parsed);
      return parsed;
    } catch (e) {
      console.log("Failed to parse JSON from AI response:", e.message);
      console.log("Raw response that failed:", raw);
      return null;
    }
  } catch (error) {
    console.error("AI Agent Error:", error);
    return null;
  }
};

export default analyzeTicket;