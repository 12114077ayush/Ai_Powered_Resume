import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResumeFromJD = async (resume, jobDescription) => {
  const prompt = `
You are an AI career assistant. Using the resume data below and the provided job description, generate an optimized resume tailored for the role.

Resume Data:
Full Name: ${resume.fullName}
Email: ${resume.email}
Phone: ${resume.phone}
Title: ${resume.title}
Summary: ${resume.summary}
Skills: ${resume.skills.join(", ")}
Experience: ${resume.experience
    .map(
      (exp) =>
        `- ${exp.role} at ${exp.company} (${exp.startDate.toDateString()} to ${
          exp.endDate ? exp.endDate.toDateString() : "Present"
        }): ${exp.description}`
    )
    .join("\n")}
Education: ${resume.education
    .map((edu) => `- ${edu.degree}, ${edu.institution}, ${edu.year}`)
    .join("\n")}
Projects: ${resume.projects
    .map(
      (proj) =>
        `- ${proj.title}: ${proj.description} [${proj.technologies.join(", ")}]`
    )
    .join("\n")}

Job Description:
${jobDescription}

Respond with a resume in structured JSON format using the same fields as above. Only include improved or optimized content.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  console.log(completion); // check what openAI returns

  const aiResumeText = completion.choices[0].message.content;

  let aiResumeData;
  try {
    aiResumeData = JSON.parse(aiResumeText);
  } catch (err) {
    throw new ApiError(
      500,
      "AI response was not in valid JSON format. Try improving the prompt or add format enforcement."
    );
  }

  return aiResumeData;
};
