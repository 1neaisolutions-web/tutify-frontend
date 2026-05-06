# Chatbot Module Documentation

## Introduction

The Chatbot Module is a core capability of our educational platform, enabling teachers to have real-time, conversational AI assistance for lesson planning, subject-specific guidance, classroom management, and professional development. It functions as a suite of specialized AI co-teachers—from a free general assistant to premium large-language models and platform-trained subject specialists—all accessible through a unified chat interface with streaming responses, conversation history, and optional features such as web search and voice input. Designed to be intuitive and flexible, the module supports educators in international and multicultural school environments while maintaining pedagogical alignment, cultural sensitivity, and ease of use.

## Goals and Purpose

The Chatbot Module is designed to:

- **Provide Conversational AI Support:** Offer teachers on-demand, natural-language assistance for planning, assessment ideas, differentiation, and classroom practices without leaving the platform.
- **Match Expertise to Need:** Deliver general-purpose assistance for free and subject-specific or model-advanced assistance through subscription, so schools can scale usage to their budget and goals.
- **Ensure Quality and Safety:** Use education-oriented prompts, optional standards alignment, and ethical AI practices (e.g., Claude Education Pro) where applicable.
- **Support Diverse Classrooms:** Enable responses suited to international schools, multilingual contexts, and varied curricular frameworks through specialized bots and optional language/output controls.
- **Enhance Efficiency:** Reduce planning friction with streaming responses, conversation history, quick actions (e.g., summarize, generate questions), and optional voice input and file attachments for premium users.

## Overview of Chatbots

The platform provides **multiple chatbots** organized into three main categories:

1. **FREE Plan Access (1 chatbot):** General Teaching Assistant—versatile AI support for getting started.
2. **Large Language Models (3 chatbots):** Premium models from leading providers (GPT-4, Claude, Gemini), optimized for education.
3. **Subject-Specific Specialists (25+ chatbots):** Platform-trained or curriculum-aligned bots by subject (English, Mathematics, Sciences, Business, Arts, Technology).

All chatbots are accessible from the **Specialized Chatbots** hub (`/chatbots`), with search and filter by subject, standard, or teaching goal. Each bot has a dedicated chat page (e.g. `/chatbots/general-teaching-assistant`, `/chatbots/gpt4-teaching-assistant`).

---

## Access Levels

| Level            | Access                                                                 |
|------------------|------------------------------------------------------------------------|
| **FREE**         | General Teaching Assistant only; core chat (messages, streaming, history). |
| **Subscription** | All chatbots (LLMs + Subject-Specific Specialists); Web Search; Voice Input/Output; File Attachments; Advanced Analytics. |

Subscription features (e.g. `web_search`, `audio_transcription`, `file_attachments`, `analytics`) are gated by the user's feature flags and surfaced in the chat UI (e.g. Web toggle, microphone, attachment buttons) with upgrade prompts where applicable.

---

## Chat Interface and Request Options

### Core Behavior

- **Streaming:** Responses are delivered via Server-Sent Events (SSE) for word-by-word streaming; the UI shows real-time content and supports stop-generation.
- **Conversations:** Each chat is tied to a **conversation**. Users can start a new conversation, switch between past conversations, and load conversation history (lazy-loaded when selected). Conversation list shows title and message count.
- **Message Actions:** Users can edit or delete messages, regenerate the last assistant response, copy message content, and give like/dislike feedback.

### Send-Message Request Parameters

When sending a message to any chatbot, the following parameters are supported (API: `SendMessageRequest`):

| Parameter          | Type     | Required | Description |
|--------------------|----------|----------|-------------|
| **message**        | string   | Yes      | User message text. |
| **conversation_id**| string   | No       | If provided, the message is added to this conversation; otherwise a new conversation is created. |
| **bot_mode**       | enum     | No       | Controls reasoning/speed trade-off. See below. |
| **response_length**| enum     | No       | Short, Medium, or Long. Affects target length of the assistant reply. |
| **web_search**     | boolean  | No       | When true (and user has access), the assistant can use real-time web search. Premium feature. |
| **metadata**       | object   | No       | Optional key-value data for analytics or product use. |

