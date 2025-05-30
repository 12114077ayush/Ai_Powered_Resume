import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResumeFromJD = async (resume, jobDescription) => {
  const prompt = `
You are an expert career consultant.
Given the following resume data and job description, generate a tailored resume version for the job.

Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}

Respond with a modified resume in bullet points or markdown.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(completion); // check what openAI returns

  return completion.choices[0].message.content;
};
