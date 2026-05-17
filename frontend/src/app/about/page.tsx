import Link from "next/link";
import { ArrowLeft, Zap, Shield, Search as SearchIcon, FileText, Code, CheckCircle2, Crosshair, Ban } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[150px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-16 group">
          <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800 transition-colors border border-zinc-800 group-hover:border-zinc-700">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Home</span>
        </Link>
        
        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-semibold tracking-wide mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-[family-name:var(--font-outfit)] text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-zinc-400">
            The Librarian for the <br className="hidden md:block" /> Open Educational Web
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Scraper cuts through the noise of modern web search, empowering engineering students to instantly find high-quality, free learning resources.
          </p>
        </div>

        {/* The Problem Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-outfit)] text-white">
              The Central Tension
            </h2>
            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
              <p>
                When a computer science student in a Tier-2 Indian city searches for "Operating Systems VTU 5th sem notes pdf" at 2 AM the night before an exam, they are met with a barrage of obstacles.
              </p>
              <p>
                They click on a promising link, only to find a 2,000-word SEO article that eventually leads to a broken Google Drive link, a paywall, or a prompt to download a shady app. The failure is not a lack of content; it is the burying of actual educational material beneath engagement-farmed garbage.
              </p>
              <p className="text-indigo-300 font-medium">
                The student loses time, focus, and trust in the search experience. We are here to fix that.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-rose-400">
                <Ban className="w-5 h-5" /> What we filter out
              </h3>
              <ul className="space-y-4">
                {[
                  "2,000-word SEO articles with no actual content",
                  "Broken Google Drive links and paywalls",
                  "General news, entertainment, and non-educational queries",
                  "Paid course aggregators (Udemy, Coursera affiliates)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
                    <Crosshair className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-[family-name:var(--font-outfit)] text-white">Our Product Philosophy</h2>
            <p className="text-zinc-400 text-lg">To remain true to our mission, Scraper consistently sacrifices fluff for utility.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Curation over Coverage",
                desc: "We index only valuable resources, not everything. A smaller, highly curated index over a massive, noisy one.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
                border: "border-emerald-400/20"
              },
              {
                icon: Zap,
                title: "Speed over Polish",
                desc: "Sub-2s results on standard 4G networks. Text-only results, no client-side heavy frameworks.",
                color: "text-amber-400",
                bg: "bg-amber-400/10",
                border: "border-amber-400/20"
              },
              {
                icon: CheckCircle2,
                title: "Resilience over Features",
                desc: "Degrade gracefully, never crash entirely. Designed for high pressure environments like exam seasons.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                border: "border-blue-400/20"
              },
              {
                icon: Shield,
                title: "Privacy over Analytics",
                desc: "No tracking, no ads, no data selling. You search, you download, you study.",
                color: "text-purple-400",
                bg: "bg-purple-400/10",
                border: "border-purple-400/20"
              }
            ].map((principle, i) => (
              <div key={i} className={`p-6 rounded-3xl bg-zinc-900 border ${principle.border} hover:-translate-y-1 transition-transform duration-300`}>
                <div className={`w-12 h-12 rounded-2xl ${principle.bg} flex items-center justify-center mb-6`}>
                  <principle.icon className={`w-6 h-6 ${principle.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{principle.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What we index */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
          
          <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-outfit)]">What you will actually find here</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: FileText, label: "University Official Notes" },
              { icon: FileText, label: "Handwritten Student Notes" },
              { icon: Code, label: "GitHub Repositories" },
              { icon: FileText, label: "Previous Year Papers" },
              { icon: SearchIcon, label: "Syllabus Cheatsheets" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-300">
                <item.icon className="w-4 h-4 text-indigo-400" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-12 border-t border-zinc-800 flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4 text-white">Ready to study without the noise? Get started.</h3>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors">
              <SearchIcon className="w-5 h-5" />
              Start Searching Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