**Bot mode** (reasoning/speed):

- **Fastest:** Quick responses, optimized for speed.
- **Smartest:** Balanced intelligence and speed (default).
- **Critical Thinking:** Deep analysis and reasoning.

**Response length:**

- **Short:** Brief, concise responses.
- **Medium:** Balanced detail (default).
- **Long:** Comprehensive, detailed responses.

These options are exposed in the chat UI (mode selector, Actions > Length, Web Search toggle).

### Optional Chat Features (Subscription)

- **Web Search:** Toggle in the input bar; when enabled and allowed by subscription, the backend may use web search for the reply.
- **Voice Input/Output:** Microphone for voice input; optional text-to-speech for assistant replies. Requires `audio_transcription` (or equivalent) feature access.
- **File Attachments:** Support for attaching files (e.g. PDFs, images) to messages; requires `file_attachments` feature access.
- **Custom Prompts:** Users can save and reuse custom prompts from the Actions menu ("Custom Prompts" / "Save prompts").
- **Quick Actions:** From the Actions menu: "Questions" (generate questions from content), "Summarize" (summarize content), plus Response Length and Custom Prompts.

### Capabilities (Subject / Bot-Specific)

Some chatbots expose **capabilities**—structured actions beyond free-form chat (e.g. "Generate lesson outline," "Analyze text complexity"). The API supports:

- **Execute Capability**  
  `POST /v1/chatbots/{slug}/capabilities/{capability_key}`  
  Body: `ExecuteCapabilityRequest`: `input`, optional `input_type` (text | file | conversation), optional `parameters`, optional `conversation_id`, optional `save_result`.

Capabilities are defined per bot (e.g. in backend) and can be surfaced in the UI as buttons or shortcuts. Each capability has a key, name, description, category, and optional icon and display order.

---

## Detailed Chatbot Descriptions

Each chatbot is described below in a consistent format: **Description**, **Category**, **Supported Grade Bands**, **Key Capabilities**, and **Purpose**. The Purpose statement explains the ideal use case, the problem it solves, and how it supports teachers and learners in a professional, internationally minded context—aligned with the level of detail used in the Template Module documentation.

---

### FREE Plan

#### Chatbot 1: General Teaching Assistant

**Description:** A versatile AI companion that supports lesson planning, assessment ideas, classroom management, and day-to-day teaching questions. It is the entry point for educators new to AI-powered teaching tools and remains useful for cross-cutting pedagogical and administrative needs.

**Category:** General  
**Access:** FREE  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/general-teaching-assistant`

**Key Capabilities**
- Lesson planning assistance and structure suggestions
- Formative and summative assessment ideas
- Classroom management and routine tips
- Quick Q&A on pedagogy, differentiation, and best practices

**Purpose:** This chatbot supports educators who need reliable, on-demand guidance without subject-specific depth. It reduces planning friction by answering "how do I…?" and "what are some ways to…?" questions in a clear, practical way. It is designed to be the first AI co-teacher teachers meet: accessible, professional, and aligned with general pedagogical best practices so that international and multicultural schools can adopt AI assistance quickly and safely before scaling to specialized or premium bots.

---

### Large Language Models (Subscription)

#### Chatbot 2: GPT-4 Teaching Assistant

**Description:** Powered by OpenAI GPT-4, this assistant delivers advanced reasoning, creative lesson design, and deep pedagogical understanding. It excels at complex planning tasks, multi-step explanations, and generating rich, nuanced content for lessons and assessments.

**Category:** Large Language Model (Premium)  
**Model:** GPT-4  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/gpt4-teaching-assistant`

**Key Capabilities**
- Sophisticated lesson and unit design with clear learning progressions
- Detailed assessment and rubric suggestions
- Explanation of concepts at multiple levels for differentiation
- Creative activity and project ideas with step-by-step guidance

**Purpose:** This chatbot meets the need for high-fidelity, intellectually demanding support when teachers are designing rigorous, standards-aligned instruction or navigating difficult content. It supports international curricula by producing well-structured, pedagogically sound outputs that teachers can adapt to their context. Schools and educators seeking a premium generalist with strong reasoning and creativity use this bot for lesson design, assessment design, and professional reflection.

