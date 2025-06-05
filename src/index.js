import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import OpenAI from "openai";

async function run() {
  try {
    const diff = core.getInput("patch");
    if (!diff) {
      core.setFailed("Input 'patch' is empty");
      return;
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `Summarize this diff in ≤5 lines, then provide Arabic and Hebrew translations\n\n${diff}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const summary = response.choices[0]?.message?.content || "No summary generated";

    const octokit = getOctokit(process.env.GITHUB_TOKEN);
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
      body: summary
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
