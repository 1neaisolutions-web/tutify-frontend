// Library import
import { Navigate } from 'react-router-dom';

// Local import
import { RoleBasedRedirect, UnknownRouteRedirect } from './routeHelpers';
import { Login } from '../panels/Authentication/Login';
import { SignUp } from '../panels/Authentication/SignUp';
import SignupEntry from '../pages/auth/SignupEntry';
import IndividualSignup from '../pages/auth/IndividualSignup';
import InstitutionAdminSignup from '../pages/auth/InstitutionAdminSignup';
import OrganizationAdminSignup from '../pages/auth/OrganizationAdminSignup';
import { ForgotPassword } from '../panels/Authentication/ForgotPassword';
import { ResetPassword } from '../panels/Authentication/ResetPassword';
import { VerifyEmail } from '../panels/Authentication/VerifyEmail';
import DashboardLayout from '../components/DashboardLayout';
import { ComingSoon } from '../components/shared/ComingSoon';

// Page imports
import DashboardHome from '../pages/DashboardHome';
import TemplatesLibrary from '../pages/features/TemplatesLibrary';
import TemplateRunner from '../pages/features/TemplateRunner';
import GeneralLessonPlanner from '../pages/features/GeneralLessonPlanner';
import StemActivityGenerator from '../pages/features/StemActivityGenerator';
import ProjectBasedLearningPlanner from '../pages/features/ProjectBasedLearningPlanner';
import SummativeAssessmentBuilder from '../pages/features/SummativeAssessmentBuilder';
import FormativeAssessmentGenerator from '../pages/features/FormativeAssessmentGenerator';
import BehaviourPlanBuilder from '../pages/features/BehaviourPlanBuilder';
import IcebreakerIdeaGenerator from '../pages/features/IcebreakerIdeaGenerator';
import ActivityPlanner from '../pages/features/ActivityPlanner';
import NewsletterArticleGenerator from '../pages/features/NewsletterArticleGenerator';
import MultiLessonPlanner from '../pages/features/MultiLessonPlanner';
import RealWorldMathProblemGenerator from '../pages/features/RealWorldMathProblemGenerator';
import MathGameBuilder from '../pages/features/MathGameBuilder';
import BudgetMasterChallenge from '../pages/features/BudgetMasterChallenge';
import ExperimentIdeaGenerator from '../pages/features/ExperimentIdeaGenerator';
import LearningIntentionBreakdown from '../pages/features/LearningIntentionBreakdown';
import SpecializedChatbots from '../pages/features/SpecializedChatbots';
import GeneralTeachingAssistantChat from '../pages/features/GeneralTeachingAssistantChat';
import GPT4TeachingAssistantChat from '../pages/features/GPT4TeachingAssistantChat';
import ClaudeEducationProChat from '../pages/features/ClaudeEducationProChat';
import GeminiEducationSuiteChat from '../pages/features/GeminiEducationSuiteChat';
import CodingProgrammingTutor from '../pages/features/CodingProgrammingTutor';
import VisualArtsStudioAssistant from '../pages/features/VisualArtsStudioAssistant';
import BusinessStudiesMentor from '../pages/features/BusinessStudiesMentor';
import CareerReadinessCoach from '../pages/features/CareerReadinessCoach';
import LabSafetyProtocolAdvisor from '../pages/features/LabSafetyProtocolAdvisor';
import EnvironmentalScienceGuide from '../pages/features/EnvironmentalScienceGuide';
import MusicPerformanceCoach from '../pages/features/MusicPerformanceCoach';
import DramaTheaterDirector from '../pages/features/DramaTheaterDirector';
import DigitalLiteracyAdvisor from '../pages/features/DigitalLiteracyAdvisor';
import AIMachineLearningEducator from '../pages/features/AIMachineLearningEducator';
import MarketingBrandingStrategist from '../pages/features/MarketingBrandingStrategist';
import LiteracyLabCoach from '../pages/features/LiteracyLabCoach';
import LiteratureAnalysisExpert from '../pages/features/LiteratureAnalysisExpert';
import GrammarWritingMentor from '../pages/features/GrammarWritingMentor';
import AdaptiveMathStrategist from '../pages/features/AdaptiveMathStrategist';
import AlgebraGeometryTutor from '../pages/features/AlgebraGeometryTutor';
import STEMInquiryMentor from '../pages/features/STEMInquiryMentor';
import ProblemSolvingCoach from '../pages/features/ProblemSolvingCoach';
import { AdvancedKnowledgeSkillsCoach } from '../pages/features/AdvancedKnowledgeSkillsCoach';
import UNECAcademicDevelopment from '../pages/features/UNECAcademicDevelopment';
import YouTubeQuizGenerator from '../pages/features/YouTubeQuizGenerator';
import QuizResults from '../pages/features/QuizResults';
import PixGen from '../pages/features/PixGen';
import ProfessionalLearningHub from '../pages/features/ProfessionalLearningHub';
import PersonalizedMicroCoursePage from '../pages/features/learningHubSections/PersonalizedMicroCoursePage';
import AIGrowthRecommendationPage from '../pages/features/learningHubSections/AIGrowthRecommendationPage';
import AIGuidedTutorialPage from '../pages/features/learningHubSections/AIGuidedTutorialPage';
import ResearchInsightPage from '../pages/features/learningHubSections/ResearchInsightPage';
import SpecialistDeepDiveTrackPage from '../pages/features/learningHubSections/SpecialistDeepDiveTrackPage';
import LearningHubSectionViewAllPage from '../pages/features/learningHubSections/LearningHubSectionViewAllPage';
import LearningHubLegacyRedirect from '../pages/features/LearningHubLegacyRedirect';
import History from '../pages/features/History';
import Personalization from '../pages/features/Personalization';
import Analytics from '../pages/features/Analytics';
import Reporting from '../pages/features/Reporting';
import Assessment from '../pages/features/Assessment';
import LearningHubContentOperations from '../pages/admin/LearningHubContentOperations';
import AccessCodesAdmin from '../pages/admin/AccessCodesAdmin';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
// Subscription page retired — /subscription redirects to /settings?tab=plan
import ExploreUseCases from '../pages/ExploreUseCases';
import { ContentPacksManagement } from '../pages/features/ContentPacksManagement';
import { ContentPackDetail } from '../pages/features/ContentPackDetail';
import { DocumentUpload } from '../pages/features/DocumentUpload';
import { DocumentDetails } from '../pages/features/DocumentDetails';
import { DocumentsList } from '../pages/features/DocumentsList';
import { WorksheetGenerator } from '../pages/features/WorksheetGenerator';
import { WorksheetViewer } from '../pages/features/WorksheetViewer';

