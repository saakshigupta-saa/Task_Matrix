const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTask = async (req, res) => {
  try {
    const { taskIdea } = req.body;

    if (!taskIdea) {
      return res.status(400).json({
        message: "Task idea is required",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `
You are an AI productivity assistant for a project management app.

Convert the following task idea into a structured task.

Task idea:
${taskIdea}

Return:
1. A clear task title
2. A detailed description
3. 3 to 5 useful subtasks
4. Suggested priority: low, medium, or high

Keep the response practical and concise.
`,
    });

    res.status(200).json({
      message: "AI task generated successfully",
      result: response.output_text,
    });
  } catch (error) {
    console.error("AI generation error:", error);

    res.status(500).json({
      message: "Failed to generate AI task",
      error: error.message,
    });
  }
};

module.exports = {
  generateTask,
};