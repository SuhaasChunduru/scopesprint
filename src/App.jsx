import { useState } from 'react';
import { Layers } from 'lucide-react';
import InputForm from './components/InputForm';
import ScopeSimulator from './components/ScopeSimulator';
import { analyzeScope } from './lib/ai';

function App() {
  const [appState, setAppState] = useState({
    projectIdea: '',
    availableTime: '',
    skillLevel: 'Intermediate',
    estimatedTime: 0,
    readinessScore: 0,
    risk: 'Low',
    summary: '',
    features: [],         
    originalFeatures: [], 
    isAnalyzing: false,
    analysisComplete: false,
  });

  const handleAnalyze = async (inputData) => {
    setAppState(prev => ({ ...prev, isAnalyzing: true }));
    
    const analysisResult = await analyzeScope(
      inputData.projectIdea, 
      inputData.availableTime, 
      inputData.skillLevel
    );
    
    const processedFeatures = analysisResult.features.map((f, i) => ({
      ...f,
      id: `ai-f${i}`,
      included: f.category !== 'CUT',
      isSimplified: false
    }));

    setAppState(prev => ({
      ...prev,
      projectIdea: inputData.projectIdea,
      availableTime: Number(inputData.availableTime),
      skillLevel: inputData.skillLevel,
      isAnalyzing: false,
      analysisComplete: true,
      estimatedTime: analysisResult.estimatedTime,
      readinessScore: analysisResult.readinessScore,
      risk: analysisResult.risk,
      summary: analysisResult.summary || '',
      features: [...processedFeatures],
      originalFeatures: [...processedFeatures],
    }));
  };

  const handleFeatureToggle = (featureId) => {
    setAppState(prev => {
      const updatedFeatures = prev.features.map(f => 
        f.id === featureId ? { ...f, included: !f.included } : f
      );
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleSimplifyFeature = (featureId) => {
    setAppState(prev => {
      const updatedFeatures = prev.features.map(f => 
        f.id === featureId ? { ...f, isSimplified: !f.isSimplified } : f
      );
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleMakeAchievable = () => {
    setAppState(prev => {
      let currentFeatures = [...prev.features];
      let currentEstimate = currentFeatures
        .filter(f => f.included)
        .reduce((sum, f) => sum + (f.isSimplified && f.simplifiedTimeEstimate ? f.simplifiedTimeEstimate : f.timeEstimate), 0);
      
      const targetTime = prev.availableTime;

      // Pass 1: Apply simplifications to included features
      for (let i = 0; i < currentFeatures.length; i++) {
        if (currentEstimate <= targetTime) break;
        const f = currentFeatures[i];
        if (f.included && !f.isSimplified && f.simplificationRecommendation && f.simplifiedTimeEstimate) {
          const savings = f.timeEstimate - f.simplifiedTimeEstimate;
          currentFeatures[i] = { ...f, isSimplified: true };
          currentEstimate -= savings;
        }
      }

      // Pass 2: If STILL over budget, aggressively cut SIMPLIFY/CUT features that might have been manually turned on
      if (currentEstimate > targetTime) {
        // Sort features: CUT category first, then SIMPLIFY
        const cutPriority = [...currentFeatures].sort((a, b) => {
          const rank = cat => cat === 'CUT' ? 0 : cat === 'SIMPLIFY' ? 1 : 2;
          return rank(a.category) - rank(b.category);
        });

        for (const featureToCut of cutPriority) {
          if (currentEstimate <= targetTime) break;
          if (featureToCut.included && featureToCut.category !== 'BUILD') { // Never auto-cut a BUILD feature
            const index = currentFeatures.findIndex(f => f.id === featureToCut.id);
            const savings = currentFeatures[index].isSimplified && currentFeatures[index].simplifiedTimeEstimate 
              ? currentFeatures[index].simplifiedTimeEstimate 
              : currentFeatures[index].timeEstimate;
            
            currentFeatures[index] = { ...currentFeatures[index], included: false };
            currentEstimate -= savings;
          }
        }
      }

      return { ...prev, features: currentFeatures };
    });
  };

  const handleResetScope = () => {
    setAppState(prev => ({
      ...prev,
      features: JSON.parse(JSON.stringify(prev.originalFeatures))
    }));
  };

  const handleStartOver = () => {
    setAppState({
      projectIdea: '',
      availableTime: '',
      skillLevel: 'Intermediate',
      estimatedTime: 0,
      readinessScore: 0,
      risk: 'Low',
      summary: '',
      features: [],
      originalFeatures: [],
      isAnalyzing: false,
      analysisComplete: false,
    });
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Layers className="navbar-icon" size={24} />
          ScopeSprint
        </div>
        <div className="navbar-badges">
          <span className="badge-outline">AI Engineering Manager</span>
          <span className="badge-outline">Hackathon Demo</span>
        </div>
      </nav>

      <main className="app-content">
        {!appState.analysisComplete ? (
          <InputForm 
            onSubmit={handleAnalyze} 
            isAnalyzing={appState.isAnalyzing} 
          />
        ) : (
          <ScopeSimulator 
            appState={appState} 
            onToggleFeature={handleFeatureToggle}
            onSimplifyFeature={handleSimplifyFeature}
            onMakeAchievable={handleMakeAchievable}
            onResetScope={handleResetScope}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-logo">
          <Layers size={18} />
          ScopeSprint
        </div>
        <p className="footer-text">Plan smarter. Ship focused.</p>
        <p className="footer-text text-xs mt-2 opacity-50">Built for hackathon • AI-powered scope planning</p>
      </footer>
    </div>
  );
}

export default App;