import TeacherToolsOverview from '../pages/features/teacher-tools/TeacherToolsOverview';
import QuizList from '../pages/features/teacher-tools/quiz/QuizList';
import QuizCreate from '../pages/features/teacher-tools/quiz/QuizCreate';
import QuizDetail from '../pages/features/teacher-tools/quiz/QuizDetail';
import QuizSubmissions from '../pages/features/teacher-tools/quiz/QuizSubmissions';
import QuizAnalytics from '../pages/features/teacher-tools/quiz/QuizAnalytics';
import AssignmentList from '../pages/features/teacher-tools/assignment/AssignmentList';
import AssignmentCreate from '../pages/features/teacher-tools/assignment/AssignmentCreate';
import AssignmentDetail from '../pages/features/teacher-tools/assignment/AssignmentDetail';
import AssignmentSubmissions from '../pages/features/teacher-tools/assignment/AssignmentSubmissions';
import AssignmentAnalytics from '../pages/features/teacher-tools/assignment/AssignmentAnalytics';
import WorksheetList from '../pages/features/teacher-tools/worksheet/WorksheetList';
import WorksheetCreate from '../pages/features/teacher-tools/worksheet/WorksheetCreate';
import WorksheetDetail from '../pages/features/teacher-tools/worksheet/WorksheetDetail';
import WorksheetResponses from '../pages/features/teacher-tools/worksheet/WorksheetResponses';
import WorksheetAnalytics from '../pages/features/teacher-tools/worksheet/WorksheetAnalytics';
import ExamList from '../pages/features/teacher-tools/exams/ExamList';
import ExamCreate from '../pages/features/teacher-tools/exams/ExamCreate';
import ExamDetail from '../pages/features/teacher-tools/exams/ExamDetail';
import ExamCandidates from '../pages/features/teacher-tools/exams/ExamCandidates';
import ExamResults from '../pages/features/teacher-tools/exams/ExamResults';
import ExamAnalytics from '../pages/features/teacher-tools/exams/ExamAnalytics';
import TeacherToolsTemplates from '../pages/features/teacher-tools/templates/TeacherToolsTemplates';
import TeacherToolsUnifiedAnalytics from '../pages/features/teacher-tools/analytics/TeacherToolsUnifiedAnalytics';