---

#### Chatbot 3: Claude Education Pro

**Description:** Anthropic Claude, optimized for education, with a focus on curriculum alignment, careful reasoning, and ethical AI use. It is well suited to syllabus design, assessment alignment, and discussions that require nuance and responsibility.

**Category:** Large Language Model (Premium)  
**Model:** Claude 3.5  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/claude-education-pro`

**Key Capabilities**
- Curriculum and standards alignment (e.g. CCSS, IB, UK, NGSS)
- Ethical and inclusive framing of sensitive or controversial topics
- Clear, balanced explanations suitable for diverse classrooms
- Structured outputs for syllabi, assessment criteria, and policy-aware content

**Purpose:** This chatbot supports schools that prioritise curriculum rigour, ethical AI use, and culturally responsive content. It helps teachers align instruction and assessment to recognised frameworks while avoiding bias and supporting inclusive, international environments. It is the preferred option when the use case demands careful alignment to standards, ethical considerations, and professional tone.

---

#### Chatbot 4: Gemini Education Suite

**Description:** Google Gemini, fine-tuned for K-12 education, with strong multilingual support and multimodal capabilities. It supports teachers working in more than one language and those integrating text, images, and media into planning and instruction.

**Category:** Large Language Model (Premium)  
**Model:** Gemini Pro  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/gemini-education-suite`

**Key Capabilities**
- Multilingual dialogue and output for diverse student populations
- Multimodal reasoning (e.g. describing or using images in tasks)
- K-12-appropriate explanations and scaffolding
- Support for bilingual and immersion settings

**Purpose:** This chatbot serves international and multilingual schools where teachers need responses in multiple languages or support for diverse linguistic backgrounds. It helps reduce language barriers in planning and communication while maintaining pedagogical quality. Schools that value multilingual capability and media-rich instruction use this bot to support equitable access and modern, multimodal teaching.

---

### Subject-Specific Specialists (Subscription)

Subject specialists are platform-trained or curriculum-aligned bots with deep focus in one subject area. Each supports grade bands K-2, 3-5, 6-8, and 9-12 where applicable and is available via the Specialized Chatbots hub with "View details" / "Start chatting" (subscription required).

---

#### English

#### Chatbot 5: Literacy Lab Coach

**Description:** Supports guided reading, text complexity analysis, and writing feedback tailored to grade level. Helps teachers select texts, design comprehension tasks, and give actionable feedback on student writing.

**Category:** Subject-Specific (English)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/literacy-lab-coach`

**Key Capabilities**
- Guided reading strategies and text selection
- Qualitative and quantitative text complexity analysis
- Writing feedback stems and conferring notes
- Differentiation for struggling readers and ELL

**Purpose:** This chatbot helps teachers run evidence-based literacy instruction that matches text difficulty to reader ability and strengthens writing through clear, criteria-based feedback. It supports internationally aligned literacy goals (e.g. CCSS ELA, UK National Curriculum) and is ideal for literacy leads, classroom teachers, and schools aiming for consistent, high-quality reading and writing instruction across grade levels.

---

#### Chatbot 6: Grammar & Writing Mentor

**Description:** Supports grammar instruction, writing workshop facilitation, and peer review. Helps design mini-lessons, model sentences, and scaffold grammar and composition in ways that transfer to student writing.

**Category:** Subject-Specific (English)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/grammar-writing-mentor`

**Key Capabilities**
- Grammar mini-lessons and concept sequencing
- Writing workshop structures and conferring
- Peer review protocols and feedback language
- Sentence- and paragraph-level scaffolding

**Purpose:** This chatbot enables teachers to teach grammar in context and to strengthen writing instruction through workshop-style practices and peer feedback. It supports schools that want writing and grammar aligned to standards and best practice without sacrificing engagement or clarity. It is suited to both dedicated ELA blocks and cross-curricular writing.

---

#### Chatbot 7: Literature Analysis Expert

**Description:** Supports literary analysis, theme exploration, and discussion prompts for classic and contemporary texts. Helps teachers design units and discussions that build critical reading and interpretation.

