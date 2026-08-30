import { RotateCcw, AlertTriangle, AlertCircle, Info, PieChart, Activity, CheckCircle2, XCircle, LayoutDashboard, Plus, ChevronRight, Wand2, Sparkles } from 'lucide-react';
import FeatureItem from './FeatureItem';

export default function ScopeSimulator({ appState, onToggleFeature, onSimplifyFeature, onResetScope, onStartOver, onMakeAchievable }) {
  const { availableTime, features, projectIdea, summary, readinessScore } = appState;

  // Calculate current scope based on included features and simplified states
  const currentEstimatedTime = features
    .filter(f => f.included)
    .reduce((sum, f) => {
      const time = f.isSimplified && f.simplifiedTimeEstimate ? f.simplifiedTimeEstimate : f.timeEstimate;
      return sum + time;
    }, 0);

  const remainingTime = availableTime - currentEstimatedTime;
  const isOverBudget = remainingTime < 0;
  
  // Calculate percentage for progress bar (capped at 100%)
  const utilizationPercent = (currentEstimatedTime / availableTime) * 100;
  const progressPercent = Math.min(100, utilizationPercent);
  
  // Dynamic risk based on current selection rules
  let currentRisk = 'LOW';
  let riskClass = 'success';
  let statusMessage = 'DEMO READY';
  
  if (isOverBudget) {
    if (currentEstimatedTime > availableTime * 1.5) {
      currentRisk = 'CRITICAL';
      statusMessage = 'IMPOSSIBLE SCOPE';
    } else {
      currentRisk = 'HIGH';
      statusMessage = 'OVER BUDGET';
    }
    riskClass = 'danger';
  } else if (remainingTime <= (availableTime * 0.15)) {
    currentRisk = 'MODERATE';
    statusMessage = 'ACHIEVABLE (LOW BUFFER)';
    riskClass = 'warning';
  } else if (remainingTime <= (availableTime * 0.3)) {
    currentRisk = 'LOW';
    statusMessage = 'ACHIEVABLE';
    riskClass = 'success';
  } else {
    currentRisk = 'LOW';
    statusMessage = 'DEMO READY';
    riskClass = 'success';
  }

  // Dynamic Feasibility Score (0-100) based on current state vs available time
  // If we are over budget, score drops rapidly below 50. 
  // If we have a good buffer (70-85% utilization), score is high (85-100).
  let feasibilityScore = 0;
  if (utilizationPercent > 150) feasibilityScore = 10;
  else if (utilizationPercent > 100) feasibilityScore = Math.max(20, 100 - (utilizationPercent - 100) * 1.5);
  else if (utilizationPercent > 85) feasibilityScore = 100 - (utilizationPercent - 85) * 2;
  else feasibilityScore = 100 - (85 - utilizationPercent) * 0.5; // slight penalty for being too empty
  feasibilityScore = Math.min(100, Math.max(0, Math.round(feasibilityScore)));

  let feasibilityText = "";
  if (feasibilityScore >= 80) feasibilityText = "Highly Achievable";
  else if (feasibilityScore >= 60) feasibilityText = "Achievable with Focus";
  else if (feasibilityScore >= 40) feasibilityText = "At Risk of Failure";
  else feasibilityText = "Impossible to Deliver";

  // Find the first included feature that has a simplification available and isn't simplified yet
  const firstSimplifiableFeature = features.find(f => f.included && !f.isSimplified && f.simplificationRecommendation && f.simplifiedTimeEstimate);

  // Split features for MVP Breakdown
  const buildFeatures = features.filter(f => f.category === 'BUILD');
  const simplifyFeatures = features.filter(f => f.category === 'SIMPLIFY');
  const cutFeatures = features.filter(f => f.category === 'CUT');

  return (
    <div className="animate-slide-down">
      
      {/* Journey Navigation Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-tertiary mb-6 uppercase tracking-wider">
        <span className="text-secondary">IDEA</span>
        <ChevronRight size={14} />
        <span className="text-secondary">ANALYSIS</span>
        <ChevronRight size={14} />
        <span className="text-secondary">MVP</span>
        <ChevronRight size={14} />
        <span className="text-primary font-bold bg-primary-light px-2 py-1 rounded">SIMULATE</span>
      </div>

      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h2 className="flex items-center gap-2">
            <LayoutDashboard className="text-primary" size={28} />
            Your AI-Generated MVP
          </h2>
          <p className="project-idea-text mt-2">"{projectIdea}"</p>
        </div>
        <div className="header-actions flex gap-3">
           <button onClick={onResetScope} className="btn btn-secondary shadow-sm">
            <RotateCcw size={16} /> Reset Scope
          </button>
          <button onClick={onStartOver} className="btn btn-ghost border border-border-color">
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {isOverBudget && (
        <div className="alert-banner danger animate-slide-down">
          <AlertCircle className="alert-icon" size={24} />
          <div className="alert-content w-full flex justify-between items-center">
            <div>
              <h4 className="font-bold">Your current scope won't fit this sprint.</h4>
              <p>Requires {currentEstimatedTime}m (Budget: {availableTime}m). You are {Math.abs(remainingTime)}m over budget.</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Cards Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        
        {/* Feasibility Score Card - NEW */}
        <div className="card shadow-md border-primary-border" style={{ borderColor: isOverBudget ? 'var(--danger-border)' : 'var(--primary-border)' }}>
          <div className="card-header bg-main flex justify-between items-center" style={{ backgroundColor: '#f8fafc', padding: '1rem 1.25rem' }}>
            <h3 className="card-title text-sm font-bold text-secondary uppercase tracking-wider m-0">
              Feasibility Score
            </h3>
            <Info size={16} className="text-tertiary" />
          </div>
          <div className="card-body flex flex-col items-center justify-center py-6">
            <div className={`text-6xl font-black mb-2 transition-colors duration-500 text-${riskClass}`}>
              {feasibilityScore}
            </div>
            <div className={`text-sm font-bold uppercase tracking-wide text-${riskClass}`}>
              {feasibilityText}
            </div>
          </div>
        </div>

        {/* Sprint Health */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header flex justify-between items-center">
            <h3 className="card-title text-base font-semibold">
              <Activity className="text-primary" size={18} />
              Sprint Health
            </h3>
            <div className="flex items-center gap-3">
              <span className={`badge badge-status bg-${riskClass} text-${riskClass} font-bold tracking-wide transition-colors duration-300`} style={{ backgroundColor: `var(--${riskClass}-bg)`, borderColor: `var(--${riskClass}-border)` }}>
                {isOverBudget ? <XCircle size={16} className="mr-1" style={{display:'inline', marginBottom:'2px'}}/> : <CheckCircle2 size={16} className="mr-1" style={{display:'inline', marginBottom:'2px'}}/>}
                {statusMessage}
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-4xl font-bold tracking-tight text-primary transition-all duration-300">
                  {currentEstimatedTime} <span className="text-xl font-normal text-tertiary">/ {availableTime} min</span>
                </div>
                <div className="text-sm text-secondary font-medium mt-1">
                  {utilizationPercent.toFixed(1)}% Budget Utilized
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold tracking-tight transition-all duration-300 ${isOverBudget ? 'text-danger' : (remainingTime < 30 ? 'text-warning' : 'text-success')}`}>
                  {isOverBudget ? '-' : ''}{Math.abs(remainingTime)} <span className="text-lg">min</span>
                </div>
                <div className="text-sm text-secondary font-medium mt-1">Remaining Buffer</div>
              </div>
            </div>

            <div className="progress-wrapper mt-5 mb-0">
              <div className="progress-track" style={{ height: '12px' }}>
                <div 
                  className={`progress-fill bg-${riskClass}`} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MVP Breakdown Section */}
      <div className="mb-10">
        <div className="flex flex-col mb-5">
          <h3 className="text-xl font-bold flex items-center gap-2 text-primary m-0">
            <PieChart size={22} />
            Your Recommended MVP
          </h3>
          <p className="text-secondary text-sm mt-1 mb-0">Everything you need to prove the product — nothing you don't.</p>
        </div>
        
        <div className="mvp-columns">
          <div className="mvp-col border-t-4" style={{ borderTopColor: 'var(--success)' }}>
            <div className="mvp-col-title text-success mb-4 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                BUILD
              </div>
              <span className="text-xs text-secondary font-normal normal-case">Ship now</span>
            </div>
            {buildFeatures.length > 0 ? buildFeatures.map(f => (
              <div key={`mvp-${f.id}`} className="mvp-item shadow-sm border-0">
                <span className="font-semibold text-primary truncate mr-2" title={f.name}>{f.name}</span>
                <span className="text-tertiary font-medium flex-shrink-0 bg-main px-2 py-0.5 rounded">{f.timeEstimate}m</span>
              </div>
            )) : <div className="text-sm text-tertiary text-center py-4 bg-white rounded border border-dashed">None</div>}
          </div>
          
          <div className="mvp-col border-t-4" style={{ borderTopColor: 'var(--warning)' }}>
            <div className="mvp-col-title text-warning mb-4 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                SIMPLIFY
              </div>
              <span className="text-xs text-secondary font-normal normal-case">Ship a smaller version</span>
            </div>
            {simplifyFeatures.length > 0 ? simplifyFeatures.map(f => (
              <div key={`mvp-${f.id}`} className="mvp-item shadow-sm border-0">
                <span className="font-semibold text-primary truncate mr-2" title={f.name}>{f.name}</span>
                <span className="text-tertiary font-medium flex-shrink-0 bg-main px-2 py-0.5 rounded">{f.simplifiedTimeEstimate || f.timeEstimate}m</span>
              </div>
            )) : <div className="text-sm text-tertiary text-center py-4 bg-white rounded border border-dashed">None</div>}
          </div>
          
          <div className="mvp-col border-t-4" style={{ borderTopColor: 'var(--danger)' }}>
            <div className="mvp-col-title text-danger mb-4 flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-danger"></div>
                CUT
              </div>
              <span className="text-xs text-secondary font-normal normal-case">Postpone</span>
            </div>
            {cutFeatures.length > 0 ? cutFeatures.map(f => (
              <div key={`mvp-${f.id}`} className="mvp-item shadow-sm border-0 opacity-60 bg-main">
                <span className="font-medium text-secondary truncate mr-2" title={f.name}>{f.name}</span>
                <span className="text-tertiary font-medium flex-shrink-0 line-through">{f.timeEstimate}m</span>
              </div>
            )) : <div className="text-sm text-tertiary text-center py-4 bg-white rounded border border-dashed">None</div>}
          </div>
        </div>
      </div>

      {/* Simulator / Feature List */}
      <div className="card mb-8 shadow-lg border-primary-border" style={{ borderColor: '#bfdbfe', transform: 'translateZ(0)' }}>
        <div className="card-header bg-primary-light flex flex-col gap-1 border-b-primary-border" style={{ backgroundColor: '#eff6ff', borderBottomColor: '#bfdbfe' }}>
          <div className="flex justify-between items-center">
            <h3 className="card-title text-2xl font-bold text-primary mb-1">
              What if we change the scope?
            </h3>
            
            {/* MAKE THIS ACHIEVABLE CTA */}
            {isOverBudget ? (
              <button 
                onClick={onMakeAchievable}
                className="btn btn-primary animate-pulse-soft flex items-center gap-2 shadow-md"
                style={{ backgroundColor: 'var(--primary)', fontWeight: 'bold' }}
              >
                <Wand2 size={16} />
                ✨ Make this achievable
              </button>
            ) : (
              <button 
                disabled
                className="btn btn-ghost flex items-center gap-2 text-success font-medium opacity-100"
                style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)' }}
              >
                <CheckCircle2 size={16} />
                Scope is achievable
              </button>
            )}
          </div>
          
          <p className="text-secondary font-medium m-0 flex justify-between items-center w-full">
            <span>See the delivery impact before you commit. Features update instantly.</span>
          </p>
        </div>
        
        {/* Sticky Status Bar inside Simulator */}
        <div className="bg-main px-5 py-3 border-b flex justify-between items-center sticky top-0 z-10 transition-colors duration-300" style={{ borderBottomColor: 'var(--border-color)', backgroundColor: isOverBudget ? 'var(--danger-bg)' : '#f8fafc' }}>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Current Plan</span>
              <span className={`text-xl font-bold transition-colors duration-300 ${isOverBudget ? 'text-danger' : 'text-primary'}`}>{currentEstimatedTime} min</span>
            </div>
            <div className="h-8 w-px bg-border-color" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Available</span>
              <span className="text-xl font-bold text-secondary">{availableTime} min</span>
            </div>
            <div className="h-8 w-px bg-border-color" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Status</span>
              <span className={`text-xl font-bold transition-colors duration-300 text-${riskClass} flex items-center gap-2`}>
                {isOverBudget ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                {isOverBudget ? `OVER BUDGET (${Math.abs(remainingTime)}m)` : `ACHIEVABLE (${remainingTime}m buffer)`}
              </span>
            </div>
          </div>
        </div>

        {/* AI Recommendation Context */}
        {!isOverBudget && (
          <div className="p-4 bg-white border-b border-border-color flex gap-3 items-start">
            <Sparkles size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary m-0"><strong>AI Recommendation:</strong> {summary}</p>
          </div>
        )}

        <div className="feature-list-container bg-white relative">
          {features.map(feature => (
            <FeatureItem 
              key={feature.id} 
              feature={feature} 
              onToggle={() => onToggleFeature(feature.id)} 
              onSimplify={() => onSimplifyFeature(feature.id)}
              isOverBudget={isOverBudget}
            />
          ))}
        </div>
      </div>
    </div>
  );
}