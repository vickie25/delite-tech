import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.resolve(__dirname, "../templates/emails");

export const loadEmailTemplate = async (templateFileName) => {
  const templatePath = path.join(templatesDir, templateFileName);
  return fs.readFile(templatePath, "utf-8");
};

export const renderTemplate = (template, variables = {}) => {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) {
    const token = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
    rendered = rendered.replace(token, String(value ?? ""));
  }
  return rendered;
};
