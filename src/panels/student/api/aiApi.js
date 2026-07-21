import { AI_RESPONSES, DEFAULT_RESPONSE } from '../data/aiResponses';
import { matchDoubtTopic } from '../data/doubtSolverContent';
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
  const match = matchDoubtTopic(problem, subject);
  return {
    data: {
      subject: match.subject || subject || 'General',
      subjectId: match.subjectId || null,
      topic: match.topic || 'General',
      confidence: match.confidence ?? 0.6,
      steps: match.steps,
      answer: match.answer,
      practiceProblems: match.practiceProblems || [],
    },
  };
};

