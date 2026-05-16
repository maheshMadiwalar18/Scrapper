import { Search, FileText, Book, GitBranch, FileCode, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Navigation/Header */}
        <header className="absolute top-0 w-full flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Search className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              Scraper
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contribute" className="hover:text-white transition-colors">Contribute</Link>
            <Link href="/signin" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/5 text-white transition-all">
              Sign In
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl w-full mt-12 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Zero spam. Built for Indian Students.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            The Educational Search <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
              That Actually Works
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Discover curated engineering resources. Find PDFs, handwritten notes, previous year papers, and GitHub repositories without the SEO spam and paid courses.
          </p>

          {/* Search Bar Container */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
              <div className="pl-6 pr-3">
                <Search className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search 'Operating Systems notes VTU 5th sem'..."
                className="w-full bg-transparent py-5 px-2 text-lg text-white placeholder:text-zinc-500 focus:outline-none"
              />
              <div className="pr-3 pl-2">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 text-sm">
            <span className="text-zinc-500 mr-2">Try searching:</span>
            {[
              { icon: FileText, label: "Handwritten Notes" },
              { icon: Book, label: "Previous Year Papers" },
              { icon: FileCode, label: "Roadmaps" },
              { icon: GitBranch, label: "Repositories" }
            ].map((filter, i) => (
              <button 
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-300 transition-all"
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
