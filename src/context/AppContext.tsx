import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppView,
  Course,
  FeedbackComment,
  FeedbackSubmission,
  RatingValue,
  UserRole,
  ActivityItem,
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_FEEDBACK_COMMENTS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';

interface FeedbackDraft {
  courseId: string;
  step: number; // 1..5
  ratings: {
    teaching: RatingValue;
    content: RatingValue;
    engagement: RatingValue;
  };
  reflectionText: string;
  updatedAt: string;
}

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  // Courses & Data
  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  selectedSemester: string;
  setSelectedSemester: (sem: string) => void;
  
  // Feedback In-Progress
  activeCourse: Course | undefined;
  activeStep: number;
  setActiveStep: (step: number) => void;
  ratings: {
    teaching: RatingValue;
    content: RatingValue;
    engagement: RatingValue;
  };
  setRating: (category: 'teaching' | 'content' | 'engagement', value: RatingValue) => void;
  reflectionText: string;
  setReflectionText: (text: string) => void;
  lastSavedTime: string;
  
  // Form Validation & Errors
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clearFieldError: (field: string) => void;
  validateStep: (stepNum: number) => boolean;
  validateAllFeedback: () => { isValid: boolean; errors: Record<string, string> };

  // Actions
  startFeedback: (courseId?: string, startStep?: number) => void;
  saveDraft: () => void;
  submitCurrentFeedback: () => FeedbackSubmission | null;
  resetFeedbackState: () => void;
  
  // Comments & Saved Bookmarks
  comments: FeedbackComment[];
  toggleBookmark: (commentId: string) => void;
  
  // Submissions & Activities
  submissions: FeedbackSubmission[];
  activities: ActivityItem[];
  latestSubmission: FeedbackSubmission | null;
  
  // Feedback Explorer filter
  commentFilter: 'All' | 'Lectures' | 'Assignments' | 'Labs' | 'General';
  setCommentFilter: (f: 'All' | 'Lectures' | 'Assignments' | 'Labs' | 'General') => void;
  
  // Toast
  toast: ToastMessage | null;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: () => void;

  // View All Activity modal
  isActivityModalOpen: boolean;
  setIsActivityModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [userRole, setUserRole] = useState<UserRole>('student');
  
  // Courses state - merge with INITIAL_COURSES to guarantee newly added fields (department, level, seats) are populated
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('sp_courses_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_COURSES.length && parsed[0].department) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_COURSES;
  });

  // Insights course and semester
  const [selectedCourseId, setSelectedCourseId] = useState<string>('cs401');
  const [selectedSemester, setSelectedSemester] = useState<string>('Spring 2024');

  // Feedback form state
  const [activeFeedbackCourseId, setActiveFeedbackCourseId] = useState<string>('cs410');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [ratings, setRatings] = useState<{
    teaching: RatingValue;
    content: RatingValue;
    engagement: RatingValue;
  }>({
    teaching: 3, // Defaults to 3 (Average)
    content: 4,
    engagement: 4,
  });
  const [reflectionText, setReflectionText] = useState<string>(
    'While the lecture slides were comprehensive, some of the assigned readings felt slightly outdated, particularly regarding recent advancements in SDN (Software-Defined Networking). More contemporary case studies would elevate the material.'
  );
  const [lastSavedTime, setLastSavedTime] = useState<string>('2m ago');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Comments state
  const [comments, setComments] = useState<FeedbackComment[]>(() => {
    const saved = localStorage.getItem('sp_comments_v1');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK_COMMENTS;
  });

  // Submissions state
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(() => {
    const saved = localStorage.getItem('sp_submissions_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Activities state
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('sp_activities_v1');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [latestSubmission, setLatestSubmission] = useState<FeedbackSubmission | null>(null);
  const [commentFilter, setCommentFilter] = useState<'All' | 'Lectures' | 'Assignments' | 'Labs' | 'General'>('All');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sp_courses_v2', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('sp_comments_v1', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('sp_submissions_v1', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('sp_activities_v1', JSON.stringify(activities));
  }, [activities]);

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    setToast({
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      type,
    });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const dismissToast = () => setToast(null);

  const activeCourse = courses.find((c) => c.id === activeFeedbackCourseId) || courses[0];

  const clearFieldError = (field: string) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const setRating = (category: 'teaching' | 'content' | 'engagement', value: RatingValue) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
    clearFieldError(category);
  };

  // Validation functions
  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!ratings.teaching || ratings.teaching < 1 || ratings.teaching > 5) {
        newErrors.teaching = 'Please select a rating for Teaching Quality (1 to 5 stars).';
      }
    } else if (stepNum === 2) {
      if (!ratings.content || ratings.content < 1 || ratings.content > 5) {
        newErrors.content = 'Please select a rating for Course Content & Labs (1 to 5 stars).';
      }
    } else if (stepNum === 3) {
      if (!ratings.engagement || ratings.engagement < 1 || ratings.engagement > 5) {
        newErrors.engagement = 'Please select a rating for Class Engagement & Discussion (1 to 5 stars).';
      }
    } else if (stepNum === 4) {
      const trimmed = reflectionText.trim();
      if (!trimmed) {
        newErrors.reflectionText = 'Please provide written qualitative feedback for the course.';
      } else if (trimmed.length < 20) {
        newErrors.reflectionText = `Reflection must be at least 20 characters long (currently ${trimmed.length} characters).`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...newErrors }));
      const firstErrMsg = Object.values(newErrors)[0];
      showToast('Validation Required', firstErrMsg, 'warning');
      return false;
    }

    return true;
  };

  const validateAllFeedback = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!ratings.teaching || ratings.teaching < 1 || ratings.teaching > 5) {
      errors.teaching = 'Question 1 (Teaching Quality) rating is required.';
    }
    if (!ratings.content || ratings.content < 1 || ratings.content > 5) {
      errors.content = 'Question 2 (Course Content) rating is required.';
    }
    if (!ratings.engagement || ratings.engagement < 1 || ratings.engagement > 5) {
      errors.engagement = 'Question 3 (Class Engagement) rating is required.';
    }

    const trimmed = reflectionText.trim();
    if (!trimmed) {
      errors.reflectionText = 'Question 4 (Qualitative Reflection) cannot be blank.';
    } else if (trimmed.length < 20) {
      errors.reflectionText = `Question 4 requires at least 20 characters of constructive feedback (currently ${trimmed.length} characters).`;
    }

    setFormErrors(errors);
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const startFeedback = (courseId?: string, startStep: number = 1) => {
    const targetCourseId = courseId || 'cs410';
    setActiveFeedbackCourseId(targetCourseId);
    setActiveStep(startStep);
    setFormErrors({});

    // If course had a draft, load draft
    const course = courses.find((c) => c.id === targetCourseId);
    if (course && course.hasDraft) {
      setRatings({
        teaching: 3,
        content: 4,
        engagement: 4,
      });
      setReflectionText(
        'While the lecture slides were comprehensive, some of the assigned readings felt slightly outdated, particularly regarding recent advancements in SDN (Software-Defined Networking). More contemporary case studies would elevate the material.'
      );
    }

    setCurrentView('feedback');
  };

  const saveDraft = () => {
    setLastSavedTime('Just now');
    const now = new Date();
    
    // Update course progress in courses list
    const calcProgress = Math.min(100, Math.round((activeStep / 4) * 100));
    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeFeedbackCourseId
          ? { ...c, draftProgress: calcProgress, hasDraft: true }
          : c
      )
    );

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: activeCourse?.name || 'Course Feedback',
      courseCode: activeCourse?.code || 'CS410',
      type: 'draft_saved',
      timestamp: now.toISOString(),
      timeAgo: 'Draft saved • Just now',
    };

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    showToast('Draft Saved', `Your responses for ${activeCourse?.name} were auto-saved.`, 'info');
  };

  const submitCurrentFeedback = (): FeedbackSubmission | null => {
    // Run full validation check before submission
    const validation = validateAllFeedback();
    if (!validation.isValid) {
      const errorCount = Object.keys(validation.errors).length;
      showToast(
        'Submission Incomplete',
        `Please complete ${errorCount} required ${errorCount === 1 ? 'field' : 'fields'} before submitting.`,
        'error'
      );
      return null;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const averageRating = Number(
      ((ratings.teaching + ratings.content + ratings.engagement) / 3).toFixed(1)
    );

    let sentiment: 'Highly Positive' | 'Positive' | 'Neutral' | 'Constructive' = 'Positive';
    if (averageRating >= 4.5) sentiment = 'Highly Positive';
    else if (averageRating >= 3.7) sentiment = 'Positive';
    else if (averageRating >= 2.8) sentiment = 'Neutral';
    else sentiment = 'Constructive';

    const newSubmission: FeedbackSubmission = {
      id: `sub-${Date.now()}`,
      courseId: activeFeedbackCourseId,
      courseCode: activeCourse?.code || 'CS410',
      courseName: activeCourse?.name || 'Computer Networks',
      instructorName: activeCourse?.instructor || 'Dr. Rahul Mehta',
      submittedAt: `${formattedDate} at ${formattedTime}`,
      ratings: { ...ratings },
      reflectionText,
      categoryScores: {
        courseContent: Number((ratings.content * 0.96 + 0.4).toFixed(1)),
        teachingQuality: Number((ratings.teaching * 0.9 + 0.5).toFixed(1)),
        engagement: Number((ratings.engagement * 0.85 + 0.6).toFixed(1)),
      },
      overallSentiment: sentiment,
      isAnonymous: true,
    };

    // Update submissions list
    setSubmissions((prev) => [newSubmission, ...prev]);
    setLatestSubmission(newSubmission);

    // Update course status
    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeFeedbackCourseId
          ? {
              ...c,
              totalSubmissions: c.totalSubmissions + 1,
              draftProgress: 100,
              hasDraft: false,
              feedbackClosed: false,
            }
          : c
      )
    );

    // Add new qualitative comment if text provided
    if (reflectionText.trim().length >= 20) {
      const newComment: FeedbackComment = {
        id: `fb-${Date.now()}`,
        courseId: activeFeedbackCourseId,
        category: 'Lectures',
        tag: 'Spring 2024',
        date: formattedDate,
        content: reflectionText.trim(),
        isSaved: false,
        sentiment: averageRating >= 4 ? 'positive' : averageRating === 3 ? 'neutral' : 'improvement',
      };
      setComments((prev) => [newComment, ...prev]);
    }

    // Add activity record
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: activeCourse?.name || 'Course',
      courseCode: activeCourse?.code || 'CS410',
      type: 'submitted',
      timestamp: now.toISOString(),
      timeAgo: 'Feedback submitted • Just now',
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

    showToast('Feedback Submitted', `Thank you! Your perspective for ${activeCourse?.name} has been recorded.`, 'success');
    setCurrentView('success');
    return newSubmission;
  };

  const resetFeedbackState = () => {
    setActiveStep(1);
    setRatings({
      teaching: 3,
      content: 4,
      engagement: 4,
    });
    setReflectionText('');
    setLastSavedTime('Just now');
    setFormErrors({});
  };

  const toggleBookmark = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const nextSaved = !c.isSaved;
          showToast(
            nextSaved ? 'Feedback Bookmarked' : 'Bookmark Removed',
            nextSaved ? 'Saved to your insights collection.' : 'Removed from saved comments.',
            'info'
          );
          return { ...c, isSaved: nextSaved };
        }
        return c;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        courses,
        selectedCourseId,
        setSelectedCourseId,
        selectedSemester,
        setSelectedSemester,
        activeCourse,
        activeStep,
        setActiveStep,
        ratings,
        setRating,
        reflectionText,
        setReflectionText,
        lastSavedTime,
        formErrors,
        setFormErrors,
        clearFieldError,
        validateStep,
        validateAllFeedback,
        startFeedback,
        saveDraft,
        submitCurrentFeedback,
        resetFeedbackState,
        comments,
        toggleBookmark,
        submissions,
        activities,
        latestSubmission,
        commentFilter,
        setCommentFilter,
        toast,
        showToast,
        dismissToast,
        isActivityModalOpen,
        setIsActivityModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
