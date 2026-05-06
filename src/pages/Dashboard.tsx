import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import TemplatesLibrary from './features/TemplatesLibrary'
import TemplateRunner from './features/TemplateRunner'
import GeneralLessonPlanner from './features/GeneralLessonPlanner'
import StemActivityGenerator from './features/StemActivityGenerator'
import ProjectBasedLearningPlanner from './features/ProjectBasedLearningPlanner'
import SummativeAssessmentBuilder from './features/SummativeAssessmentBuilder'
import FormativeAssessmentGenerator from './features/FormativeAssessmentGenerator'
import BehaviourPlanBuilder from './features/BehaviourPlanBuilder'
import IcebreakerIdeaGenerator from './features/IcebreakerIdeaGenerator'
import ActivityPlanner from './features/ActivityPlanner'
import NewsletterArticleGenerator from './features/NewsletterArticleGenerator'
import MultiLessonPlanner from './features/MultiLessonPlanner'
import RealWorldMathProblemGenerator from './features/RealWorldMathProblemGenerator'
import MathGameBuilder from './features/MathGameBuilder'
import BudgetMasterChallenge from './features/BudgetMasterChallenge'
import ExperimentIdeaGenerator from './features/ExperimentIdeaGenerator'
import LearningIntentionBreakdown from './features/LearningIntentionBreakdown'
import SpecializedChatbots from './features/SpecializedChatbots'
import GeneralTeachingAssistantChat from './features/GeneralTeachingAssistantChat'
import GPT4TeachingAssistantChat from './features/GPT4TeachingAssistantChat'
import ClaudeEducationProChat from './features/ClaudeEducationProChat'
import GeminiEducationSuiteChat from './features/GeminiEducationSuiteChat'
import CodingProgrammingTutor from './features/CodingProgrammingTutor'
import VisualArtsStudioAssistant from './features/VisualArtsStudioAssistant'
import BusinessStudiesMentor from './features/BusinessStudiesMentor'
import CareerReadinessCoach from './features/CareerReadinessCoach'
import LabSafetyProtocolAdvisor from './features/LabSafetyProtocolAdvisor'
import EnvironmentalScienceGuide from './features/EnvironmentalScienceGuide'
import MusicPerformanceCoach from './features/MusicPerformanceCoach'
import DramaTheaterDirector from './features/DramaTheaterDirector'
import DigitalLiteracyAdvisor from './features/DigitalLiteracyAdvisor'
import AIMachineLearningEducator from './features/AIMachineLearningEducator'
import MarketingBrandingStrategist from './features/MarketingBrandingStrategist'
import YouTubeQuizGenerator from './features/YouTubeQuizGenerator'
import QuizResults from './features/QuizResults'
import PixGen from './features/PixGen'
import ProfessionalLearningHub from './features/ProfessionalLearningHub'
import ClassroomManagementCourse from './features/ClassroomManagementCourse'
import AssessmentStrategiesCourse from './features/AssessmentStrategiesCourse'
import DifferentiationCourse from './features/DifferentiationCourse'
import StudentEngagementCourse from './features/StudentEngagementCourse'
import DigitalLiteracyCourse from './features/DigitalLiteracyCourse'
import DifferentiationTutorial from './features/DifferentiationTutorial'
import LessonPlannerTutorial from './features/LessonPlannerTutorial'
import AssessmentTutorial from './features/AssessmentTutorial'
import BloomsTaxonomyResearch from './features/BloomsTaxonomyResearch'
import EvidenceBasedTeachingResearch from './features/EvidenceBasedTeachingResearch'
import AssessmentResearch from './features/AssessmentResearch'
import SELBehaviorResearch from './features/SELBehaviorResearch'
import GrowthMindsetResearch from './features/GrowthMindsetResearch'
import CognitiveLoadTheoryResearch from './features/CognitiveLoadTheoryResearch'
import MetacognitionResearch from './features/MetacognitionResearch'
import ScaffoldingResearch from './features/ScaffoldingResearch'
import StudentEngagementPath from './features/StudentEngagementPath'
import AdvancedDifferentiationPath from './features/AdvancedDifferentiationPath'
import AIAssistedAssessmentPath from './features/AIAssistedAssessmentPath'
import AIAssessmentIntroModule from './features/AIAssessmentIntroModule'
import AutomatedRubricsModule from './features/AutomatedRubricsModule'
import InstantFeedbackModule from './features/InstantFeedbackModule'
import FormativeAutomationModule from './features/FormativeAutomationModule'
import SummativeAIDesignModule from './features/SummativeAIDesignModule'
import TieredInstructionModule from './features/TieredInstructionModule'
import ContentDifferentiationModule from './features/ContentDifferentiationModule'
import ProcessDifferentiationModule from './features/ProcessDifferentiationModule'
import ProductDifferentiationModule from './features/ProductDifferentiationModule'
import AssessmentDifferentiationModule from './features/AssessmentDifferentiationModule'
import AdvancedGroupingModule from './features/AdvancedGroupingModule'
import STEMMasteryCourse from './features/STEMMasteryCourse'
import LiteracyExpertCourse from './features/LiteracyExpertCourse'
import NGSSFoundationsModule from './features/NGSSFoundationsModule'
import EngineeringDesignModule from './features/EngineeringDesignModule'
import ComputationalThinkingModule from './features/ComputationalThinkingModule'
import LabSafetyModule from './features/LabSafetyModule'
import PhenomenaDrivenModule from './features/PhenomenaDrivenModule'
import DataLiteracyModule from './features/DataLiteracyModule'
import STEMIntegrationModule from './features/STEMIntegrationModule'
import NGSSAssessmentModule from './features/NGSSAssessmentModule'
import GamificationFundamentals from './features/GamificationFundamentals'
import PointsBadgesLeaderboards from './features/PointsBadgesLeaderboards'
import InquiryLearningHooks from './features/InquiryLearningHooks'
import QuestBasedLearning from './features/QuestBasedLearning'
import CollaborativeGameMechanics from './features/CollaborativeGameMechanics'
import AdaptiveGamification from './features/AdaptiveGamification'
import GamifiedAssessment from './features/GamifiedAssessment'
import AdvancedInquiryFrameworks from './features/AdvancedInquiryFrameworks'
import History from './features/History'
import Personalization from './features/Personalization'
import Analytics from './features/Analytics'
import Reporting from './features/Reporting'
import Assessment from './features/Assessment'
import DashboardHome from './DashboardHome'
import Profile from './Profile'
import Settings from './Settings'
import ExploreUseCases from './ExploreUseCases'
import LiteracyLabCoach from './features/LiteracyLabCoach'
import LiteratureAnalysisExpert from './features/LiteratureAnalysisExpert'
import GrammarWritingMentor from './features/GrammarWritingMentor'
import AdaptiveMathStrategist from './features/AdaptiveMathStrategist'
import AlgebraGeometryTutor from './features/AlgebraGeometryTutor'
import STEMInquiryMentor from './features/STEMInquiryMentor'
import ProblemSolvingCoach from './features/ProblemSolvingCoach'

