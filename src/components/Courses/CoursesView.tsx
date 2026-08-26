import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseLevel, AvailabilityStatus } from '../../types';

export const CoursesView: React.FC = () => {
  const { courses, startFeedback, setSelectedCourseId, setCurrentView } = useApp();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityStatus>('all');
  const [sortBy, setSortBy] = useState<'code' | 'rating' | 'deadline' | 'seats'>('code');

  // Extract unique departments and instructors dynamically
  const departments = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.department) set.add(c.department);
    });
    return ['All', ...Array.from(set).sort()];
  }, [courses]);

  const instructors = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.instructor) set.add(c.instructor);
    });
    return ['All', ...Array.from(set).sort()];
  }, [courses]);

  const levels: (string | CourseLevel)[] = [
    'All',
    '100-Level',
    '200-Level',
    '300-Level',
    '400-Level',
    'Graduate',
  ];

  // Dynamic filtering logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search term match across name, code, instructor, department, and category
        const term = searchTerm.trim().toLowerCase();
        const matchSearch =
          !term ||
          course.name.toLowerCase().includes(term) ||
          course.code.toLowerCase().includes(term) ||
          course.instructor.toLowerCase().includes(term) ||
          (course.department && course.department.toLowerCase().includes(term)) ||
          (course.category && course.category.toLowerCase().includes(term));

        // Department filter
        const matchDepartment =
          selectedDepartment === 'All' || course.department === selectedDepartment;

        // Instructor filter
        const matchInstructor =
          selectedInstructor === 'All' || course.instructor === selectedInstructor;

        // Level filter
        const matchLevel = selectedLevel === 'All' || course.level === selectedLevel;

        // Availability filter
        const matchAvailability =
          selectedAvailability === 'all' ||
          (selectedAvailability === 'open' && !course.isFull && course.seatsAvailable > 0) ||
          (selectedAvailability === 'full' && (course.isFull || course.seatsAvailable === 0));

        return matchSearch && matchDepartment && matchInstructor && matchLevel && matchAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.overallRating - a.overallRating;
        }
        if (sortBy === 'deadline') {
          return (a.deadlineDaysRemaining || 99) - (b.deadlineDaysRemaining || 99);
        }
        if (sortBy === 'seats') {
          return b.seatsAvailable - a.seatsAvailable;
        }
        return a.code.localeCompare(b.code);
      });
  }, [courses, searchTerm, selectedDepartment, selectedInstructor, selectedLevel, selectedAvailability, sortBy]);

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedDepartment !== 'All' ||
    selectedInstructor !== 'All' ||
    selectedLevel !== 'All' ||
    selectedAvailability !== 'all';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All');
    setSelectedInstructor('All');
    setSelectedLevel('All');
    setSelectedAvailability('all');
  };

  return (
    <div id="courses-view" className="space-y-8 animate-fadeIn pb-24 max-w-7xl mx-auto">
      {/* Header & Page Title */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#181445]/[0.06] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efebff] text-[#3525cd] font-jetbrains text-xs font-semibold uppercase tracking-wider mb-2 border border-[#3525cd]/15">
            <span className="material-symbols-outlined text-[15px]">auto_stories</span>
            <span>Course Catalog &amp; Evaluations</span>
          </div>
          <h1 className="font-epilogue text-3xl sm:text-4xl font-bold text-[#181445] tracking-tight">
            Academic Courses
          </h1>
          <p className="font-manrope text-base text-[#464555] mt-1 max-w-2xl">
            Search courses by name or code, filter by department, instructor, course level, and current seat availability.
          </p>
        </div>

        {/* Global Catalog Metrics */}
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#181445]/[0.08] shadow-xs">
          <div className="text-center pr-4 border-r border-[#181445]/[0.08]">
            <span className="font-jetbrains text-xs text-[#777587] block uppercase">Total Courses</span>
            <span className="font-epilogue font-bold text-xl text-[#181445]">{courses.length}</span>
          </div>
          <div className="text-center pr-4 border-r border-[#181445]/[0.08]">
            <span className="font-jetbrains text-xs text-[#777587] block uppercase">Open Seats</span>
            <span className="font-epilogue font-bold text-xl text-[#166534]">
              {courses.filter((c) => !c.isFull && c.seatsAvailable > 0).length}
            </span>
          </div>
          <div className="text-center">
            <span className="font-jetbrains text-xs text-[#777587] block uppercase">Evaluations</span>
            <span className="font-epilogue font-bold text-xl text-[#3525cd]">Active</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Control Station */}
      <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-[#181445]/[0.08] shadow-sm space-y-6">
        {/* Row 1: Search Bar + Sort */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Main Search Input */}
          <div className="lg:col-span-8 relative">
            <input
              id="course-search-input"
              type="text"
              placeholder="Search by course name, code (e.g. CS410), instructor, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#181445]/[0.12] rounded-xl text-sm sm:text-base font-manrope text-[#181445] placeholder:text-[#777587] focus:outline-none focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15 shadow-xs transition-all"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[#674bb5] text-[22px]">
              search
            </span>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 p-1 text-[#777587] hover:text-[#181445] rounded-full hover:bg-[#efebff] transition-colors"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <label htmlFor="course-sort-select" className="shrink-0 font-jetbrains text-xs text-[#464555] font-semibold">
              Sort By:
            </label>
            <select
              id="course-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-3.5 px-3 bg-white border border-[#181445]/[0.12] rounded-xl text-xs sm:text-sm font-manrope text-[#181445] focus:outline-none focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15 cursor-pointer"
            >
              <option value="code">Course Code (A-Z)</option>
              <option value="rating">Highest Student Rating</option>
              <option value="deadline">Evaluation Deadline (Soonest)</option>
              <option value="seats">Most Open Seats</option>
            </select>
          </div>
        </div>

        {/* Row 2: Comprehensive Multi-Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-[#181445]/[0.06]">
          {/* Department Filter */}
          <div>
            <label
              htmlFor="filter-department"
              className="block font-jetbrains text-xs text-[#464555] font-semibold uppercase tracking-wider mb-1.5"
            >
              Department
            </label>
            <div className="relative">
              <select
                id="filter-department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full appearance-none py-2.5 pl-3.5 pr-8 bg-white border border-[#181445]/[0.12] rounded-xl text-xs sm:text-sm font-manrope text-[#181445] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#777587] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Instructor Filter */}
          <div>
            <label
              htmlFor="filter-instructor"
              className="block font-jetbrains text-xs text-[#464555] font-semibold uppercase tracking-wider mb-1.5"
            >
              Instructor
            </label>
            <div className="relative">
              <select
                id="filter-instructor"
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full appearance-none py-2.5 pl-3.5 pr-8 bg-white border border-[#181445]/[0.12] rounded-xl text-xs sm:text-sm font-manrope text-[#181445] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] cursor-pointer"
              >
                {instructors.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst === 'All' ? 'All Instructors' : inst}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#777587] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Course Level Filter */}
          <div>
            <label
              htmlFor="filter-level"
              className="block font-jetbrains text-xs text-[#464555] font-semibold uppercase tracking-wider mb-1.5"
            >
              Course Level
            </label>
            <div className="relative">
              <select
                id="filter-level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full appearance-none py-2.5 pl-3.5 pr-8 bg-white border border-[#181445]/[0.12] rounded-xl text-xs sm:text-sm font-manrope text-[#181445] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] cursor-pointer"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === 'All' ? 'All Course Levels' : lvl}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#777587] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Current Availability Filter */}
          <div>
            <label
              htmlFor="filter-availability"
              className="block font-jetbrains text-xs text-[#464555] font-semibold uppercase tracking-wider mb-1.5"
            >
              Seat Availability
            </label>
            <div className="relative">
              <select
                id="filter-availability"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value as AvailabilityStatus)}
                className="w-full appearance-none py-2.5 pl-3.5 pr-8 bg-white border border-[#181445]/[0.12] rounded-xl text-xs sm:text-sm font-manrope text-[#181445] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] cursor-pointer"
              >
                <option value="all">All Availability Statuses</option>
                <option value="open">🟢 Open Seats Only</option>
                <option value="full">🔴 Full / Waitlist</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#777587] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Active Filters & Results Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#181445]/[0.06]">
          <div className="flex flex-wrap items-center gap-2 text-xs font-jetbrains">
            <span className="text-[#777587]">
              Showing <strong className="text-[#181445]">{filteredCourses.length}</strong> of {courses.length} courses
            </span>

            {/* Render Active Filter Badges */}
            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1 bg-[#efebff] text-[#3525cd] px-2.5 py-1 rounded-full font-medium border border-[#3525cd]/20">
                <span>Search: &quot;{searchTerm}&quot;</span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:text-[#181445] cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedDepartment !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-[#efebff] text-[#3525cd] px-2.5 py-1 rounded-full font-medium border border-[#3525cd]/20">
                <span>Dept: {selectedDepartment}</span>
                <button
                  onClick={() => setSelectedDepartment('All')}
                  className="hover:text-[#181445] cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedInstructor !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-[#efebff] text-[#3525cd] px-2.5 py-1 rounded-full font-medium border border-[#3525cd]/20">
                <span>Instructor: {selectedInstructor}</span>
                <button
                  onClick={() => setSelectedInstructor('All')}
                  className="hover:text-[#181445] cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedLevel !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-[#efebff] text-[#3525cd] px-2.5 py-1 rounded-full font-medium border border-[#3525cd]/20">
                <span>Level: {selectedLevel}</span>
                <button
                  onClick={() => setSelectedLevel('All')}
                  className="hover:text-[#181445] cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedAvailability !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#efebff] text-[#3525cd] px-2.5 py-1 rounded-full font-medium border border-[#3525cd]/20">
                <span>{selectedAvailability === 'open' ? '🟢 Open Seats' : '🔴 Full / Waitlist'}</span>
                <button
                  onClick={() => setSelectedAvailability('all')}
                  className="hover:text-[#181445] cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              id="btn-reset-filters"
              onClick={resetAllFilters}
              className="text-xs font-jetbrains text-[#ba1a1a] hover:text-[#7f1d1d] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      </section>

      {/* Course Grid / Results View */}
      {filteredCourses.length === 0 ? (
        <div
          id="courses-empty-state"
          className="glass-panel p-12 text-center rounded-2xl border border-dashed border-[#181445]/20 space-y-4 my-8"
        >
          <div className="w-16 h-16 rounded-full bg-[#efebff] flex items-center justify-center mx-auto text-[#3525cd]">
            <span className="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <h3 className="font-epilogue font-bold text-2xl text-[#181445]">No Matching Courses Found</h3>
          <p className="font-manrope text-sm text-[#464555] max-w-md mx-auto">
            We couldn&apos;t find any courses matching your current search query and filter criteria. Try adjusting or clearing your filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 bg-[#3525cd] text-white rounded-xl font-jetbrains text-xs font-semibold hover:bg-[#4f46e5] transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Reset All Search &amp; Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isSubmitted = course.draftProgress === 100;
            const hasDraft = course.hasDraft;
            const isOpen = !course.isFull && course.seatsAvailable > 0;

            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className="glass-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-[#181445]/[0.08] hover:border-[#3525cd]/35 hover-lift group transition-all duration-300 relative overflow-hidden"
              >
                {/* Top badges bar */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-jetbrains text-xs text-[#3525cd] font-bold bg-[#e2dfff] px-3 py-1 rounded-md">
                        {course.code}
                      </span>
                      <span className="font-jetbrains text-[11px] text-[#674bb5] font-semibold bg-[#efebff] px-2.5 py-1 rounded-md border border-[#674bb5]/20">
                        {course.level}
                      </span>
                    </div>

                    <span className="font-jetbrains text-[11px] text-[#777587]">
                      {course.semester}
                    </span>
                  </div>

                  {/* Course Title & Department */}
                  <div className="mb-2">
                    <span className="font-jetbrains text-[11px] text-[#777587] block uppercase tracking-wider mb-0.5">
                      {course.department}
                    </span>
                    <h3 className="font-epilogue font-bold text-xl text-[#181445] group-hover:text-[#3525cd] transition-colors leading-snug">
                      {course.name}
                    </h3>
                  </div>

                  {/* Instructor & Details */}
                  <div className="flex items-center gap-2 text-[#464555] font-manrope text-sm mt-1">
                    <span className="material-symbols-outlined text-[18px] text-[#777587]">person</span>
                    <span className="font-medium text-[#181445]">{course.instructor}</span>
                  </div>

                  {course.schedule && (
                    <div className="flex items-center gap-2 text-[#777587] font-manrope text-xs mt-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{course.schedule}</span>
                      {course.credits && <span className="ml-auto font-jetbrains text-[11px]">({course.credits} Credits)</span>}
                    </div>
                  )}

                  {/* Seat Availability Badge */}
                  <div className="mt-4 pt-3.5 border-t border-[#181445]/[0.06] flex items-center justify-between">
                    <span className="font-jetbrains text-xs text-[#777587]">Availability</span>
                    {isOpen ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-jetbrains font-semibold bg-[#dcfce7] text-[#166534] border border-[#166534]/20">
                        <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
                        <span>{course.seatsAvailable} / {course.totalSeats} Seats Open</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-jetbrains font-semibold bg-[#fee2e2] text-[#991b1b] border border-[#991b1b]/20">
                        <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
                        <span>Full ({course.waitlistCount || 0} on Waitlist)</span>
                      </span>
                    )}
                  </div>

                  {/* Evaluation Status & Progress */}
                  <div className="mt-3.5 pt-3 border-t border-[#181445]/[0.06] space-y-2">
                    <div className="flex justify-between text-xs font-jetbrains text-[#464555]">
                      <span>Evaluation Status</span>
                      <span
                        className={
                          isSubmitted
                            ? 'text-[#166534] font-bold'
                            : hasDraft
                            ? 'text-[#3525cd] font-bold'
                            : 'text-[#777587]'
                        }
                      >
                        {isSubmitted ? 'Completed' : hasDraft ? `Draft (${course.draftProgress}%)` : 'Pending'}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-[#efebff] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSubmitted ? 'bg-[#166534]' : hasDraft ? 'bg-[#3525cd]' : 'bg-[#c7c4d8]'
                        }`}
                        style={{ width: `${course.draftProgress || (isSubmitted ? 100 : 0)}%` }}
                      ></div>
                    </div>

                    {!isSubmitted && course.deadlineDaysRemaining && (
                      <div className="flex items-center justify-between text-[11px] font-jetbrains pt-0.5">
                        <span className="text-[#ba1a1a] flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          <span>Due in {course.deadlineDaysRemaining} days</span>
                        </span>
                        <span className="text-[#777587]">{course.totalSubmissions} submissions</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-[#181445]/[0.06] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setCurrentView('insights');
                    }}
                    className="font-jetbrains text-xs text-[#674bb5] hover:text-[#3525cd] hover:underline flex items-center gap-1 transition-colors cursor-pointer py-1"
                  >
                    <span className="material-symbols-outlined text-[17px]">monitoring</span>
                    <span>Insights &amp; Pulse</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startFeedback(course.id, 1)}
                    className={`px-4 py-2 rounded-xl font-jetbrains text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                      isSubmitted
                        ? 'bg-[#efebff] text-[#3525cd] hover:bg-[#3525cd] hover:text-white'
                        : 'bg-[#3525cd] text-white hover:bg-[#4f46e5] hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isSubmitted ? 'Revisit Feedback' : hasDraft ? 'Resume Draft' : 'Give Feedback'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
