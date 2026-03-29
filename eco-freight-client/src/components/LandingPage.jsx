import React from 'react';
import { BarChart3, Globe, Leaf, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="bg-white font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-eco-green p-2 rounded-lg">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-eco-dark">ECO-FREIGHT</span>
        </div>
        <button 
          onClick={onStart}
          className="bg-eco-dark text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition"
        >
          Book a Demo
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-eco-green uppercase bg-eco-light rounded-full">
            Carbon Accounting Software
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 mb-6 leading-tight max-w-4xl">
            Calculate, analyze, and <br/> 
            <span className="text-eco-green">report on CO₂e emissions</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Eco-Freight puts you in control of your supply chain emissions, turning raw data into accurate outputs and actionable insights.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onStart}
              className="bg-eco-green text-white px-10 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center group"
            >
              Launch Dashboard 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-eco-green rounded-full blur-[120px]"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* The 4-Step Process Section */}
      <section className="bg-slate-50 py-24 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-sm font-bold text-eco-green uppercase tracking-[0.2em] mb-2">How it works</h2>
            <h3 className="text-4xl font-bold text-slate-900">Calculate and analyze in 4 simple steps</h3>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {[
              { step: "Step 1", title: "Create custom data template", desc: "Select relevant modalities, vehicles and fuel types using your logistics profile.", icon: <Globe className="w-5 h-5" /> },
              { step: "Step 2", title: "Import your data into Eco-Freight", desc: "Use our smart importer to review & validate your data, solve errors and calculate emissions.", icon: <Zap className="w-5 h-5" /> },
              { step: "Step 3", title: "Create automatic reports", desc: "Understand your emission hotspots and monitor progress towards reduction goals.", icon: <BarChart3 className="w-5 h-5" /> },
              { step: "Step 4", title: "Report your emissions", desc: "Generate customer-specific reports or share them directly with authorities.", icon: <ShieldCheck className="w-5 h-5" /> }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group">
                <div className="text-eco-green font-bold text-xs uppercase mb-4 tracking-widest">{item.step}</div>
                <h4 className="text-xl font-bold mb-3 group-hover:text-eco-green transition">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                <div className="mt-auto inline-flex items-center text-eco-dark font-semibold text-sm cursor-pointer hover:underline">
                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}