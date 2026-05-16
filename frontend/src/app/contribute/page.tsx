import Link from "next/link";
import { ArrowLeft, BookOpen, Terminal, Database, Code2, Cpu, Globe, Rocket, AlertTriangle } from "lucide-react";

export default function Contribute() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rose-900/10 blur-[150px]" />
        <div className="absolute top-[50%] right-[0%] w-[40%] h-[40%] rounded-full bg-orange-900/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[30%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-16 group">
          <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800 transition-colors border border-zinc-800 group-hover:border-zinc-700">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Home</span>
        </Link>
        
        {/* Header Section */}
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold tracking-wide mb-8">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            Open Source
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-[family-name:var(--font-outfit)] text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-zinc-400">
            Built for students, <br /> by students.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">
            Scraper relies on community contributions to index the best study material, maintain infrastructure, and build new features. Here is how you can help.
          </p>
        </div>

        {/* Ways to Contribute */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 font-[family-name:var(--font-outfit)] text-white">How you can get involved</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Frontend */}
            <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/30 transition-colors relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Code2 className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-white">Frontend (Next.js)</h3>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Help us improve the core search UI, make it even faster, build admin dashboards, and refine the minimal aesthetic.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-zinc-500">
                <li>• React 19 / Next.js 15</li>
                <li>• Tailwind CSS v4</li>
                <li>• Search Debouncing & States</li>
              </ul>
              <a href="https://github.com/maheshMadiwalar18/Scrapper/tree/main/frontend" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
                View Frontend Issues <ArrowLeft className="w-4 h-4 rotate-135" />
              </a>
            </div>

            {/* Backend */}
            <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-rose-500/30 transition-colors relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Database className="w-10 h-10 text-rose-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-white">Backend & Search</h3>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Optimize our Meilisearch queries, write efficient FastAPI endpoints, and manage Postgres schemas.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-zinc-500">
                <li>• Python / FastAPI</li>
                <li>• PostgreSQL & Meilisearch</li>
                <li>• Sub-500ms API Targets</li>
              </ul>
              <a href="https://github.com/maheshMadiwalar18/Scrapper/tree/main/backend" className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 font-medium">
                View Backend Issues <ArrowLeft className="w-4 h-4 rotate-135" />
              </a>
            </div>

            {/* Data Pipeline */}
            <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/30 transition-colors relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Terminal className="w-10 h-10 text-amber-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-white">Scraping Pipeline</h3>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Write robust Playwright scrapers to crawl whitelisted university portals and extract PDF text efficiently.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-zinc-500">
                <li>• Celery / Redis Workers</li>
                <li>• BeautifulSoup & Playwright</li>
                <li>• PDF Text Extraction</li>
              </ul>
              <a href="https://github.com/maheshMadiwalar18/Scrapper/tree/main/backend/scrapers" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium">
                View Pipeline Issues <ArrowLeft className="w-4 h-4 rotate-135" />
              </a>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-outfit)] text-white">Future Roadmap</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Phase 1: OCR for Handwritten Notes</h4>
                  <p className="text-zinc-400">Implementing Optical Character Recognition to parse and index scanned, handwritten notes—a massive value unlock for Indian contexts.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Phase 2: Semantic Reranking</h4>
                  <p className="text-zinc-400">Integrating a lightweight AI reranking model to understand semantic queries beyond simple keyword matching.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Phase 3: Verified Curators</h4>
                  <p className="text-zinc-400">Building community tools for verified students to suggest and approve new domains, repositories, and study drives.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-10">
            <AlertTriangle className="w-10 h-10 text-orange-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-outfit)]">Add Resources</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Not a developer? You can still contribute massively by pointing us to high-quality domains. If you know a great website, GitHub repository, or public drive folder with study materials, let us know so we can index it.
            </p>
            <div className="space-y-4">
              <button className="w-full px-6 py-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-colors">
                Submit a URL for Indexing
              </button>
              <button className="w-full px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors">
                Report Spam / Broken Link
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
