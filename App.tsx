
import React, { useState } from 'react';
import { CropEntry, CalculationResult } from './types';
import { fetchMarketInsights } from './services/geminiService';
import CropForm from './components/CropForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = async (crop: CropEntry) => {
    setLoading(true);
    setError(null);
    try {
      const marketData = await fetchMarketInsights(crop.name);
      
      // Conversion logic: Prices from Mandi are usually in Quintals (100kg)
      let yieldInQuintals = crop.yield;
      if (crop.yieldUnit === 'Kg') yieldInQuintals = crop.yield / 100;
      if (crop.yieldUnit === 'Ton') yieldInQuintals = crop.yield * 10;

      const totalRevenue = yieldInQuintals * marketData.currentPrice;
      const profit = totalRevenue - crop.estimatedCost;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      setResult({
        revenue: totalRevenue,
        cost: crop.estimatedCost,
        profit,
        profitMargin,
        marketData
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">A</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AgroProfit AI
            </h1>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Market</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Analysis</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">History</a>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Maximize Your <span className="text-emerald-500">Farm's Profit</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Upload your crop details and get instant AI-powered market revenue calculations 
          grounded in today's real Mandi prices across India.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Input */}
        <div className="lg:col-span-5">
          <CropForm onSubmit={handleCalculate} isLoading={loading} />
          
          <div className="mt-8 bg-slate-800/30 p-6 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">Or upload CSV data</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Batch calculate multiple crops at once</p>
            <input type="file" className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="cursor-pointer px-4 py-2 border border-slate-600 rounded-lg text-xs text-slate-300 hover:bg-slate-700 transition-colors">
              Select File
            </label>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-7">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Error
              </div>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-slate-800/20 rounded-2xl border border-slate-800 p-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-300">No Analysis Data Yet</h3>
              <p className="text-slate-500 mt-2 max-w-xs">
                Fill out the form on the left to start calculating your expected profits using real-time market data.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-slate-800 rounded-2xl"></div>
                <div className="h-24 bg-slate-800 rounded-2xl"></div>
                <div className="h-24 bg-slate-800 rounded-2xl"></div>
              </div>
              <div className="h-64 bg-slate-800 rounded-2xl"></div>
              <div className="h-48 bg-slate-800 rounded-2xl"></div>
            </div>
          )}

          <Dashboard result={result} />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-20 pt-12 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-500">
            © 2024 AgroProfit AI. Empowering farmers with real-time analytics.
          </div>
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Market Live
            </span>
            <span className="text-xs text-slate-400 px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50">
              Region: India (INR)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
