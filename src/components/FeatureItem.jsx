import { Check, X, Scissors, AlertCircle, HelpCircle, CornerDownRight, Timer } from 'lucide-react';
import { useState } from 'react';

export default function FeatureItem({ feature, onToggle, onSimplify, isOverBudget }) {
  const { name, category, timeEstimate, simplifiedTimeEstimate, reason, simplificationRecommendation, included, isSimplified } = feature;
  const [showWhy, setShowWhy] = useState(false);
  
  const getCategoryIcon = () => {
    switch(category) {
      case 'BUILD': return <div className="feature-icon-wrapper icon-build"><Check size={20} /></div>;
      case 'SIMPLIFY': return <div className="feature-icon-wrapper icon-simplify"><Scissors size={20} /></div>;
      case 'CUT': return <div className="feature-icon-wrapper icon-cut"><X size={20} /></div>;
      default: return null;
    }
  };

  const getCategoryBadge = () => {
    switch(category) {
      case 'BUILD': return <span className="badge badge-build">BUILD</span>;
      case 'SIMPLIFY': return <span className="badge badge-simplify">SIMPLIFY</span>;
      case 'CUT': return <span className="badge badge-cut">CUT</span>;
      default: return null;
    }
  };

  const currentTime = isSimplified && simplifiedTimeEstimate ? simplifiedTimeEstimate : timeEstimate;

  return (
    <div className={`feature-row ${!included ? 'is-excluded' : ''}`}>
      <div className="feature-top flex-col md:flex-row gap-4 md:gap-0">
        <div className="feature-info">
          {getCategoryIcon()}
          
          <div className="feature-details">
            <div className="feature-header-group flex-wrap">
              <h4 className="feature-name">{name}</h4>
              {getCategoryBadge()}
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <span className="feature-time-badge">
                <Timer size={14} />
                {isSimplified && simplifiedTimeEstimate && <span className="strikethrough-time line-through text-gray-500 mr-1">{timeEstimate}m</span>}
                <span className={isSimplified ? "text-warning font-bold" : ""}>{currentTime} min</span>
              </span>
              
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => setShowWhy(!showWhy)}
                style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem' }}
              >
                <HelpCircle size={14} className="mr-1" style={{ marginRight: '0.25rem' }}/>
                Why?
              </button>
            </div>
            
            {showWhy && (
              <div className="mt-3 text-sm text-secondary bg-main shadow-sm" style={{ padding: '0.75rem', borderRadius: '0.375rem', backgroundColor: '#f8fafc', borderLeft: `3px solid var(--${category === 'BUILD' ? 'success' : category === 'SIMPLIFY' ? 'warning' : 'danger'})` }}>
                <p className="mb-0"><strong>AI Reasoning:</strong> {reason}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="feature-actions w-full md:w-auto flex justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium" style={{ color: included ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
              {included ? 'Included' : 'Excluded'}
            </span>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                checked={included} 
                onChange={onToggle} 
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>
      </div>
      
      {simplificationRecommendation && included && (
        <div className={`simplification-card ${isSimplified ? 'active' : ''} ${isOverBudget && !isSimplified ? 'animate-pulse-soft' : ''} mt-4`}>
          <div className="simplification-header">
            <CornerDownRight size={16} />
            <span>Simplification Available</span>
          </div>
          <p className="simplification-text">{simplificationRecommendation}</p>
          
          {simplifiedTimeEstimate && (
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs font-semibold text-success">
                Saves {timeEstimate - simplifiedTimeEstimate} minutes
              </span>
              <button 
                className={`btn btn-sm ${isSimplified ? 'btn-secondary' : 'btn-primary'}`}
                onClick={onSimplify}
                style={{ backgroundColor: isSimplified ? 'white' : 'var(--warning)', borderColor: isSimplified ? 'var(--border-color)' : 'var(--warning)', color: isSimplified ? 'var(--text-primary)' : 'white', fontWeight: 'bold' }}
              >
                {isSimplified ? 'Restore Full Feature' : `Apply Simplification (${simplifiedTimeEstimate}m)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}