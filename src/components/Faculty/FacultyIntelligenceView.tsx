import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  INITIAL_VALUES,
  INITIAL_OPPORTUNITIES,
  PULSE_TREND_DATA,
} from '../../data/mockData';

export const FacultyIntelligenceView: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    selectedSemester,
    setSelectedSemester,
    comments,
    toggleBookmark,
    commentFilter,
    setCommentFilter,
    showToast,
  } = useApp();

  const [visibleCommentCount, setVisibleCommentCount] = useState<number>(3);
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    week: string;
    score: number;
    label: string;
    x: number;
    y: number;
  } | null>(null);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const values = INITIAL_VALUES[selectedCourseId] || INITIAL_VALUES['cs401'];
  const opportunities = INITIAL_OPPORTUNITIES[selectedCourseId] || INITIAL_OPPORTUNITIES['cs401'];
  const trendPoints = PULSE_TREND_DATA[selectedCourseId] || PULSE_TREND_DATA['cs401'];

  // Filter comments for this course & category
  const courseComments = useMemo(() => {
    return comments.filter((c) => {
      const matchCourse = c.courseId === selectedCourseId || selectedCourseId === 'all';
      const matchCategory = commentFilter === 'All' || c.category === commentFilter;
      return matchCourse && matchCategory;
    });
  }, [comments, selectedCourseId, commentFilter]);

  const displayedComments = courseComments.slice(0, visibleCommentCount);

  // SVG Chart path calculation
  const svgCoordinates = useMemo(() => {
    // Map score (3.0 to 5.0) to SVG Y (90 to 10)
    // Map index (0 to 10) to SVG X (0 to 400)
    const points = trendPoints.map((pt, i) => {
      const x = (i / (trendPoints.length - 1)) * 400;
      // 3.0 -> 90, 5.0 -> 10
      const normalizedScore = Math.max(3.0, Math.min(5.0, pt.score));
      const y = 90 - ((normalizedScore - 3.0) / 2.0) * 80;
      return { x, y, pt };
    });

    const linePath = points.reduce((acc, p, i) => {
      return i === 0 ? `M${p.x},${p.y}` : `${acc} L${p.x},${p.y}`;
    }, '');

    const areaPath = `${linePath} L400,100 L0,100 Z`;

    return { points, linePath, areaPath };
  }, [trendPoints]);

  return (
    <div id="faculty-intelligence-center" className="space-y-12 md:space-y-16 animate-fadeIn pb-24 max-w-7xl mx-auto">
      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-epilogue text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181445] mb-2 tracking-tight">
            Faculty Intelligence Center
          </h1>
          <p className="font-manrope text-base sm:text-lg text-[#464555]">
            Insights and actionable feedback for your active courses.
          </p>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <select
              id="select-course-filter"
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setVisibleCommentCount(3);
              }}
              className="bg-[#fcf8ff] border-b-2 border-[#c7c4d8] text-[#181445] font-manrope font-semibold text-sm py-2 px-4 focus:border-[#3525cd] focus:ring-0 focus:outline-none appearance-none cursor-pointer pr-9 bg-no-repeat bg-[right_0.5rem_center] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23181445%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              id="select-semester-filter"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-[#fcf8ff] border-b-2 border-[#c7c4d8] text-[#181445] font-manrope font-semibold text-sm py-2 px-4 focus:border-[#3525cd] focus:ring-0 focus:outline-none appearance-none cursor-pointer pr-9 bg-no-repeat bg-[right_0.5rem_center] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23181445%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
            >
              <option>Spring 2024</option>
              <option>Fall 2023</option>
              <option>Spring 2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bento Grid: Key Metrics & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Metric */}
        <div className="glass-panel p-8 md:p-10 rounded-2xl flex flex-col justify-center items-center text-center lg:col-span-1 shadow-[0px_10px_30px_rgba(30,27,75,0.02)] border border-[#181445]/[0.08] hover-lift">
          <span className="font-jetbrains text-xs text-[#674bb5] uppercase tracking-widest mb-4 font-bold">
            Overall Rating
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-epilogue text-6xl md:text-7xl font-bold text-[#3525cd] tracking-tight">
              {currentCourse.overallRating.toFixed(1)}
            </span>
            <span className="font-epilogue text-2xl font-medium text-[#464555]">/ 5</span>
          </div>
          <p className="font-manrope text-sm md:text-base text-[#464555] max-w-xs mt-1">
            Students rated your teaching experience highly.
          </p>
          <div className="mt-6 inline-flex items-center gap-1.5 bg-[#dcfce7] text-[#166534] px-3.5 py-1 rounded-full font-jetbrains text-xs font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+{currentCourse.ratingDelta > 0 ? currentCourse.ratingDelta : '0.2'} from last semester</span>
          </div>
        </div>

        {/* Learning Pulse Chart */}
        <div className="glass-panel p-8 rounded-2xl lg:col-span-2 shadow-[0px_10px_30px_rgba(30,27,75,0.02)] flex flex-col border border-[#181445]/[0.08] relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-epilogue text-2xl font-bold text-[#181445]">Learning Pulse</h2>
              <p className="font-manrope text-xs text-[#777587] mt-0.5">Interactive weekly sentiment breakdown</p>
            </div>
            <span className="font-jetbrains text-xs text-[#464555] bg-[#efebff] px-3 py-1 rounded-full font-medium">
              Weekly Sentiment Trend
            </span>
          </div>

          {/* SVG Interactive Chart */}
          <div className="flex-1 w-full relative min-h-[220px]">
            <svg
              className="w-full h-full absolute inset-0 overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 400 100"
            >
              <defs>
                <linearGradient id="gradient-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3525cd" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background horizontal grid lines */}
              <line stroke="#181445" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="3 3" x1="0" x2="400" y1="25" y2="25" />
              <line stroke="#181445" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="3 3" x1="0" x2="400" y1="50" y2="50" />
              <line stroke="#181445" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="3 3" x1="0" x2="400" y1="75" y2="75" />

              {/* Area Gradient */}
              <path fill="url(#gradient-fill)" d={svgCoordinates.areaPath} />

              {/* Thin Line Chart */}
              <path
                d={svgCoordinates.linePath}
                fill="none"
                stroke="#3525cd"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {svgCoordinates.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#3525cd"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() =>
                    setHoveredChartPoint({
                      week: p.pt.week,
                      score: p.pt.score,
                      label: p.pt.label,
                      x: p.x,
                      y: p.y,
                    })
                  }
                  onMouseLeave={() => setHoveredChartPoint(null)}
                />
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredChartPoint && (
              <div
                className="absolute z-20 pointer-events-none bg-[#181445] text-white p-2.5 rounded-xl shadow-xl border border-white/10 text-xs transform -translate-x-1/2 -translate-y-full -mt-2 animate-fadeIn"
                style={{
                  left: `${(hoveredChartPoint.x / 400) * 100}%`,
                  top: `${(hoveredChartPoint.y / 100) * 100}%`,
                }}
              >
                <p className="font-jetbrains font-bold text-[#dad7ff]">
                  {hoveredChartPoint.week}: {hoveredChartPoint.score} / 5.0
                </p>
                <p className="font-manrope text-[11px] text-[#dad6ff]/80 mt-0.5 whitespace-nowrap">
                  {hoveredChartPoint.label}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4 text-[#777587] font-jetbrains text-xs px-2 pt-2 border-t border-[#181445]/[0.04]">
            <span>W1</span>
            <span>W3</span>
            <span>W5</span>
            <span>W7</span>
            <span>W9</span>
            <span>W11</span>
          </div>
        </div>
      </div>

      {/* Qualitative Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Students Value */}
        <div className="glass-panel p-8 rounded-2xl border border-[#181445]/[0.08]">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="material-symbols-outlined text-[#674bb5] text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <h3 className="font-epilogue text-2xl font-bold text-[#181445]">What Students Value</h3>
          </div>
          <ul className="space-y-4 font-manrope text-sm md:text-base text-[#464555]">
            {values.map((v) => (
              <li key={v.id} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#3525cd] mt-0.5 text-[20px] shrink-0 font-bold">
                  check
                </span>
                <span>
                  <strong className="text-[#181445] font-semibold">{v.title}:</strong> {v.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Opportunities */}
        <div className="glass-panel p-8 rounded-2xl border border-[#181445]/[0.08]">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="material-symbols-outlined text-[#8b5130] text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <h3 className="font-epilogue text-2xl font-bold text-[#181445]">Improvement Opportunities</h3>
          </div>
          <ul className="space-y-4 font-manrope text-sm md:text-base text-[#464555]">
            {opportunities.map((o) => (
              <li key={o.id} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8b5130] mt-0.5 text-[20px] shrink-0">
                  arrow_right
                </span>
                <span>
                  <strong className="text-[#181445] font-semibold">{o.title}:</strong> {o.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feedback Explorer */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b border-[#181445]/[0.08] pb-4 gap-4">
          <div>
            <h2 className="font-epilogue text-2xl font-bold text-[#181445]">Feedback Explorer</h2>
            <p className="font-manrope text-sm text-[#464555]">Individual, anonymized student comments.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['All', 'Lectures', 'Assignments', 'Labs'] as const).map((filter) => (
              <button
                key={filter}
                id={`btn-filter-${filter.toLowerCase()}`}
                onClick={() => {
                  setCommentFilter(filter);
                  setVisibleCommentCount(3);
                }}
                className={`font-jetbrains text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  commentFilter === filter
                    ? 'bg-[#efebff] text-[#181445] font-bold border border-[#3525cd]/20 shadow-xs'
                    : 'text-[#464555] hover:bg-[#efebff]/60 hover:text-[#181445]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Cards */}
        <div className="space-y-4">
          {displayedComments.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-[#777587] font-manrope text-sm">
              No feedback comments matching this filter for the selected course.
            </div>
          ) : (
            displayedComments.map((comment) => (
              <div
                key={comment.id}
                className="glass-panel p-6 md:p-7 rounded-2xl hover:shadow-[0px_10px_30px_rgba(30,27,75,0.05)] hover:scale-[1.008] transition-all duration-300 border border-[#181445]/[0.08]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded font-jetbrains text-xs font-medium ${
                        comment.category === 'Lectures'
                          ? 'bg-[#e0e7ff] text-[#3730a3]'
                          : comment.category === 'Assignments'
                          ? 'bg-[#ffedd5] text-[#9a3412]'
                          : 'bg-[#dcfce7] text-[#166534]'
                      }`}
                    >
                      {comment.category}
                    </span>
                    <span className="bg-[#f3f4f6] text-[#4b5563] px-2.5 py-0.5 rounded font-jetbrains text-xs font-medium">
                      {comment.tag}
                    </span>
                  </div>
                  <span className="font-jetbrains text-xs text-[#777587]">{comment.date}</span>
                </div>

                <p className="font-manrope text-base text-[#181445] mb-4 leading-relaxed">
                  "{comment.content}"
                </p>

                <div className="flex gap-3">
                  <button
                    id={`btn-save-comment-${comment.id}`}
                    onClick={() => toggleBookmark(comment.id)}
                    className={`font-jetbrains text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                      comment.isSaved
                        ? 'text-[#3525cd] font-bold'
                        : 'text-[#674bb5] hover:text-[#3525cd]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[17px]"
                      style={{ fontVariationSettings: comment.isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {comment.isSaved ? 'bookmark' : 'bookmark_add'}
                    </span>
                    <span>{comment.isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Load More Feedback button */}
          {courseComments.length > visibleCommentCount && (
            <button
              id="btn-load-more-feedback"
              onClick={() => {
                setVisibleCommentCount((prev) => prev + 3);
                showToast('Loaded More Feedback', 'Appended additional student reviews to list.', 'info');
              }}
              className="w-full py-4 text-center font-jetbrains text-xs font-semibold text-[#3525cd] hover:bg-[#efebff] rounded-xl transition-colors cursor-pointer border border-[#3525cd]/15 mt-2"
            >
              Load More Feedback ({courseComments.length - visibleCommentCount} remaining)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
