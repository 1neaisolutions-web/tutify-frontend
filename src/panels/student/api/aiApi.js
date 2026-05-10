import { AI_RESPONSES, DEFAULT_RESPONSE } from '../data/aiResponses';
import { streamText } from '../utils/aiStreamSimulator';

export const sendCopilotMessage = async (message, mode, onChunk, onDone) => {
  await new Promise((r) => setTimeout(r, 600));
  const msg = String(message || '').toLowerCase();
  const key = Object.keys(AI_RESPONSES).find((k) => msg.includes(k));
  const responseObj = key ? AI_RESPONSES[key] : null;
  const fullText = responseObj?.[mode] || DEFAULT_RESPONSE;
  const cleanup = streamText(fullText, onChunk, onDone);
  return cleanup;
};

export const solveProblem = async (problem, subject) => {
  await new Promise((r) => setTimeout(r, 1200));
  const msg = String(problem || '').toLowerCase();
  const key = Object.keys(AI_RESPONSES).find((k) => msg.includes(k));
  return {
    data: {
      subject: subject || 'General',
      steps: AI_RESPONSES[key]?.steps || ['Identify what you know', 'Pick a method', 'Solve step by step', 'Verify the result'],
      answer: AI_RESPONSES[key]?.answer || 'See steps above',
      practiceProblems: AI_RESPONSES[key]?.practiceProblems || [],
    },
  };
};

