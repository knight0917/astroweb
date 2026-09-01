"use client";

import React, { useState, useEffect } from "react";
import { StoredReview } from "@/lib/db";

export default function ReviewSection({ onClose }: { onClose?: () => void }) {
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Load reviews on mount
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("Please provide your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (!subject.trim()) {
      setErrorMessage("Please provide a feedback subject.");
      return;
    }
    if (subject.trim().length > 20) {
      setErrorMessage("Subject must be 20 characters or less.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Please write your feedback description.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim().slice(0, 20),
          description: description.trim(),
          rating,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("🙏 Thank you! Your feedback has been recorded successfully in the database.");
        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setDescription("");
        setRating(5);
        // Prepend new review
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        }
      } else {
        setErrorMessage(data.error || "Failed to submit review.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Compute average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                Community Feedback & Reviews
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Postgres & Local Sync</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <span>🌟</span>
              <span>Client Reviews & Feedback</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Share your experience with Vedic Sky AI, accuracy of chart calculations, consultation depth, and suggestions for future enhancements.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-inner">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400 font-mono">{avgRating}</div>
              <div className="text-[10px] text-slate-400 font-medium">Avg Rating</div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-slate-100 font-mono">{reviews.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">Total Reviews</div>
            </div>
            {onClose && (
              <>
                <div className="w-px h-8 bg-slate-800"></div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                  title="Close Section"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Form (Left) & Reviews Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Feedback Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>✍️</span>
              <span>Leave Your Feedback</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              All submissions are recorded permanently in the database.
            </p>
          </div>

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
              <span className="text-base">✅</span>
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
              <span className="text-base">⚠️</span>
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Your Name *</span>
                <span className="text-[10px] text-slate-500 font-normal">Full Name</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Ramesh Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-medium focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Your Email *</span>
                <span className="text-[10px] text-slate-500 font-normal">Strictly Confidential</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. ramesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-medium focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Feedback Subject (Max 20 characters) */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Feedback Subject * (Max 20)</span>
                <span
                  className={`text-[10px] font-mono ${
                    subject.length >= 20 ? "text-rose-400 font-bold" : "text-amber-400/90"
                  }`}
                >
                  {subject.length}/20 chars
                </span>
              </label>
              <input
                type="text"
                required
                maxLength={20}
                placeholder="e.g. Accurate Dasha"
                value={subject}
                onChange={(e) => setSubject(e.target.value.slice(0, 20))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-medium focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Star Rating */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Rating</span>
                <span className="text-[10px] text-amber-400 font-bold">
                  {rating === 5
                    ? "⭐⭐⭐⭐⭐ (5/5 Supreme)"
                    : rating === 4
                    ? "⭐⭐⭐⭐ (4/5 Very Good)"
                    : rating === 3
                    ? "⭐⭐⭐ (3/5 Good)"
                    : rating === 2
                    ? "⭐⭐ (2/5 Average)"
                    : "⭐ (1/5 Needs Improvement)"}
                </span>
              </label>
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    {(hoverRating || rating) >= star ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Description */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Feedback Description *</span>
                <span className="text-[10px] text-slate-500 font-normal">Detailed Review</span>
              </label>
              <textarea
                required
                rows={4}
                maxLength={3000}
                placeholder="Share your detailed feedback, experience with predictions, remedies, or suggestions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-medium focus:border-amber-500 focus:outline-none transition-colors resize-y leading-relaxed"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving to DB...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Submit Review & Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Reviews Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <span>💬</span>
              <span>Recent Client Feedback ({reviews.length})</span>
            </h3>
            <button
              onClick={fetchReviews}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold transition-colors cursor-pointer"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="w-32 h-3.5 bg-slate-800 rounded"></div>
                      <div className="w-20 h-2.5 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full h-12 bg-slate-800/60 rounded"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <div className="text-3xl">📭</div>
              <h4 className="font-bold text-slate-300 text-sm">No reviews submitted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first to leave your feedback using the form on the left!
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
              {reviews.map((rev) => {
                const dateStr = new Date(rev.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={rev.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center text-sm font-black text-amber-300 uppercase shadow-inner">
                          {rev.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-100">
                              {rev.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold truncate max-w-[140px]">
                              {rev.subject}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>{dateStr}</span>
                            <span>•</span>
                            <span className="text-amber-300">
                              {"★".repeat(rev.rating || 5)}
                              {"☆".repeat(5 - (rev.rating || 5))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pl-1">
                      {rev.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
