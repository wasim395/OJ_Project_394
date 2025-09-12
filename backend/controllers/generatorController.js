import { generateProblem } from "../services/generator/generatorService.js";
import Problem from "../models/Problems.js";

async function createDraft(req, res) {
  try {
    const { difficulty, tags } = req.body;
    const { mapped, file } = await generateProblem({ difficulty, tags });

    // Save to MongoDB (optional)
    const newProblem = new Problem(mapped);
    await newProblem.save();

    res.json({
      status: "ok",
      file,
      problem: newProblem
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
}

export { createDraft };
