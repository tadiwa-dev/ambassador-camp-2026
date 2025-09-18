import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Users,
  Heart,
  Zap,
  Award,
  Send,
} from "lucide-react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxGGPvmk_7rcZH-tIi2ob0FVKgj2mCdk6e48TE-4jlEtWeMAfJSq3QrwORWhALKSxI/exec";

export default function AmbassadorSurvey() {
  const initial = {
    age: "",
    gender: "",
    federation: "",
    hobbies: "",
    interests: "",
    sportingActivity: "",
    spiritual: [],
    mission: [],
    skills: [],
    fun: [],
    speakers: "",
    programItems: "",
    lifeSkills: [],
    hope: "",
    otherIssues: "",
    prizeDrawEntry: false,
  };

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try {
      const stored = window.localStorage?.getItem("ambassador_answers");
      if (stored) {
        const parsedStored = JSON.parse(stored);
        // Merge stored data with initial to ensure all fields exist
        return { ...initial, ...parsedStored };
      }
      return initial;
    } catch (e) {
      return initial;
    }
  });
  const [badge, setBadge] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    "intro",
    "identity",
    "hobbies",
    "spiritual",
    "mission",
    "skills",
    "fun",
    "speakers",
    "lifeSkills",
    "hope",
    "finish",
  ];

  function update(field, value) {
    setAnswers((s) => {
      const next = { ...s, [field]: value };
      try {
        window.localStorage?.setItem(
          "ambassador_answers",
          JSON.stringify(next)
        );
      } catch (e) {
        // Handle localStorage errors gracefully
      }
      return next;
    });
  }

  function toggleArray(field, value) {
    setAnswers((s) => {
      const arr = new Set(s[field] || []);
      if (arr.has(value)) arr.delete(value);
      else arr.add(value);
      const next = { ...s, [field]: Array.from(arr) };
      try {
        window.localStorage?.setItem(
          "ambassador_answers",
          JSON.stringify(next)
        );
      } catch (e) {
        // Handle localStorage errors gracefully
      }
      return next;
    });
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function computeBadge(ans) {
    const counts = {
      Worshipper:
        (ans.fun || []).includes("singing") || (ans.skills || []).includes("music") ? 1 : 0,
      Trailblazer:
        (ans.mission || []).length >= 2 || (ans.skills || []).includes("leadership") ? 1 : 0,
      Witness:
        (ans.spiritual || []).includes("share") || (ans.skills || []).includes("speaking")
          ? 1
          : 0,
      Builder:
        (ans.skills || []).includes("media") || (ans.mission || []).includes("cleanup") ? 1 : 0,
    };
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return winner;
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    const generatedBadge = computeBadge(answers);
    setBadge(generatedBadge);

    const payload = {
      age: answers.age,
      gender: answers.gender,
      federation: answers.federation,
      hobbies: answers.hobbies,
      interests: answers.interests,
      sportingActivity: answers.sportingActivity,
      spiritual: answers.spiritual,
      mission: answers.mission,
      skills: answers.skills,
      fun: answers.fun,
      speakers: answers.speakers,
      programItems: answers.programItems,
      lifeSkills: answers.lifeSkills,
      hope: answers.hope,
      otherIssues: answers.otherIssues,
      prizeDrawEntry: answers.prizeDrawEntry,
      badge: generatedBadge,
      _secret: "NOZIPHO",
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      try {
        window.localStorage?.removeItem("ambassador_answers");
      } catch (e) {
        // Handle localStorage errors gracefully
      }

      setTimeout(() => {
        setStep(steps.length - 1);
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      console.error("🚨 Error submitting:", err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  const progressPercent = (step / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-3 py-4 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl">
        {/* Progress Bar */}
        {step > 0 && step < steps.length - 1 && (
          <div className="mb-4 sm:mb-8">
            <div className="flex justify-between text-white/70 text-xs sm:text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative">
            {/* Header Gradient - Mobile optimized */}
            <div className="min-h-[6rem] sm:h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="relative z-10 p-3 sm:p-8 text-white flex flex-col justify-center min-h-[6rem] sm:min-h-[8rem]">
                <h1 className="text-lg sm:text-3xl font-black tracking-tight leading-tight">
                  Ambassador Camp 2026
                </h1>
                <p className="text-white/90 mt-1 sm:mt-2 font-medium text-xs sm:text-base leading-tight">
                  Your Mission Journey ✨<br className="sm:hidden" />
                  <span className="sm:ml-1">Shape a Spirit-filled experience</span>
                </p>
              </div>
            </div>

            {/* Content - Better mobile padding */}
            <div className="p-4 sm:p-6 lg:p-8">
              {step === 0 && (
                <div className="text-center space-y-6 sm:space-y-8 animate-fade-in">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white">
                    <img
                      src="https://sidadventist.org/wp-content/uploads/2021/06/Ambassador_logo.png"
                      alt="Ambassador Camp Logo"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full items-center justify-center shadow-lg hidden">
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                      Welcome, Ambassador! 🌍
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 mx-auto leading-relaxed px-2">
                      Imagine preparing for a divine mission. Your choices will
                      shape an unforgettable camp experience that glorifies God
                      and transforms lives.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4 pt-4">
                    <button
                      className="group w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                      onClick={next}
                    >
                      <span>Start Mission</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300"
                      onClick={() =>
                        alert("Share this link with your youth groups!")
                      }
                    >
                      Share Survey
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Your Identity
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                      Tell us a bit about yourself
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Age
                      </label>
                      <select
                        value={answers.age}
                        onChange={(e) => update("age", e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors font-medium text-base"
                      >
                        <option value="">Select your age</option>
                        {[16, 17, 18, 19, 20, 21].map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Gender
                      </label>
                      <select
                        value={answers.gender}
                        onChange={(e) => update("gender", e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors font-medium text-base"
                      >
                        <option value="">Select your gender</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Federation
                      </label>
                      <select
                        value={answers.federation}
                        onChange={(e) => update("federation", e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors font-medium text-base"
                      >
                        <option value="">Select your federation</option>
                        <option>CENTRINORTH</option>
                        <option>CHIREMBA</option>
                        <option>CHISE</option>
                        <option>CHITWEST</option>
                        <option>CHIVHUWEST</option>
                        <option>GLENSEC</option>
                        <option>GLENCITY</option>
                        <option>WHAPP</option>
                        <option>MAROCHEK</option>
                        <option>EMA</option>
                        <option>MULTICULTURAL</option>
                        <option>ZIMDAG</option>
                        <option>RUCHI</option>
                        <option>SOUTHERN HARARE</option>
                        <option>STONEVIEW</option>
                        <option>NYAHUNI</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 sm:pt-8">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">🎯</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Your Interests
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      Tell us about your hobbies and activities
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Hobbies
                      </label>
                      <textarea
                        value={answers.hobbies}
                        onChange={(e) => update("hobbies", e.target.value)}
                        placeholder="What do you enjoy doing in your free time? (e.g., reading, cooking, gaming, art, etc.)"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-cyan-500 focus:ring-0 transition-colors resize-none font-medium text-base"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Interests
                      </label>
                      <textarea
                        value={answers.interests}
                        onChange={(e) => update("interests", e.target.value)}
                        placeholder="What topics or areas are you passionate about? (e.g., technology, nature, music, social justice, etc.)"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-cyan-500 focus:ring-0 transition-colors resize-none font-medium text-base"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Sporting Activity
                      </label>
                      <select
                        value={answers.sportingActivity}
                        onChange={(e) => update("sportingActivity", e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-cyan-500 focus:ring-0 transition-colors font-medium text-base"
                      >
                        <option value="">Select your preferred sport</option>
                        <option>Soccer/Football</option>
                        <option>Basketball</option>
                        <option>Volleyball</option>
                        <option>Tennis</option>
                        <option>Swimming</option>
                        <option>Running/Athletics</option>
                        <option>Cricket</option>
                        <option>Rugby</option>
                        <option>Netball</option>
                        <option>Hiking/Walking</option>
                        <option>Cycling</option>
                        <option>Other</option>
                        <option>Not interested in sports</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 sm:pt-8">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Spiritual Training
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      Which areas would help you grow spiritually?
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        k: "study",
                        t: "Deep Bible study & prophecy",
                        icon: "📖",
                      },
                      {
                        k: "prayer",
                        t: "Building a strong prayer life",
                        icon: "🙏",
                      },
                      {
                        k: "overcome",
                        t: "Overcoming temptations",
                        icon: "⚡",
                      },
                      {
                        k: "share",
                        t: "Sharing my faith with others",
                        icon: "💬",
                      },
                    ].map((item) => (
                      <label
                        key={item.k}
                        className={`group cursor-pointer p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 block ${
                          (answers.spiritual || []).includes(item.k)
                            ? "border-emerald-500 bg-emerald-50 shadow-lg transform scale-[1.02]"
                            : "border-gray-200 hover:border-emerald-300 hover:shadow-md active:scale-[0.98]"
                        }`}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="text-xl sm:text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <input
                              type="checkbox"
                              checked={(answers.spiritual || []).includes(item.k)}
                              onChange={() => toggleArray("spiritual", item.k)}
                              className="sr-only"
                            />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                              {item.t}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              (answers.spiritual || []).includes(item.k)
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-gray-300"
                            }`}
                          >
                            {(answers.spiritual || []).includes(item.k) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl">
                    <p className="italic text-indigo-800 font-medium text-sm sm:text-base">
                      "Always be prepared to give an answer..." — 1 Peter 3:15
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">🌍</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Mission Field
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      Choose outreach activities you'd join
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        k: "sick",
                        t: "Visiting the sick & elderly",
                        icon: "🏥",
                      },
                      {
                        k: "evangelism",
                        t: "Street evangelism with music & drama",
                        icon: "🎭",
                      },
                      {
                        k: "cleanup",
                        t: "Community clean-up & service",
                        icon: "🧹",
                      },
                      { k: "feed", t: "Feeding the hungry", icon: "🍞" },
                    ].map((item) => (
                      <label
                        key={item.k}
                        className={`group cursor-pointer p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 block ${
                          (answers.mission || []).includes(item.k)
                            ? "border-orange-500 bg-orange-50 shadow-lg transform scale-[1.02]"
                            : "border-gray-200 hover:border-orange-300 hover:shadow-md active:scale-[0.98]"
                        }`}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="text-xl sm:text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <input
                              type="checkbox"
                              checked={(answers.mission || []).includes(item.k)}
                              onChange={() => toggleArray("mission", item.k)}
                              className="sr-only"
                            />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                              {item.t}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              (answers.mission || []).includes(item.k)
                                ? "border-orange-500 bg-orange-500"
                                : "border-gray-300"
                            }`}
                          >
                            {(answers.mission || []).includes(item.k) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Skills for the Kingdom
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      Which skills would you like to develop?
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        k: "leadership",
                        t: "Leadership & teamwork",
                        icon: "👥",
                      },
                      {
                        k: "speaking",
                        t: "Public speaking & preaching",
                        icon: "🎤",
                      },
                      { k: "music", t: "Music & worship", icon: "🎵" },
                      { k: "media", t: "Media & communication", icon: "📱" },
                      {
                        k: "survival",
                        t: "Outdoor survival/camping",
                        icon: "🏕️",
                      },
                    ].map((item) => (
                      <label
                        key={item.k}
                        className={`group cursor-pointer p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 block ${
                          (answers.skills || []).includes(item.k)
                            ? "border-purple-500 bg-purple-50 shadow-lg transform scale-[1.02]"
                            : "border-gray-200 hover:border-purple-300 hover:shadow-md active:scale-[0.98]"
                        }`}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="text-xl sm:text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <input
                              type="checkbox"
                              checked={(answers.skills || []).includes(item.k)}
                              onChange={() => toggleArray("skills", item.k)}
                              className="sr-only"
                            />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                              {item.t}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              (answers.skills || []).includes(item.k)
                                ? "border-purple-500 bg-purple-500"
                                : "border-gray-300"
                            }`}
                          >
                            {(answers.skills || []).includes(item.k) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">🎉</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Fellowship & Fun
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      Pick the activities you'd love at camp
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        k: "sports",
                        t: "Sports (soccer, volleyball)",
                        icon: "⚽",
                      },
                      { k: "hiking", t: "Hiking / Nature walks", icon: "🥾" },
                      {
                        k: "singing",
                        t: "Bonfire & praise nights / singing",
                        icon: "🔥",
                      },
                      { k: "talent", t: "Talent show", icon: "🌟" },
                      { k: "games", t: "Games & laughter", icon: "🎮" },
                      { k: "marsh", t: "Roasting marshmallows", icon: "🍡" },
                    ].map((item) => (
                      <label
                        key={item.k}
                        className={`group cursor-pointer p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 block ${
                          (answers.fun || []).includes(item.k)
                            ? "border-yellow-500 bg-yellow-50 shadow-lg transform scale-[1.02]"
                            : "border-gray-200 hover:border-yellow-300 hover:shadow-md active:scale-[0.98]"
                        }`}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="text-xl sm:text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <input
                              type="checkbox"
                              checked={(answers.fun || []).includes(item.k)}
                              onChange={() => toggleArray("fun", item.k)}
                              className="sr-only"
                            />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                              {item.t}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              (answers.fun || []).includes(item.k)
                                ? "border-yellow-500 bg-yellow-500"
                                : "border-gray-300"
                            }`}
                          >
                            {(answers.fun || []).includes(item.k) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">🎤</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Speakers & Program
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      Help us plan the perfect camp experience
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Suggested Speakers
                      </label>
                      <textarea
                        value={answers.speakers}
                        onChange={(e) => update("speakers", e.target.value)}
                        placeholder="Any suggested speakers or mentors we should invite? (Names, topics, or 'youth testimonies'...)"
                        className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-teal-500 focus:ring-0 transition-colors resize-none font-medium text-base"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Suggested Program Items
                      </label>
                      <textarea
                        value={answers.programItems}
                        onChange={(e) => update("programItems", e.target.value)}
                        placeholder="What activities or program items would you like to see at camp? (Workshops, games, competitions, special events, etc.)"
                        className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-teal-500 focus:ring-0 transition-colors resize-none font-medium text-base"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 8 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">🛠️</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Life Skills
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      Choose 3 life skills you'd like to develop at camp
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        k: "communication",
                        t: "Communication & interpersonal skills",
                        icon: "💬",
                      },
                      {
                        k: "time-management",
                        t: "Time management & organization",
                        icon: "⏰",
                      },
                      {
                        k: "financial-literacy",
                        t: "Financial literacy & budgeting",
                        icon: "💰",
                      },
                      {
                        k: "problem-solving",
                        t: "Critical thinking & problem solving",
                        icon: "🧩",
                      },
                      {
                        k: "emotional-intelligence",
                        t: "Emotional intelligence & self-awareness",
                        icon: "🧠",
                      },
                      {
                        k: "conflict-resolution",
                        t: "Conflict resolution & mediation",
                        icon: "🤝",
                      },
                      {
                        k: "digital-literacy",
                        t: "Digital literacy & technology skills",
                        icon: "💻",
                      },
                      {
                        k: "health-wellness",
                        t: "Health & wellness management",
                        icon: "🏃",
                      },
                      {
                        k: "career-planning",
                        t: "Career planning & goal setting",
                        icon: "🎯",
                      },
                    ].map((item) => (
                      <label
                        key={item.k}
                        className={`group cursor-pointer p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 block ${
                          (answers.lifeSkills || []).includes(item.k)
                            ? "border-indigo-500 bg-indigo-50 shadow-lg transform scale-[1.02]"
                            : "border-gray-200 hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
                        } ${
                          (answers.lifeSkills || []).length >= 3 && !(answers.lifeSkills || []).includes(item.k)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="text-xl sm:text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <input
                              type="checkbox"
                              checked={(answers.lifeSkills || []).includes(item.k)}
                              onChange={() => {
                                if ((answers.lifeSkills || []).includes(item.k) || (answers.lifeSkills || []).length < 3) {
                                  toggleArray("lifeSkills", item.k);
                                }
                              }}
                              disabled={(answers.lifeSkills || []).length >= 3 && !(answers.lifeSkills || []).includes(item.k)}
                              className="sr-only"
                            />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                              {item.t}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              (answers.lifeSkills || []).includes(item.k)
                                ? "border-indigo-500 bg-indigo-500"
                                : "border-gray-300"
                            }`}
                          >
                            {(answers.lifeSkills || []).includes(item.k) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl">
                    <p className="text-indigo-800 font-medium text-sm sm:text-base">
                      Selected: {(answers.lifeSkills || []).length} / 3 skills
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 9 && (
                <div className="space-y-4 sm:space-y-6 animate-slide-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">🌟</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Your Hope
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
                      What do you personally hope to gain from Ambassador Camp
                      2026?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Your Hope
                      </label>
                      <textarea
                        value={answers.hope}
                        onChange={(e) => update("hope", e.target.value)}
                        placeholder="What do you personally hope to gain from Ambassador Camp 2026?"
                        className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-pink-500 focus:ring-0 transition-colors resize-none font-medium text-base"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Any Other Pertinent Issues
                      </label>
                      <textarea
                        value={answers.otherIssues}
                        onChange={(e) => update("otherIssues", e.target.value)}
                        placeholder="Is there anything else you'd like us to know? Any concerns, suggestions, or special requirements?"
                        className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-pink-500 focus:ring-0 transition-colors resize-none font-medium text-base"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prev}
                      className="flex items-center space-x-2 px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Back</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span className="text-sm sm:text-base">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">Submit Mission</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 10 && (
                <div className="text-center space-y-6 sm:space-y-8 animate-fade-in">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                    <Award className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      Mission Accepted! 🎉
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 mx-auto leading-relaxed px-2">
                      Thank you, Ambassador. Your answers will help us build a
                      camp that glorifies God and equips us for His mission.
                    </p>
                  </div>

                  {badge && (
                    <div className="space-y-4">
                      <p className="text-base sm:text-lg font-semibold text-gray-800">
                        Your Ambassador Badge:
                      </p>
                      <div className="inline-block p-2 bg-white rounded-2xl sm:rounded-3xl shadow-2xl">
                        <svg
                          width="260"
                          height="150"
                          viewBox="0 0 280 160"
                          xmlns="http://www.w3.org/2000/svg"
                          className="rounded-xl sm:rounded-2xl max-w-full h-auto"
                        >
                          <defs>
                            <linearGradient
                              id="badgeGrad"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#667eea" />
                              <stop offset="100%" stopColor="#764ba2" />
                            </linearGradient>
                          </defs>
                          <rect
                            width="280"
                            height="160"
                            rx="16"
                            fill="url(#badgeGrad)"
                          />
                          <circle
                            cx="240"
                            cy="40"
                            r="20"
                            fill="white"
                            opacity="0.1"
                          />
                          <circle
                            cx="50"
                            cy="120"
                            r="15"
                            fill="white"
                            opacity="0.1"
                          />
                          <text
                            x="140"
                            y="60"
                            fontSize="24"
                            fontWeight="700"
                            textAnchor="middle"
                            fill="white"
                          >
                            Ambassador
                          </text>
                          <text
                            x="140"
                            y="95"
                            fontSize="20"
                            fontWeight="600"
                            textAnchor="middle"
                            fill="#fbbf24"
                          >
                            {badge}
                          </text>
                          <text
                            x="140"
                            y="130"
                            fontSize="12"
                            textAnchor="middle"
                            fill="white"
                            opacity="0.8"
                          >
                            Ambassador Camp 2026
                          </text>
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 px-2">
                        Right-click the badge to save or take a screenshot to
                        share!
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:gap-4 pt-4">
                    <button
                      className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300"
                      onClick={() => {
                        setStep(1);
                        setBadge(null);
                      }}
                    >
                      Edit Answers
                    </button>
                    <button
                      className={`w-full px-6 py-4 rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                        answers.prizeDrawEntry
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                      }`}
                      onClick={() => {
                        const newValue = !answers.prizeDrawEntry;
                        update("prizeDrawEntry", newValue);
                        if (newValue) {
                          alert(
                            "🎉 You're entered in the prize draw! We will contact winners!"
                          );
                        } else {
                          alert(
                            "You have been removed from the prize draw."
                          );
                        }
                      }}
                    >
                      {answers.prizeDrawEntry
                        ? "✅ Entered in Prize Draw!"
                        : "🎁 Enter Prize Draw"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 text-center">
                Made with ❤️ by Tadiwa Matewe
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        /* Ensure proper touch targets on mobile */
        @media (max-width: 640px) {
          button, select, textarea, input[type="checkbox"] + * {
            min-height: 44px;
          }
          
          /* Improve text readability on mobile */
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}