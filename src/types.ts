export type RatingValue = 1 | 2 | 3 | 4 | 5;

export type RatingLabel = 'Very Poor' | 'Poor' | 'Average' | 'Good' | 'Excellent';

export interface RatingOption {
  value: RatingValue;
  label: RatingLabel;
  iconName: string;
}

export type CourseLevel = '100-Level' | '200-Level' | '300-Level' | '400-Level' | 'Graduate';

export type AvailabilityStatus = 'all' | 'open' | 'full';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  department: string;
  level: CourseLevel;
  semester: string;
  year: number;
  category: string;
  overallRating: number;
  ratingDelta: number;
  totalSubmissions: number;
  feedbackClosed: boolean;
  deadlineDaysRemaining?: number;
  draftProgress?: number;
  hasDraft?: boolean;
  seatsAvailable: number;
  totalSeats: number;
  isFull: boolean;
  waitlistCount?: number;
  credits?: number;
  schedule?: string;
}

export interface FeedbackSubmission {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  instructorName: string;
  submittedAt: string;
  ratings: {
    teaching: RatingValue; // Question 1
    content: RatingValue;  // Question 2
    engagement: RatingValue; // Question 3
  };
  reflectionText: string;
  categoryScores: {
    courseContent: number;
    teachingQuality: number;
    engagement: number;
  };
  overallSentiment: 'Highly Positive' | 'Positive' | 'Neutral' | 'Constructive';
  isAnonymous: boolean;
}

export interface FeedbackValidationErrors {
  teaching?: string;
  content?: string;
  engagement?: string;
  reflectionText?: string;
}

export interface QualitativeSummaryItem {
  id: string;
  title: string;
  description: string;
  type: 'value' | 'opportunity';
}

export interface FeedbackComment {
  id: string;
  courseId: string;
  category: 'Lectures' | 'Assignments' | 'Labs' | 'General';
  tag: string; // e.g. "Week 5", "Project 1"
  date: string;
  content: string;
  isSaved?: boolean;
  sentiment?: 'positive' | 'neutral' | 'improvement';
}

export interface PulseChartPoint {
  week: string;
  score: number;
  label: string;
  note?: string;
}

export type AppView = 
  | 'home'
  | 'feedback'
  | 'summary'
  | 'success'
  | 'insights'
  | 'courses'
  | 'profile';

export type UserRole = 'student' | 'faculty';

export interface ActivityItem {
  id: string;
  title: string;
  courseCode: string;
  type: 'submitted' | 'draft_saved' | 'feedback_opened' | 'faculty_reply';
  timestamp: string;
  timeAgo: string;
}
