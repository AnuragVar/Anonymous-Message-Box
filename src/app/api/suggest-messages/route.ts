import axios from "axios";

const apiKey = process.env.ONDEMAND_API_KEY;
const externalUserId = "secretspeak";
const query =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

async function createChatSession() {
  const url = "https://api.on-demand.io/chat/v1/sessions";
  const headers = { apikey: apiKey };
  const body = { pluginIds: [], externalUserId };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.data.id; // Extract session ID
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw error;
  }
}

async function submitQuery(sessionId: string) {
  const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
  const headers = { apikey: apiKey };
  const body = {
    endpointId: "predefined-gemini-1.5-pro",
    query,
    pluginIds: [],
    responseMode: "sync",
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error("Error submitting query:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const sessionId = await createChatSession();
    const queryResponse = await submitQuery(sessionId);
    const data =queryResponse.data.answer.split("||");
    
    return Response.json(
      {
        success: true,
        data,
        message: "Suggestions fetched successfully!!",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error in fetching suggestions",
      },
      { status: 200 }
    );
    console.error("Error in fetching suggestions", error);
  }
}
