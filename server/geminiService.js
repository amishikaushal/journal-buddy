import axios from "axios";

const geminiResponse = async (command) => {
  try {
    const apiurl = process.env.GEMINI_API_URL;

   
    const prompt = `You are a supportive and empathetic AI companion helping users reflect on their daily journal entries.

When given a journal entry, carefully analyze the emotional tone and overall mood expressed by the user. Respond with a JSON object containing:

- "mood": A short phrase (not a single word) that captures the user's emotional state. For example: "feeling a bit anxious", "deeply grateful", "mentally drained", "quietly hopeful", etc.
- "message": A brief, supportive message with a small piece of actionable advice or encouragement based on the detected mood. Keep it friendly and compassionate.
- "sentimentScore": A number between 0 and 1 indicating the positivity of the sentiment, where 0 is very negative, 0.5 is neutral, and 1 is very positive.

Instructions:
- Be concise and friendly.
- Return only the JSON object, without explanations or extra text.
- Avoid Markdown formatting or code blocks.

Example output:
{
  "mood": "feeling a bit anxious",
  "message": "Try taking a short walk or doing deep breathing to calm your nerves. You're doing okay.",
  "sentimentScore": 0.42
}

Journal entry: ${command}`;

    const result = await axios.post(apiurl, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    });

    let geminiData = result.data.candidates[0].content.parts[0].text;

    // Remove markdown code block if present
    geminiData = geminiData.replace(/```json|```/g, '').trim();

    return JSON.parse(geminiData);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: "Failed to analyze journal entry." };
  }
};

export const chatResponse = async (message) => {
  try {
    const apiurl = process.env.GEMINI_API_URL;
    const prompt = `You are a supportive AI assistant helping with journaling. 
    Respond naturally and empathetically to: ${message}
    Keep responses concise and helpful.`;

    const result = await axios.post(apiurl, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    return {
      message: result.data.candidates[0].content.parts[0].text,
      timestamp: new Date()
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: "Failed to process message." };
  }
};

export const generateJournalPrompt = async () => {
  try {
    const apiurl = process.env.GEMINI_API_URL;
    const prompt = `Generate a thoughtful and engaging journal prompt for daily reflection.
    Requirements:
    - Make it personal and introspective
    - Keep it open-ended
    - Focus on emotions, growth, or daily experiences
    - Start with "Today's reflection:"
    - Keep it concise (max 15 words)
    - Make it engaging and thought-provoking
    
    Return only the prompt text without any additional formatting or explanation.`;

    const result = await axios.post(apiurl, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    return {
      prompt: result.data.candidates[0].content.parts[0].text.trim(),
      timestamp: new Date()
    };

  } catch (error) {
    console.error("Error generating journal prompt:", error);
    return { error: "Failed to generate journal prompt." };
  }
};

export default geminiResponse;