import UNECAcademicDevelopment from './features/UNECAcademicDevelopment'
import { AdvancedKnowledgeSkillsCoach } from './features/AdvancedKnowledgeSkillsCoach'

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="templates" element={<TemplatesLibrary />} />
        <Route path="templates/:slug" element={<TemplateRunner />} />
        <Route path="templates/general-lesson-planner" element={<GeneralLessonPlanner />} />
        <Route path="templates/stem-activity-generator" element={<StemActivityGenerator />} />
        <Route
          path="templates/project-based-learning-planner"
          element={<ProjectBasedLearningPlanner />}
        />
        <Route
          path="templates/summative-assessment-builder"
          element={<SummativeAssessmentBuilder />}
        />
        <Route
          path="templates/formative-assessment-generator"
          element={<FormativeAssessmentGenerator />}
        />
        <Route
          path="templates/behaviour-plan-builder"
          element={<BehaviourPlanBuilder />}
        />
        <Route
          path="templates/icebreaker-idea-generator"
          element={<IcebreakerIdeaGenerator />}
        />
        <Route path="templates/activity-planner" element={<ActivityPlanner />} />
        <Route
          path="templates/newsletter-article-generator"
          element={<NewsletterArticleGenerator />}
        />
        <Route
          path="templates/multi-lesson-planner"
          element={<MultiLessonPlanner />}
        />
        <Route
          path="templates/real-world-math-problem-generator"
          element={<RealWorldMathProblemGenerator />}
        />
        <Route
          path="templates/math-game-builder"
          element={<MathGameBuilder />}
        />
        <Route
          path="templates/budget-master-challenge"
          element={<BudgetMasterChallenge />}
        />
        <Route
          path="templates/experiment-idea-generator"
          element={<ExperimentIdeaGenerator />}
        />
        <Route
          path="templates/learning-intention-breakdown"
          element={<LearningIntentionBreakdown />}
        />
        <Route path="chatbots" element={<SpecializedChatbots />} />
        <Route path="chatbots/general-teaching-assistant" element={<GeneralTeachingAssistantChat />} />
        <Route path="chatbots/gpt4-teaching-assistant" element={<GPT4TeachingAssistantChat />} />
        <Route path="chatbots/claude-education-pro" element={<ClaudeEducationProChat />} />
        <Route path="chatbots/gemini-education-suite" element={<GeminiEducationSuiteChat />} />
        <Route path="chatbots/coding-programming-tutor" element={<CodingProgrammingTutor />} />
        <Route path="chatbots/visual-arts-studio-assistant" element={<VisualArtsStudioAssistant />} />
        <Route path="chatbots/business-studies-mentor" element={<BusinessStudiesMentor />} />
        <Route path="chatbots/career-readiness-coach" element={<CareerReadinessCoach />} />
        <Route path="chatbots/lab-safety-protocol-advisor" element={<LabSafetyProtocolAdvisor />} />
        <Route path="chatbots/environmental-science-guide" element={<EnvironmentalScienceGuide />} />
        <Route path="chatbots/music-performance-coach" element={<MusicPerformanceCoach />} />
        <Route path="chatbots/drama-theater-director" element={<DramaTheaterDirector />} />
        <Route path="chatbots/digital-literacy-advisor" element={<DigitalLiteracyAdvisor />} />
        <Route path="chatbots/ai-machine-learning-educator" element={<AIMachineLearningEducator />} />
        <Route path="chatbots/marketing-branding-strategist" element={<MarketingBrandingStrategist />} />
        <Route path="chatbots/literacy-lab-coach" element={<LiteracyLabCoach />} />
        <Route path="chatbots/literature-analysis-expert" element={<LiteratureAnalysisExpert />} />
        <Route path="chatbots/grammar-writing-mentor" element={<GrammarWritingMentor />} />
        <Route path="chatbots/advanced-knowledge-skills-coach" element={<AdvancedKnowledgeSkillsCoach />} />
        <Route path="chatbots/unec-academic-development" element={<UNECAcademicDevelopment />} />
        <Route path="chatbots/adaptive-math-strategist" element={<AdaptiveMathStrategist />} />
        <Route path="chatbots/algebra-geometry-tutor" element={<AlgebraGeometryTutor />} />
        <Route path="chatbots/stem-inquiry-mentor" element={<STEMInquiryMentor />} />
        <Route path="chatbots/problem-solving-coach" element={<ProblemSolvingCoach />} />
        <Route path="youtube-quiz" element={<YouTubeQuizGenerator />} />
        <Route path="youtube-quiz/results" element={<QuizResults />} />
        <Route path="pixgen" element={<PixGen />} />
        <Route path="learning-hub" element={<ProfessionalLearningHub />} />
        <Route path="learning-hub/classroom-management" element={<ClassroomManagementCourse />} />
        <Route path="learning-hub/assessment-strategies" element={<AssessmentStrategiesCourse />} />
        <Route path="learning-hub/differentiation-course" element={<DifferentiationCourse />} />
        <Route path="learning-hub/student-engagement-course" element={<StudentEngagementCourse />} />
        <Route path="learning-hub/digital-literacy-course" element={<DigitalLiteracyCourse />} />
        <Route path="learning-hub/differentiation-tutorial" element={<DifferentiationTutorial />} />
        <Route path="learning-hub/lesson-planner-tutorial" element={<LessonPlannerTutorial />} />
        <Route path="learning-hub/assessment-tutorial" element={<AssessmentTutorial />} />
        <Route path="learning-hub/blooms-taxonomy" element={<BloomsTaxonomyResearch />} />
        <Route path="learning-hub/evidence-based-teaching" element={<EvidenceBasedTeachingResearch />} />
        <Route path="learning-hub/assessment-research" element={<AssessmentResearch />} />
        <Route path="learning-hub/sel-behavior-research" element={<SELBehaviorResearch />} />
        <Route path="learning-hub/growth-mindset-research" element={<GrowthMindsetResearch />} />
        <Route path="learning-hub/cognitive-load-research" element={<CognitiveLoadTheoryResearch />} />
        <Route path="learning-hub/metacognition-research" element={<MetacognitionResearch />} />
        <Route path="learning-hub/scaffolding-research" element={<ScaffoldingResearch />} />
        <Route path="learning-hub/student-engagement-path" element={<StudentEngagementPath />} />
        <Route path="learning-hub/advanced-differentiation-path" element={<AdvancedDifferentiationPath />} />
        <Route path="learning-hub/tiered-instruction-module" element={<TieredInstructionModule />} />
        <Route path="learning-hub/content-differentiation-module" element={<ContentDifferentiationModule />} />
        <Route path="learning-hub/process-differentiation-module" element={<ProcessDifferentiationModule />} />
        <Route path="learning-hub/product-differentiation-module" element={<ProductDifferentiationModule />} />
        <Route path="learning-hub/assessment-differentiation-module" element={<AssessmentDifferentiationModule />} />
        <Route path="learning-hub/advanced-grouping-module" element={<AdvancedGroupingModule />} />
        <Route path="learning-hub/ai-assessment-path" element={<AIAssistedAssessmentPath />} />
        <Route path="learning-hub/ai-assessment-intro-module" element={<AIAssessmentIntroModule />} />
        <Route path="learning-hub/automated-rubrics-module" element={<AutomatedRubricsModule />} />
        <Route path="learning-hub/instant-feedback-module" element={<InstantFeedbackModule />} />
        <Route path="learning-hub/formative-automation-module" element={<FormativeAutomationModule />} />
        <Route path="learning-hub/summative-ai-design-module" element={<SummativeAIDesignModule />} />
        <Route path="learning-hub/stem-mastery" element={<STEMMasteryCourse />} />
        <Route path="learning-hub/literacy-expert" element={<LiteracyExpertCourse />} />
        <Route path="learning-hub/ngss-foundations" element={<NGSSFoundationsModule />} />
        <Route path="learning-hub/engineering-design" element={<EngineeringDesignModule />} />
        <Route path="learning-hub/computational-thinking" element={<ComputationalThinkingModule />} />
        <Route path="learning-hub/lab-safety" element={<LabSafetyModule />} />
        <Route path="learning-hub/phenomena-driven" element={<PhenomenaDrivenModule />} />
        <Route path="learning-hub/data-literacy" element={<DataLiteracyModule />} />
        <Route path="learning-hub/stem-integration" element={<STEMIntegrationModule />} />
        <Route path="learning-hub/ngss-assessment" element={<NGSSAssessmentModule />} />
        <Route path="learning-hub/gamification-fundamentals" element={<GamificationFundamentals />} />
        <Route path="learning-hub/points-badges-leaderboards" element={<PointsBadgesLeaderboards />} />
        <Route path="learning-hub/inquiry-learning-hooks" element={<InquiryLearningHooks />} />
        <Route path="learning-hub/quest-based-learning" element={<QuestBasedLearning />} />
        <Route path="learning-hub/collaborative-game-mechanics" element={<CollaborativeGameMechanics />} />
        <Route path="learning-hub/adaptive-gamification" element={<AdaptiveGamification />} />
        <Route path="learning-hub/gamified-assessment" element={<GamifiedAssessment />} />
        <Route path="learning-hub/advanced-inquiry-frameworks" element={<AdvancedInquiryFrameworks />} />
        <Route path="history" element={<History />} />
        <Route path="personalization" element={<Personalization />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="administration/reporting" element={<Reporting />} />
        <Route path="administration/assessment" element={<Assessment />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="use-cases" element={<ExploreUseCases />} />
      </Routes>
    </DashboardLayout>
  )
}

export default Dashboard

