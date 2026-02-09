const MAX_HISTORY = 12;

const sanitizeMessages = (messages = []) =>
  messages
    .filter((msg) => msg && typeof msg.content === "string")
    .map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content.trim(),
    }))
    .filter((msg) => msg.content.length > 0)
    .slice(-MAX_HISTORY);

const buildSystemPrompt = () =>
  `You are JobFlow's helpful assistant. Keep answers concise and actionable.
If asked about resumes or job tracking, provide practical advice.`;

exports.chatWithClaude = async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620";
    if (!apiKey) {
      return res.status(500).json({ message: "ANTHROPIC_API_KEY not set." });
    }

    const messages = sanitizeMessages(req.body?.messages || []);
    if (!messages.length) {
      return res.status(400).json({ message: "Message is required." });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 600,
        temperature: 0.6,
        system: buildSystemPrompt(),
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || "Claude request failed.",
      });
    }

    const parts = Array.isArray(data?.content) ? data.content : [];
    const text = parts.map((p) => p?.text || "").join("").trim();
    if (!text) {
      return res.status(502).json({ message: "Claude response was empty." });
    }

    return res.json({
      reply: text,
      model: data?.model || model,
      usage: data?.usage || null,
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Chat request failed.",
    });
  }
};