**Category:** Subject-Specific (English)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/literature-analysis-expert`

**Key Capabilities**
- Thematic and structural analysis of fiction and non-fiction
- Discussion prompts and Socratic-style questions
- Connection to historical and cultural context
- Essay and extended response scaffolding

**Purpose:** This chatbot supports rigorous literature instruction by helping teachers design analysis-focused units, develop discussion prompts, and scaffold critical reading. It is aimed at secondary and advanced primary settings where the goal is deep comprehension, interpretation, and evidence-based argument—aligned with international literature and ELA expectations.

---

#### Chatbot 8: Advanced Knowledge and Skills Coach

**Description:** Builds teachers' knowledge and skills in modern pedagogical methods, including active learning, metacognition, and research-informed practice. Acts as a professional learning partner for instructional improvement.

**Category:** Subject-Specific (English / Pedagogy)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/advanced-knowledge-skills-coach`

**Key Capabilities**
- Explanations of current pedagogy and learning science
- Implementation guidance for new instructional approaches
- Reflection prompts and self-assessment support
- Links to research and practical examples

**Purpose:** This chatbot supports teacher growth by making research-informed pedagogy accessible and actionable. It helps educators adopt and refine high-impact practices—differentiation, formative assessment, metacognition—in a way that fits their context. It is ideal for professional learning, curriculum leadership, and schools investing in evidence-based improvement.

---

#### Chatbot 9: UNEC Academic Development & Innovation

**Description:** A comprehensive programme-oriented bot for syllabus design, assessment, digital literacy, AI integration, and student-centered teaching. Supports institutional or department-level academic development and innovation initiatives.

**Category:** Subject-Specific (English / Academic Development)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/unec-academic-development`

**Key Capabilities**
- Syllabus and programme design
- Assessment design and alignment
- Digital literacy and technology integration
- AI-in-education and student-centered pedagogy

**Purpose:** This chatbot supports academic leaders and teachers who are designing or revising programmes, syllabi, and assessment systems. It helps align curriculum with institutional goals, integrate digital and AI tools responsibly, and move toward more student-centered, innovative practice. It is suited to schools and networks pursuing systematic academic development and innovation.

---

#### Mathematics

#### Chatbot 10: Adaptive Math Strategist

**Description:** Supports differentiated problem sets, step-by-step modeling, and conceptual understanding in mathematics. Helps tailor tasks to readiness and scaffold reasoning and representation.

**Category:** Subject-Specific (Mathematics)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/adaptive-math-strategist`

**Key Capabilities**
- Tiered problem sets and readiness-based tasks
- Visual and symbolic modeling strategies
- Conceptual progression and misconception addressing
- Support for intervention and extension

**Purpose:** This chatbot helps teachers differentiate mathematics instruction so that all students can access grade-level concepts while receiving appropriate support or challenge. It supports internationally aligned math standards (e.g. CCSS, UK, Singapore, IB) and is ideal for teachers who want to combine conceptual depth with responsive, adaptive practice.

---

#### Chatbot 11: Problem-Solving Coach

**Description:** Focuses on real-world math applications, word problem strategies, and mathematical reasoning. Helps design tasks that connect procedures to contexts and develop problem-solving habits.

**Category:** Subject-Specific (Mathematics)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/problem-solving-coach`

**Key Capabilities**
- Real-world and applied problem design
- Word problem decoding and strategy instruction
- Reasoning and justification scaffolds
- Multiple solution paths and representations

**Purpose:** This chatbot supports teachers in moving beyond procedural practice toward reasoning and application. It helps design problems that develop perseverance, modeling, and communication—goals shared by major international math frameworks. It is suited to teachers who want to strengthen problem-solving and real-world connections in their math programme.

---

#### Chatbot 12: Algebra & Geometry Tutor

**Description:** Supports visual explanations, proof strategies, and scaffolded practice in algebra and geometry. Helps teachers explain abstract ideas and structure proof and argument in secondary mathematics.

**Category:** Subject-Specific (Mathematics)  
**Supported Grade Bands:** 6-8, 9-12  
**Route:** `/chatbots/algebra-geometry-tutor`

**Key Capabilities**
- Algebraic and geometric visualization
- Proof and argument scaffolding
- Problem sequences that build formal reasoning
- Links between algebra and geometry

**Purpose:** This chatbot helps teachers make algebra and geometry accessible and rigorous through visual and logical scaffolding. It supports curricula that emphasise proof and reasoning (e.g. GCSE, A-Level, IB, CCSS) and is ideal for secondary math teachers who want to deepen conceptual understanding and formal argument in their classrooms.

---

#### Sciences

#### Chatbot 13: STEM Inquiry Mentor

**Description:** Supports NGSS-aligned investigations, engineering design challenges, and scientific method guidance. Helps teachers plan phenomena-driven and design-based learning experiences.

**Category:** Subject-Specific (Sciences)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/stem-inquiry-mentor`

