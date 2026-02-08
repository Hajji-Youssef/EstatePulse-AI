
import React from 'react';
import { PredictionResult } from '../types';

interface PriceCardProps {
  prediction: PredictionResult;
}

const PriceCard: React.FC<PriceCardProps> = ({ prediction }) => {
  const { estimatedPrice, confidenceScore, marketTrend, featuresUsed } = prediction;

  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 mt-6 animate-in fade-in zoom-in duration-700 max-w-md">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 px-6 py-5 flex justify-between items-center">
        <div>
          <h3 className="text-white font-extrabold text-sm uppercase tracking-widest">Rapport de Valeur</h3>
          <p className="text-indigo-300 text-[10px] font-medium uppercase tracking-tighter">Analyse Prédictive IA</p>
        </div>
        <div className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Stable Engine v2.4</span>
        </div>
      </div>
      
      <div className="p-8">
        <div className="text-center mb-8">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Estimation de Marché</p>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">
            {formatter.format(estimatedPrice)}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-slate-400 text-[9px] uppercase font-black mb-1">Confiance Algorithmique</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-800">{Math.round(confidenceScore * 100)}%</span>
              <div className="flex-1 h-1 bg-slate-200 rounded-full">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${confidenceScore * 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-slate-400 text-[9px] uppercase font-black mb-1">Tendance de Zone</p>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-tighter">{marketTrend}</p>
          </div>
        </div>

        {/* Section Data Sources - CRUCIAL POUR LA PRÉSENTATION */}
        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-6">
          <p className="text-indigo-900 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <i className="fas fa-database text-indigo-400"></i> Benchmarks de Données
          </p>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-[10px] text-slate-500">Source Primaire: <span className="text-slate-900 font-bold">DVF (État)</span></div>
            <div className="text-[10px] text-slate-500">Index: <span className="text-slate-900 font-bold">Insee 2024</span></div>
            <div className="text-[10px] text-slate-500">Moteur: <span className="text-slate-900 font-bold">Reg. Linéaire</span></div>
            <div className="text-[10px] text-slate-500">Freshness: <span className="text-emerald-600 font-bold">Temps Réel</span></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-50">
            <span className="text-slate-500 font-medium">Surface Analysee</span>
            <span className="text-slate-900 font-bold">{featuresUsed.sqft} m²</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Standing Localisation</span>
            <span className="text-indigo-600 font-black uppercase tracking-tighter">{featuresUsed.locationQuality}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 px-8 py-3 text-center">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Données certifiées conformes aux standards transactionnels
        </p>
      </div>
    </div>
  );
};

export default PriceCard;