export const commonRoutes = [
  {
    path: '/',
    moduleName: 'Base',
    element: <RoleBasedRedirect />,
  },
  {
    path: '/settings',
    moduleName: 'Settings',
    element: (
      <DashboardLayout>
        <Settings />
      </DashboardLayout>
    ),
  },
  {
    path: '/profile',
    moduleName: 'Profile',
    element: (
      <DashboardLayout>
        <Profile />
      </DashboardLayout>
    ),
  },
  {
    path: '/subscription',
    element: <Navigate to="/settings?tab=plan" replace />,
  },
  {
    path: '*',
    moduleName: 'Unknown Route Redirect',
    element: <UnknownRouteRedirect />,
  },
];

const withDashboardLayout = (element) => (
  <DashboardLayout>
    {element}
  </DashboardLayout>
)

export const teacherRoutes = [
  {
    path: '/dashboard',
    moduleName: 'Dashboard',
    element: (
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    ),
  },
  {
    path: '/teacher-tools',
    moduleName: 'Teacher Tools',
    element: (
      <DashboardLayout>
        <TeacherToolsOverview />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/teacher-tools/quiz',
        moduleName: 'Quiz',
        element: (
          <DashboardLayout>
            <QuizList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/create',
        moduleName: 'Create Quiz',
        element: (
          <DashboardLayout>
            <QuizCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId/edit',
        moduleName: 'Edit Quiz',
        element: (
          <DashboardLayout>
            <QuizCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId',
        moduleName: 'Quiz Detail',
        element: (
          <DashboardLayout>
            <QuizDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId/submissions',
        moduleName: 'Quiz Submissions',
        element: (
          <DashboardLayout>
            <QuizSubmissions />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/quiz/:quizId/analytics',
        moduleName: 'Quiz Analytics',
        element: (
          <DashboardLayout>
            <QuizAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment',
        moduleName: 'Assignment',
        element: (
          <DashboardLayout>
            <AssignmentList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/create',
        moduleName: 'Create Assignment',
        element: (
          <DashboardLayout>
            <AssignmentCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId/edit',
        moduleName: 'Edit Assignment',
        element: (
          <DashboardLayout>
            <AssignmentCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId',
        moduleName: 'Assignment Detail',
        element: (
          <DashboardLayout>
            <AssignmentDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId/submissions',
        moduleName: 'Assignment Submissions',
        element: (
          <DashboardLayout>
            <AssignmentSubmissions />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/assignment/:assignmentId/analytics',
        moduleName: 'Assignment Analytics',
        element: (
          <DashboardLayout>
            <AssignmentAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet',
        moduleName: 'Worksheet',
        element: (
          <DashboardLayout>
            <WorksheetList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/create',
        moduleName: 'Create Worksheet',
        element: (
          <DashboardLayout>
            <WorksheetCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId/edit',
        moduleName: 'Edit Worksheet',
        element: (
          <DashboardLayout>
            <WorksheetCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId',
        moduleName: 'Worksheet Detail',
        element: (
          <DashboardLayout>
            <WorksheetDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId/responses',
        moduleName: 'Worksheet Responses',
        element: (
          <DashboardLayout>
            <WorksheetResponses />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/worksheet/:worksheetId/analytics',
        moduleName: 'Worksheet Analytics',
        element: (
          <DashboardLayout>
            <WorksheetAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams',
        moduleName: 'Exams',
        element: (
          <DashboardLayout>
            <ExamList />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/create',
        moduleName: 'Create Exam',
        element: (
          <DashboardLayout>
            <ExamCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/edit',
        moduleName: 'Edit Exam',
        element: (
          <DashboardLayout>
            <ExamCreate />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId',
        moduleName: 'Exam Detail',
        element: (
          <DashboardLayout>
            <ExamDetail />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/candidates',
        moduleName: 'Exam Candidates',
        element: (
          <DashboardLayout>
            <ExamCandidates />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/results',
        moduleName: 'Exam Results',
        element: (
          <DashboardLayout>
            <ExamResults />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/exams/:examId/analytics',
        moduleName: 'Exam Analytics',
        element: (
          <DashboardLayout>
            <ExamAnalytics />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/templates',
        moduleName: 'Teacher Tools Templates',
        element: (
          <DashboardLayout>
            <TeacherToolsTemplates />
          </DashboardLayout>
        ),
      },
      {
        path: '/teacher-tools/analytics',
        moduleName: 'Teacher Tools Analytics',
        element: (
          <DashboardLayout>
            <TeacherToolsUnifiedAnalytics />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/templates',
    moduleName: 'Templates Library',
    element: (
      <DashboardLayout>
        <TemplatesLibrary />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/templates/:slug',
        moduleName: 'Template Runner',
        element: (
          <DashboardLayout>
            <TemplateRunner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/general-lesson-planner',
        moduleName: 'General Lesson Planner',
        element: (
          <DashboardLayout>
            <GeneralLessonPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/stem-activity-generator',
        moduleName: 'STEM Activity Generator',
        element: (
          <DashboardLayout>
            <StemActivityGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/project-based-learning-planner',
        moduleName: 'Project Based Learning Planner',
        element: (
          <DashboardLayout>
            <ProjectBasedLearningPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/summative-assessment-builder',
        moduleName: 'Summative Assessment Builder',
        element: (
          <DashboardLayout>
            <SummativeAssessmentBuilder />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/formative-assessment-generator',
        moduleName: 'Formative Assessment Generator',
        element: (
          <DashboardLayout>
            <FormativeAssessmentGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/behaviour-plan-builder',
        moduleName: 'Behaviour Plan Builder',
        element: (
          <DashboardLayout>
            <BehaviourPlanBuilder />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/icebreaker-idea-generator',
        moduleName: 'Icebreaker Idea Generator',
        element: (
          <DashboardLayout>
            <IcebreakerIdeaGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/activity-planner',
        moduleName: 'Activity Planner',
        element: (
          <DashboardLayout>
            <ActivityPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/newsletter-article-generator',
        moduleName: 'Newsletter Article Generator',
        element: (
          <DashboardLayout>
            <NewsletterArticleGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/multi-lesson-planner',
        moduleName: 'Multi Lesson Planner',
        element: (
          <DashboardLayout>
            <MultiLessonPlanner />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/real-world-math-problem-generator',
        moduleName: 'Real World Math Problem Generator',
        element: (
          <DashboardLayout>
            <RealWorldMathProblemGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/math-game-builder',
        moduleName: 'Math Game Builder',
        element: (
          <DashboardLayout>
            <MathGameBuilder />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/budget-master-challenge',
        moduleName: 'Budget Master Challenge',
        element: (
          <DashboardLayout>
            <BudgetMasterChallenge />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/experiment-idea-generator',
        moduleName: 'Experiment Idea Generator',
        element: (
          <DashboardLayout>
            <ExperimentIdeaGenerator />
          </DashboardLayout>
        ),
      },
      {
        path: '/templates/learning-intention-breakdown',
        moduleName: 'Learning Intention Breakdown',
        element: (
          <DashboardLayout>
            <LearningIntentionBreakdown />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/chatbots',
    moduleName: 'Specialized Chatbots',
    element: (
      <DashboardLayout>
        <SpecializedChatbots />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/chatbots/general-teaching-assistant',
        moduleName: 'General Teaching Assistant',
        element: withDashboardLayout(<GeneralTeachingAssistantChat />),
      },
      {
        path: '/chatbots/gpt4-teaching-assistant',
        moduleName: 'GPT4 Teaching Assistant',
        element: withDashboardLayout(<GPT4TeachingAssistantChat />),
      },
      {
        path: '/chatbots/claude-education-pro',
        moduleName: 'Claude Education Pro',
        element: withDashboardLayout(<ClaudeEducationProChat />),
      },
      {
        path: '/chatbots/gemini-education-suite',
        moduleName: 'Gemini Education Suite',
        element: withDashboardLayout(<GeminiEducationSuiteChat />),
      },
      {
        path: '/chatbots/coding-programming-tutor',
        moduleName: 'Coding Programming Tutor',
        element: withDashboardLayout(<CodingProgrammingTutor />),
      },
      {
        path: '/chatbots/visual-arts-studio-assistant',
        moduleName: 'Visual Arts Studio Assistant',
        element: withDashboardLayout(<VisualArtsStudioAssistant />),
      },
      {
        path: '/chatbots/business-studies-mentor',
        moduleName: 'Business Studies Mentor',
        element: withDashboardLayout(<BusinessStudiesMentor />),
      },
      {
        path: '/chatbots/career-readiness-coach',
        moduleName: 'Career Readiness Coach',
        element: withDashboardLayout(<CareerReadinessCoach />),
      },
      {
        path: '/chatbots/lab-safety-protocol-advisor',
        moduleName: 'Lab Safety Protocol Advisor',
        element: withDashboardLayout(<LabSafetyProtocolAdvisor />),
      },
      {
        path: '/chatbots/environmental-science-guide',
        moduleName: 'Environmental Science Guide',
        element: withDashboardLayout(<EnvironmentalScienceGuide />),
      },
      {
        path: '/chatbots/music-performance-coach',
        moduleName: 'Music Performance Coach',
        element: withDashboardLayout(<MusicPerformanceCoach />),
      },
      {
        path: '/chatbots/drama-theater-director',
        moduleName: 'Drama Theater Director',
        element: withDashboardLayout(<DramaTheaterDirector />),
      },
      {
        path: '/chatbots/digital-literacy-advisor',
        moduleName: 'Digital Literacy Advisor',
        element: withDashboardLayout(<DigitalLiteracyAdvisor />),
      },
      {
        path: '/chatbots/ai-machine-learning-educator',
        moduleName: 'AI Machine Learning Educator',
        element: withDashboardLayout(<AIMachineLearningEducator />),
      },
      {
        path: '/chatbots/marketing-branding-strategist',
        moduleName: 'Marketing Branding Strategist',
        element: withDashboardLayout(<MarketingBrandingStrategist />),
      },
      {
        path: '/chatbots/literacy-lab-coach',
        moduleName: 'Literacy Lab Coach',
        element: withDashboardLayout(<LiteracyLabCoach />),
      },
      {
        path: '/chatbots/literature-analysis-expert',
        moduleName: 'Literature Analysis Expert',
        element: withDashboardLayout(<LiteratureAnalysisExpert />),
      },
      {
        path: '/chatbots/grammar-writing-mentor',
        moduleName: 'Grammar Writing Mentor',
        element: withDashboardLayout(<GrammarWritingMentor />),
      },
      {
        path: '/chatbots/advanced-knowledge-skills-coach',
        moduleName: 'Advanced Knowledge Skills Coach',
        element: withDashboardLayout(<AdvancedKnowledgeSkillsCoach />),
      },
      {
        path: '/chatbots/unec-academic-development',
        moduleName: 'UNEC Academic Development',
        element: withDashboardLayout(<UNECAcademicDevelopment />),
      },
      {
        path: '/chatbots/adaptive-math-strategist',
        moduleName: 'Adaptive Math Strategist',
        element: withDashboardLayout(<AdaptiveMathStrategist />),
      },
      {
        path: '/chatbots/algebra-geometry-tutor',
        moduleName: 'Algebra Geometry Tutor',
        element: withDashboardLayout(<AlgebraGeometryTutor />),
      },
      {
        path: '/chatbots/stem-inquiry-mentor',
        moduleName: 'STEM Inquiry Mentor',
        element: withDashboardLayout(<STEMInquiryMentor />),
      },
      {
        path: '/chatbots/problem-solving-coach',
        moduleName: 'Problem Solving Coach',
        element: withDashboardLayout(<ProblemSolvingCoach />),
      },
    ],
  },
  {
    path: '/youtube-quiz',
    moduleName: 'YouTube Quiz Generator',
    element: (
      <DashboardLayout>
        <YouTubeQuizGenerator />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/youtube-quiz/results',
        moduleName: 'Quiz Results',
        element: (
          <DashboardLayout>
            <QuizResults />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/pixgen',
    moduleName: 'PixGen (AI Media Studio)',
    element: (
      <DashboardLayout>
        <PixGen />
      </DashboardLayout>
    ),
  },
  {
    path: '/learning-hub',
    moduleName: 'Professional Learning Hub',
    element: (
      <DashboardLayout>
        <ProfessionalLearningHub />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/learning-hub/personalized-micro-courses/:slug',
        moduleName: 'Personalized Micro Courses',
        element: (
          <DashboardLayout>
            <PersonalizedMicroCoursePage />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/ai-growth-recommendations/:slug',
        moduleName: 'AI Growth Recommendations',
        element: (
          <DashboardLayout>
            <AIGrowthRecommendationPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/ai-guided-tutorials-demonstrations/:slug',
        moduleName: 'AI Guided Tutorials and Demonstrations',
        element: (
          <DashboardLayout>
            <AIGuidedTutorialPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/research-insights-library/:slug',
        moduleName: 'Research Insights Library',
        element: (
          <DashboardLayout>
            <ResearchInsightPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/specialist-deep-dive-tracks/:slug',
        moduleName: 'Specialist Deep Dive Tracks',
        element: (
          <DashboardLayout>
            <SpecialistDeepDiveTrackPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/sections/:section',
        moduleName: 'Learning Hub Section View All',
        element: (
          <DashboardLayout>
            <LearningHubSectionViewAllPage />
          </DashboardLayout>
        ),
      },
      {
        path: '/learning-hub/:itemSlug',
        moduleName: 'Legacy Learning Hub Redirect',
        element: (
          <DashboardLayout>
            <LearningHubLegacyRedirect />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/history',
    moduleName: 'History',
    element: (
      <DashboardLayout>
        <History />
      </DashboardLayout>
    ),
  },
  {
    path: '/personalization',
    moduleName: 'Personalization',
    element: (
      <DashboardLayout>
        <Personalization />
      </DashboardLayout>
    ),
  },
  {
    path: '/analytics',
    moduleName: 'Analytics',
    element: (
      <DashboardLayout>
        <Analytics />
      </DashboardLayout>
    ),
  },
  {
    path: '/administration',
    moduleName: 'Administration',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/administration/reporting',
        moduleName: 'Reporting',
        element: (
          <DashboardLayout>
            <Reporting />
          </DashboardLayout>
        ),
      },
      {
        path: '/administration/assessment',
        moduleName: 'Assessment',
        element: (
          <DashboardLayout>
            <Assessment />
          </DashboardLayout>
        ),
      },
      {
        path: '/admin/content-packs',
        moduleName: 'Content Management',
        element: (
          <DashboardLayout>
            <ContentPacksManagement />
          </DashboardLayout>
        ),
        child: [
          {
            path: '/admin/content-packs/:id',
            moduleName: 'Content Pack Details',
            element: (
              <DashboardLayout>
                <ContentPackDetail />
              </DashboardLayout>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/use-cases',
    moduleName: 'Explore Use Cases',
    element: (
      <DashboardLayout>
        <ExploreUseCases />
      </DashboardLayout>
    ),
  },
  {
    path: '/worksheets/generate',
    moduleName: 'Worksheet Generator',
    element: (
      <DashboardLayout>
        <WorksheetGenerator />
      </DashboardLayout>
    ),
  },
  {
    path: '/worksheets/:id',
    moduleName: 'Worksheet Viewer',
    element: (
      <DashboardLayout>
        <WorksheetViewer />
      </DashboardLayout>
    ),
  },
];

export const superAdminRoutes = [
  {
    path: '/administration',
    moduleName: 'Administration',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/admin/content-packs',
        moduleName: 'Content Management',
        element: (
          <DashboardLayout>
            <ContentPacksManagement />
          </DashboardLayout>
        ),
        child: [
          {
            path: '/admin/content-packs/:id',
            moduleName: 'Content Pack Details',
            element: (
              <DashboardLayout>
                <ContentPackDetail />
              </DashboardLayout>
            ),
          },
        ],
      },
      {
        path: '/administration/learning-hub-content',
        moduleName: 'Learning Hub content',
        element: (
          <DashboardLayout>
            <LearningHubContentOperations />
          </DashboardLayout>
        ),
      },
      {
        path: '/admin/access-codes',
        moduleName: 'Access Codes',
        element: (
          <DashboardLayout>
            <AccessCodesAdmin />
          </DashboardLayout>
        ),
      },
    ],
  },
];

export const orgAdminRoutes = [
  {
    path: '/organization',
    moduleName: 'Organization',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
  {
    path: '/admin/content-packs',
    moduleName: 'Content Packs',
    element: (
      <DashboardLayout>
        <ContentPacksManagement />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/admin/content-packs/:id',
        moduleName: 'Content Pack Details',
        element: (
          <DashboardLayout>
            <ContentPackDetail />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/admin/documents',
    moduleName: 'Documents',
    element: (
      <DashboardLayout>
        <DocumentsList />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/admin/documents/upload',
        moduleName: 'Upload Document',
        element: (
          <DashboardLayout>
            <DocumentUpload />
          </DashboardLayout>
        ),
      },
      {
        path: '/admin/documents/:id',
        moduleName: 'Document Details',
        element: (
          <DashboardLayout>
            <DocumentDetails />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/administration/learning-hub-content',
    moduleName: 'Learning Hub content',
    element: (
      <DashboardLayout>
        <LearningHubContentOperations />
      </DashboardLayout>
    ),
  },
];

export const schoolAdminRoutes = [
  {
    path: '/school',
    moduleName: 'School',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
  {
    path: '/admin/content-packs',
    moduleName: 'Content Packs',
    element: (
      <DashboardLayout>
        <ContentPacksManagement />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/admin/content-packs/:id',
        moduleName: 'Content Pack Details',
        element: (
          <DashboardLayout>
            <ContentPackDetail />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: '/admin/documents',
    moduleName: 'Documents',
    element: (
      <DashboardLayout>
        <DocumentsList />
      </DashboardLayout>
    ),
    child: [
      {
        path: '/admin/documents/upload',
        moduleName: 'Upload Document',
        element: (
          <DashboardLayout>
            <DocumentUpload />
          </DashboardLayout>
        ),
      },
      {
        path: '/admin/documents/:id',
        moduleName: 'Document Details',
        element: (
          <DashboardLayout>
            <DocumentDetails />
          </DashboardLayout>
        ),
      },
    ],
  },
];

export const studentRoutes = [
  {
    path: '/student',
    moduleName: 'Student',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
];

export const parentRoutes = [
  {
    path: '/parent',
    moduleName: 'Parent',
    element: (
      <DashboardLayout>
        <ComingSoon />
      </DashboardLayout>
    ),
  },
];

// Auth routes
export const authRoutes = [
  {
    path: '/login',
    moduleName: 'Login',
    element: <Login />,
  },
  {
    path: '/signup',
    moduleName: 'Signup Entry',
    element: <SignupEntry />,
  },
  {
    path: '/signup/individual',
    moduleName: 'Individual Signup',
    element: <IndividualSignup />,
  },
  {
    path: '/signup/institution',
    moduleName: 'Institution Admin Signup',
    element: <InstitutionAdminSignup />,
  },
  {
    path: '/signup/organization',
    moduleName: 'Organization Admin Signup',
    element: <OrganizationAdminSignup />,
  },
  {
    path: '/signup/legacy',
    moduleName: 'Legacy Signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    moduleName: 'Forgot password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    moduleName: 'Reset Password',
    element: <ResetPassword />,
  },
  {
    path: '/verify-email',
    moduleName: 'Verify Email',
    element: <VerifyEmail />,
  },
  {
    path: '*',
    element: <Navigate to='/login' replace />,
  },
];