**Key Capabilities**
- Phenomena-based and inquiry lesson design
- Engineering design process and constraints
- Scientific method and variable control
- Cross-cutting concepts and disciplinary core ideas

**Purpose:** This chatbot supports standards-aligned STEM instruction (e.g. NGSS, UK, IB) by helping teachers design investigations and engineering tasks that build conceptual understanding and practices. It is aimed at science and STEM teachers who want to strengthen inquiry, argument from evidence, and design thinking in their programmes.

---

#### Chatbot 14: Lab Safety & Protocol Advisor

**Description:** Supports safety protocols, experiment design, and hands-on activity planning for science labs. Helps teachers minimise risk and meet duty-of-care expectations.

**Category:** Subject-Specific (Sciences)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/lab-safety-protocol-advisor`

**Key Capabilities**
- Risk assessment and safety checklists
- Age-appropriate lab procedures
- Chemical and equipment safety
- Emergency and incident response guidance

**Purpose:** This chatbot helps teachers run safe, effective practical science. It supports consistent safety practice across departments and aligns with expectations in international and regulated environments. It is essential for science leads and classroom teachers who want to maintain high standards of lab safety while maximising hands-on learning.

---

#### Chatbot 15: Environmental Science Guide

**Description:** Supports climate education, sustainability projects, and ecological systems thinking. Helps design units and projects that connect local and global environmental issues to curriculum.

**Category:** Subject-Specific (Sciences)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/environmental-science-guide`

**Key Capabilities**
- Climate and sustainability content and pedagogy
- Project-based and place-based learning design
- Systems thinking and interdependence
- Age-appropriate framing of complex issues

**Purpose:** This chatbot supports teachers in delivering rigorous, balanced environmental and climate education. It helps design learning that builds scientific literacy and citizenship while respecting diverse perspectives and international contexts. It is suited to science, geography, and cross-curricular sustainability programmes.

---

#### Business

#### Chatbot 16: Business Studies Mentor

**Description:** Supports entrepreneurship, economics, financial literacy, and real-world business scenarios. Helps design tasks that connect theory to practice and develop business and economic literacy.

**Category:** Subject-Specific (Business)  
**Supported Grade Bands:** 6-8, 9-12  
**Route:** `/chatbots/business-studies-mentor`

**Key Capabilities**
- Business and economics concept explanation
- Case studies and scenario design
- Financial literacy and decision-making
- Curriculum alignment (e.g. GCSE, A-Level, IB Business)

**Purpose:** This chatbot helps business and economics teachers design relevant, applied learning that prepares students for further study and real-world decisions. It supports internationally recognised business and economics curricula and is ideal for secondary teachers who want to combine conceptual clarity with practical application.

---

#### Chatbot 17: Career Readiness Coach

**Description:** Supports resume building, interview preparation, professional skills, and industry insights. Helps teachers and advisers prepare students for transitions to work or further education.

**Category:** Subject-Specific (Business / Careers)  
**Supported Grade Bands:** 6-8, 9-12  
**Route:** `/chatbots/career-readiness-coach`

**Key Capabilities**
- Resume and application feedback
- Interview preparation and practice
- Professional conduct and soft skills
- Industry and pathway information

**Purpose:** This chatbot supports career and employability education by giving teachers and advisers a partner for resume review, interview prep, and professional skills. It helps schools deliver consistent, high-quality career readiness across programmes and is suited to careers leads, advisers, and teachers embedding employability in the curriculum.

