export const DEFAULT_RESPONSE =
  "I can help with that. Tell me the subject and what part you're stuck on, and I'll explain it step by step.";

export const AI_RESPONSES = {
  newton: {
    qa: "Newton's 3rd Law: for every action, there is an equal and opposite reaction.",
    explain:
      "Step 1: Identify the interacting objects. Step 2: Write the force pair (A on B, B on A). Step 3: Note they are equal in magnitude and opposite in direction.",
    summarise: 'Newton 3: forces come in pairs, equal and opposite, acting on different objects.',
    practice: '1) Identify the action-reaction pair in a jump. 2) In a collision, what are the force pairs? 3) Why do rockets work in space?',
    translate: 'Ley de Newton 3: por cada acción, hay una reacción igual y opuesta.',
    steps: ['Find the objects', 'Write the force pair', 'State equal/opposite', 'Check directions'],
    answer: 'Equal and opposite forces on different objects',
    practiceProblems: ['A swimmer pushes water back—what pushes the swimmer forward?', 'Ball hits wall—what is the reaction force?'],
  },
  photosynthesis: {
    qa: 'Photosynthesis converts light energy into chemical energy (glucose) using CO2 and water.',
    explain:
      'Step 1: Light reactions make ATP/NADPH. Step 2: Calvin cycle uses CO2 to build sugars. Step 3: Oxygen is released from splitting water.',
    summarise: 'Light → ATP/NADPH → CO2 fixed into sugar; O2 released.',
    practice: '1) Where does the Calvin cycle occur? 2) What is the role of chlorophyll? 3) Why is water needed?',
  },
};

