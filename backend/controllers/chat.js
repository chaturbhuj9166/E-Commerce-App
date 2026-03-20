import groq from "../utils/groqAi.js";


export async function chatAI(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an ecommerce assistant.

⚠️ ALWAYS reply ONLY using Markdown:

### 📌 Heading Title

**Top Suggestions**
- Bullet item 1
- Bullet item 2
- Bullet item 3

**Extra Tips**
- Bullet item 4
- Bullet item 5

**Question**
- Ask one short question

Never reply as paragraph text.
Never remove dashes.
Use Hindi + English mixed style.
`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "No reply";

    return res.status(200).json({ reply });
  } catch (error) {
    console.log("AI ERROR:", error);
    return res.status(500).json({ reply: "Server issue! Try again 😐" });
  }
}


export async function listModels(req, res) {
  try {
    const models = await groq.models.list();
    return res.status(200).json(models.data || []);
  } catch (err) {
    console.log("MODEL ERROR:", err);
    return res.status(500).json({ message: "Cannot load models" });
  }
}