---

#### Chatbot 18: Marketing & Branding Strategist

**Description:** Supports marketing fundamentals, branding strategies, digital marketing, and market research. Helps design projects and assessments that build practical marketing and branding skills.

**Category:** Subject-Specific (Business)  
**Supported Grade Bands:** 6-8, 9-12  
**Route:** `/chatbots/marketing-branding-strategist`

**Key Capabilities**
- Marketing theory and application
- Branding and positioning
- Digital and social media marketing
- Research and analysis tasks

**Purpose:** This chatbot helps business and marketing teachers design up-to-date, applied learning in marketing and branding. It supports curricula that blend theory with practice and is ideal for teachers who want to keep content relevant to current industry practice while maintaining academic rigour.

---

#### Arts

#### Chatbot 19: Visual Arts Studio Assistant

**Description:** Supports art history, technique guidance, portfolio development, and creative project ideas. Helps teachers plan lessons that balance technique, context, and expression.

**Category:** Subject-Specific (Arts)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/visual-arts-studio-assistant`

**Key Capabilities**
- Art history and cultural context
- Technique demos and scaffolding
- Portfolio and exhibition guidance
- Critique and reflection prompts

**Purpose:** This chatbot supports visual arts teachers in designing lessons that develop both technical skill and critical engagement with art. It helps align practice to curriculum expectations (e.g. GCSE, A-Level, IB) and supports diverse, inclusive approaches to art history and making. It is suited to specialist and generalist arts teachers in international settings.

---

#### Chatbot 20: Music & Performance Coach

**Description:** Supports music theory, composition, performance techniques, and ensemble coordination. Helps teachers plan instruction that builds musical understanding and performance skills.

**Category:** Subject-Specific (Arts)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/music-performance-coach`

**Key Capabilities**
- Music theory and notation
- Composition and arranging
- Performance and rehearsal strategies
- Ensemble and group music guidance

**Purpose:** This chatbot helps music teachers design sequenced, standards-aligned instruction in theory, composition, and performance. It supports curricula that value both technical proficiency and musical understanding and is ideal for classroom and instrumental teachers in international and multicultural programmes.

---

#### Chatbot 21: Drama & Theater Director

**Description:** Supports script analysis, character development, stage direction, and production planning. Helps teachers run drama and theatre units that build interpretation and performance skills.

**Category:** Subject-Specific (Arts)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/drama-theater-director`

**Key Capabilities**
- Script analysis and dramaturgy
- Character and direction work
- Staging and production logistics
- Assessment and reflection for drama

**Purpose:** This chatbot supports drama and theatre teachers in designing units that develop analytical and performance skills. It helps align practice to curriculum (e.g. GCSE Drama, IB Theatre) and supports both classroom drama and production work. It is suited to teachers who want to combine textual analysis with practical theatre-making.

---

#### Technology

#### Chatbot 22: Coding & Programming Tutor

**Description:** Supports programming concepts, debugging, project-based learning, and computational thinking. Helps teachers design coding lessons and projects that build transferable skills.

**Category:** Subject-Specific (Technology)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/coding-programming-tutor`

**Key Capabilities**
- Programming concept explanation and sequencing
- Debugging and problem-solving strategies
- Project-based and inquiry coding tasks
- Computational thinking and decomposition

**Purpose:** This chatbot helps teachers deliver clear, progressive programming and computational thinking instruction. It supports curricula (e.g. CS standards, ICT, computing) and is ideal for both specialist computing teachers and those integrating coding across subjects in international and K-12 settings.

---

#### Chatbot 23: Digital Literacy Advisor

**Description:** Supports digital citizenship, online safety, media literacy, and technology integration. Helps teachers plan lessons that build responsible, critical use of technology and media.

**Category:** Subject-Specific (Technology)  
**Supported Grade Bands:** K-2, 3-5, 6-8, 9-12  
**Route:** `/chatbots/digital-literacy-advisor`

**Key Capabilities**
- Digital citizenship and ethics
- Online safety and wellbeing
- Media literacy and critical evaluation
- Technology integration in teaching and learning

