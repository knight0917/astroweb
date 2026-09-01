"use client";

import React, { useState } from "react";

export default function ReviewSection({ onClose }: { onClose?: () => void }) {
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
      } else {
        setErrorMessage(data.error || "Failed to submit review.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Centered Feedback Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/95 border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                Client Feedback & Review
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-[10px] text-slate-400 font-mono">1 per day</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
              <span>🌟</span>
              <span>Submit Your Feedback</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Share your astrological consultation experience, accuracy feedback, or suggestions. Submissions are saved directly to our secure database.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer flex-shrink-0"
              title="Close Section"
            >
              ✕
            </button>
          )}
        </div>

        {/* Notification Banners */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-3 animate-in slide-in-from-top-2 shadow-lg shadow-emerald-950/30">
            <span className="text-lg">✅</span>
            <span className="font-semibold leading-relaxed">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-3 animate-in slide-in-from-top-2 shadow-lg shadow-rose-950/30">
            <span className="text-lg">⚠️</span>
            <span className="font-semibold leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name & Email in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Name *</span>
                <span className="text-[10px] text-slate-500 font-normal">Your Name</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-medium focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Email *</span>
                <span className="text-[10px] text-slate-500 font-normal">Confidential</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-medium focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Feedback Subject (Max 20 characters) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 flex items-center justify-between">
              <span>Feedback Subject *</span>
              <span
                className={`text-[10px] font-mono ${
                  subject.length >= 20 ? "text-rose-400 font-bold" : "text-amber-400/90 font-medium"
                }`}
              >
                {subject.length}/20 chars max
              </span>
            </label>
            <input
              type="text"
              required
              maxLength={20}
              placeholder="Enter subject..."
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
              placeholder="Write your feedback, consultation review, or suggestions for the platform..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-medium focus:border-amber-500 focus:outline-none transition-colors resize-y leading-relaxed"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
