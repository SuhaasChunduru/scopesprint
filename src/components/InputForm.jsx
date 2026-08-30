import { useState, useEffect, useRef } from 'react';
import { Target, Timer, Cpu, ArrowRight, Play, Info, Sparkles, Lightbulb, Brain, ShieldAlert, CheckCircle, SlidersHorizontal, Flag } from 'lucide-react';

export default function InputForm({ onSubmit, isAnalyzing }) {
  const [formData, setFormData] = useState({
    projectIdea: '',
    availableTime: '120',
    skillLevel: 'Intermediate'
  });
  
  const [demoLoaded, setDemoLoaded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setDemoLoaded(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectIdea.trim() || !formData.availableTime) return;
    onSubmit(formData);
  };

  const loadDemo = () => {
    setFormData({
      projectIdea: 'Build a real-time team collaboration app with authentication, chat, file sharing, notifications, activity tracking and analytics.',
      availableTime: '120',
      skillLevel: 'Intermediate'
    });
    setDemoLoaded(true);
    setTimeout(() => {
      const submitBtn = document.getElementById('analyze-btn');
      if (submitBtn) submitBtn.focus();
    }, 100);
  };

  if (isAnalyzing) {
    return (
      <div className="loader-container animate-slide-down">
        <div className="spinner"></div>
        <h2 className="text-xl font-semibold mb-2">Analyzing your sprint scope...</h2>
        <p className="text-secondary">Our AI Engineering Manager is evaluating your project.</p>
        
        <div className="loader-steps">
          <div className="loader-step completed">✓ Understanding project requirements</div>
          <div className="loader-step active animate-pulse-soft">→ Estimating feature effort</div>
          <div className="loader-step">○ Evaluating sprint risk</div>
          <div className="loader-step">○ Building MVP recommendation</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-down">
      <div className="hero-section">
        <h1 className="hero-title">
          Ship the right scope.<br />
          <span className="hero-title-highlight">Not the biggest scope.</span>
        </h1>
        <p className="hero-subtitle">
          Turn ambitious ideas into realistic engineering sprints before scope creep turns into missed deadlines.
        </p>
        
        {!formData.projectIdea && !demoLoaded && (
          <div className="mt-8 flex justify-center animate-slide-down" style={{ animationDelay: '0.2s' }}>
            <button 
              type="button" 
              onClick={loadDemo}
              className="btn btn-secondary btn-lg pulse-demo-btn"
              style={{
                borderRadius: '999px',
                border: '2px solid var(--primary)',
                backgroundColor: 'white',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--primary)',
                fontWeight: '700',
                padding: '0.75rem 2rem'
              }}
            >
              <Sparkles size={20} className="text-primary mr-2" style={{marginRight: '8px'}} />
              Try Hackathon Demo Project
            </button>
          </div>
        )}
      </div>

      <div className="card landing-card mb-12" style={{ transition: 'all 0.3s ease', transform: demoLoaded ? 'translateY(-10px)' : 'none', boxShadow: demoLoaded ? 'var(--shadow-float)' : 'var(--shadow-lg)' }}>
        <div className="card-header flex justify-between items-center bg-main" style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="card-title text-primary">
            <Target size={20} />
            Define Your Sprint
          </h2>
          {formData.projectIdea && (
             <button 
             type="button" 
             onClick={() => setFormData({projectIdea:'', availableTime:'120', skillLevel:'Intermediate'})}
             className="btn btn-ghost btn-sm text-tertiary"
           >
             Clear
           </button>
          )}
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="projectIdea" className="form-label">
                What are you building?
                <span className="form-label-help">Describe features, architecture, and goals.</span>
              </label>
              <textarea
                id="projectIdea"
                name="projectIdea"
                className={`form-control ${demoLoaded ? 'ring-2 ring-primary bg-primary-light' : ''}`}
                style={{ 
                  transition: 'all 0.3s ease',
                  backgroundColor: demoLoaded ? 'var(--primary-light)' : 'var(--bg-card)',
                  borderColor: demoLoaded ? 'var(--primary-border)' : 'var(--border-color)'
                }}
                value={formData.projectIdea}
                onChange={handleChange}
                placeholder="e.g. A real-time chat application with channels, user auth, and file sharing..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="form-group mb-0">
                <label htmlFor="availableTime" className="form-label flex items-center gap-2">
                  <Timer size={16} className="text-tertiary" />
                  Available Time (minutes)
                </label>
                <input
                  type="number"
                  id="availableTime"
                  name="availableTime"
                  className="form-control"
                  style={{ backgroundColor: demoLoaded ? 'var(--primary-light)' : 'var(--bg-card)' }}
                  value={formData.availableTime}
                  onChange={handleChange}
                  min="30"
                  max="10080"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label htmlFor="skillLevel" className="form-label flex items-center gap-2">
                  <Cpu size={16} className="text-tertiary" />
                  Skill Level
                </label>
                <select
                  id="skillLevel"
                  name="skillLevel"
                  className="form-control"
                  style={{ backgroundColor: demoLoaded ? 'var(--primary-light)' : 'var(--bg-card)' }}
                  value={formData.skillLevel}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-5 mt-2 border-t border-color" style={{ borderColor: 'var(--border-color)', borderTopWidth: '1px' }}>
              <div className="flex items-center gap-2 text-sm text-secondary" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', backgroundColor: '#f1f5f9' }}>
                <Info size={16} className="text-primary flex-shrink-0" />
                AI will estimate effort based on your skill level.
              </div>
              
              <button 
                id="analyze-btn"
                type="submit" 
                className={`btn btn-lg ${demoLoaded ? 'btn-primary animate-pulse-soft' : 'btn-primary'}`}
                disabled={!formData.projectIdea.trim() || !formData.availableTime}
                style={demoLoaded ? { transform: 'scale(1.05)', boxShadow: '0 0 15px rgba(59,130,246,0.5)' } : {}}
              >
                Analyze My Scope
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Visual Journey Section */}
      <div className="journey-section mt-16 mb-8 px-4" style={{maxWidth: '900px', margin: '4rem auto 2rem auto'}}>
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-primary mb-2">From ambitious idea to achievable MVP</h3>
          <p className="text-secondary">How ScopeSprint protects your hackathon delivery</p>
        </div>
        
        <div className="journey-container">
          <div className="journey-step">
            <div className="journey-icon"><Lightbulb size={24} /></div>
            <div className="journey-num">01</div>
            <h4>IDEA</h4>
            <p>Describe your ambitious project</p>
          </div>
          
          <div className="journey-line"></div>
          
          <div className="journey-step">
            <div className="journey-icon"><Brain size={24} /></div>
            <div className="journey-num">02</div>
            <h4>AI SCOPE</h4>
            <p>Break idea into features</p>
          </div>
          
          <div className="journey-line"></div>
          
          <div className="journey-step">
            <div className="journey-icon"><ShieldAlert size={24} /></div>
            <div className="journey-num">03</div>
            <h4>FEASIBILITY</h4>
            <p>Can this actually ship?</p>
          </div>
          
          <div className="journey-line"></div>
          
          <div className="journey-step">
            <div className="journey-icon"><SlidersHorizontal size={24} /></div>
            <div className="journey-num">04</div>
            <h4>WHAT-IF</h4>
            <p>Experiment with scope changes</p>
          </div>
          
          <div className="journey-line"></div>
          
          <div className="journey-step">
            <div className="journey-icon"><Flag size={24} /></div>
            <div className="journey-num">05</div>
            <h4>MVP PLAN</h4>
            <p>Stay within budget</p>
          </div>
        </div>
      </div>
    </div>
  );
}