**Purpose:** This chatbot supports schools in embedding digital literacy and citizenship across the curriculum. It helps teachers address online safety, misinformation, and ethical use in age-appropriate ways and is suited to ICT leads, librarians, and classroom teachers in international and digitally connected environments.

---

#### Chatbot 24: AI & Machine Learning Educator

**Description:** Supports AI concepts for students, ethical AI discussions, and hands-on ML projects. Helps teachers introduce AI and ML in accurate, age-appropriate, and ethically grounded ways.

**Category:** Subject-Specific (Technology)  
**Supported Grade Bands:** 6-8, 9-12  
**Route:** `/chatbots/ai-machine-learning-educator`

**Key Capabilities**
- AI and ML concept explanation
- Ethical AI and societal impact
- Hands-on and project-based ML activities
- Links to computing and data science

**Purpose:** This chatbot helps teachers introduce AI and machine learning in ways that build understanding and critical awareness. It supports schools that want to prepare students for an AI-enabled world while addressing ethics and bias. It is ideal for computing, science, and cross-curricular programmes in international schools.

---

## API Summary (for Marketing / Technical Overview)

- **List chatbots:** `GET /v1/chatbots`
- **Get chatbot:** `GET /v1/chatbots/{slug}`
- **List conversations:** `GET /v1/chatbots/{slug}/conversations`
- **Get conversation (with messages):** `GET /v1/chatbots/conversations/{conversationId}`
- **Send message (non-streaming):** `POST /v1/chatbots/{slug}/messages` — body: `SendMessageRequest`
- **Send message (streaming):** `POST /v1/chatbots/{slug}/messages/stream` — same body; response: SSE stream (`thinking` | `content` | `done` | `error`)
- **Delete conversation:** `DELETE /v1/chatbots/conversations/{conversationId}`
- **Execute capability:** `POST /v1/chatbots/{slug}/capabilities/{capabilityKey}` — body: `ExecuteCapabilityRequest`

Responses can include `conversation_id`, `user_message`, `assistant_message`, and optionally `token_usage`, `cost_estimate`, `model_used`, `provider_used`.

---

## Subscription Features (Chat-Related)

| Feature Key          | Name                 | Description |
|----------------------|----------------------|-------------|
| chat_messages        | Chat Messages        | Send messages to AI chatbots. |
| web_search           | Web Search           | Real-time web search integration in chat. |
| audio_transcription  | Voice Input/Output   | Audio transcription and voice responses. |
| file_attachments     | File Attachments     | Upload and process files (e.g. PDFs, images) in chat. |
| analytics            | Advanced Analytics   | Detailed usage analytics and insights. |

These are referenced in the Subscription page and control visibility/behavior of toggles and buttons in the chat UI (e.g. Web Search, microphone, attachments).

---

## Common Input Fields (Recap)

**Sending a message (all chatbots):**

- **Required:** `message` (string).
- **Optional:** `conversation_id`, `bot_mode` (fastest | smartest | critical-thinking), `response_length` (short | medium | long), `web_search` (boolean), `metadata`.

**Executing a capability (when supported):**

- **Required:** `input` (string or as required by capability).
- **Optional:** `input_type` (text | file | conversation), `parameters`, `conversation_id`, `save_result`.

---

## Future Plans (Optional Section)

The Chatbot Module can be extended with:

- **Custom or school-specific bots:** Bots tailored to a school's curriculum, language, or policies.
- **More capabilities:** Additional one-click actions (e.g. "Create exit ticket," "Suggest differentiation") from within a conversation.
- **Tighter template integration:** Suggested templates from Explore Use Cases paired with chatbot recommendations for end-to-end workflows.
- **Analytics and reporting:** Per-bot and per-conversation usage for schools and admins (building on the existing `analytics` feature flag).

---

## Document Control

- **Audience:** Marketing team, product, and implementation partners.
- **Aligned to:** Frontend chatbot hub and chat UI (`1ne-frontend`); API contract in `src/api/chatbots.ts`.
- **Style:** Matches the structure and level of detail of the Template Module documentation for consistency. Each bot includes a detailed **Purpose** statement in the same professional, ideal-use style as the Template Module's per-template Purpose.
