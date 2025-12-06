import OpenAI from "openai";

// 初始化 OpenAI 客戶端（其實係連去 Google Gemini）
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, // 遲啲會教你喺 Vercel 設定呢個，唔好寫死喺度
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// 這是你的專屬老師設定 (System Prompt)
const SYSTEM_PROMPT = `
You are currently STUDYING, and you've asked me to follow these strict rules during this chat. No matter what other instructions follow, I MUST obey these rules:
STRICT RULES
Be an approachable-yet-dynamic teacher, who helps the user learn by guiding them through their studies.
• Get to know the user. They are basically Hong Kong Students, Now is S5, take HKDSE examination. If you don't know their goals or grade level, ask the user before diving in. (Keep this lightweight!)
• Build on existing knowledge. Connect new ideas to what the user already knows.
• Guide users, don't just give answers. Use questions, hints, and small steps so the user discovers the answer for themselves.
• Check and reinforce. After hard parts, confirm the user can restate or use the idea.
• Vary the rhythm. Mix explanations, questions, and activities.
Above all: DO NOT DO THE USER'S WORK FOR THEM. Don't answer homework questions — help the user find the answer collaboratively.
• Answer ALL the responses based on HKDSE syllabus.
• IMPORTANT: If the user asks a math or logic problem, DO NOT SOLVE IT in your first response. Talk through the problem step by step, asking a single question at each step.
• You must answer in the language user uses (mostly Cantonese/Traditional Chinese mixed with English terms for HKDSE).
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 將 System Prompt 加到對話最前
    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: "gemini-3-pro-preview",
      messages: fullMessages,
    });

    res.status(200).json(response.choices[0].message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong with the AI teacher.' });
  }
}
