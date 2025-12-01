import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { 
  Gamepad2,
  ChevronDown,
  ArrowRight,
  Zap,
  Trophy,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import './HowToPlay.css';

const HowToPlay = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  return (
    <div className="how-to-play-page">
      <Navbar />

      {/* Floating Particles */}
      <div className="particles-bg">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* Hero Section */}
      <section className="htp-hero">
        <div className="htp-container">
          <div className="hero-icon">
            <Gamepad2 size={50} />
          </div>
          <h1>{t('howToPlay.hero.title')}</h1>
          <p className="hero-subtitle">{t('howToPlay.hero.subtitle')}</p>
          <div className="scroll-indicator">
            <ChevronDown size={28} />
          </div>
        </div>
      </section>

      {/* Classic vs Quantum Comparison */}
      <section className="htp-section htp-comparison">
        <div className="htp-container">
          <h2 className="htp-section-title">{t('howToPlay.comparison.title')}</h2>
          
          <div className="comparison-grid">
            {/* Classic */}
            <div className="comparison-card">
              <h3>{t('howToPlay.comparison.classic.title')}</h3>
              <div className="board-illustration">
                <div className="htp-board">
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell classical-x">X</div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                </div>
              </div>
              <p className="comparison-desc">{t('howToPlay.comparison.classic.desc')}</p>
            </div>

            {/* VS Divider */}
            <div className="vs-divider">
              <Zap size={28} />
            </div>

            {/* Quantum */}
            <div className="comparison-card quantum">
              <h3>{t('howToPlay.comparison.quantum.title')}</h3>
              <div className="board-illustration">
                <div className="htp-board">
                  <div className="htp-cell quantum">X<sub>1</sub></div>
                  <div className="htp-cell quantum">X<sub>1</sub></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                </div>
              </div>
              <p className="comparison-desc">{t('howToPlay.comparison.quantum.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rule 1: Quantum Move */}
      <section className="htp-section htp-rule">
        <div className="htp-container">
          <div className="rule-header">
            <span className="rule-number">1</span>
            <h2>{t('howToPlay.rules.rule1.title')}</h2>
          </div>
          <p className="rule-desc">{t('howToPlay.rules.rule1.desc')}</p>
          
          <div className="illustration-box">
            <div className="step-label-top">
              {isRTL ? 'الحركة 1: X₁ ← المربعات 1، 2' : 'Move 1: X₁ → Squares 1, 2'}
            </div>
            <div className="board-container">
              <div className="htp-board">
                <div className="htp-cell quantum">X<sub>1</sub></div>
                <div className="htp-cell quantum">X<sub>1</sub></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
              </div>
            </div>
            <p className="illustration-caption">{t('howToPlay.rules.rule1.caption')}</p>
          </div>
        </div>
      </section>

      {/* Rule 2: Entanglement */}
      <section className="htp-section htp-rule alt-bg">
        <div className="htp-container">
          <div className="rule-header">
            <span className="rule-number">2</span>
            <h2>{t('howToPlay.rules.rule2.title')}</h2>
          </div>
          <p className="rule-desc">{t('howToPlay.rules.rule2.desc')}</p>
          
          <div className="illustration-box wide">
            {/* Step by step entanglement */}
            <div className="steps-container">
              {/* Move 1 */}
              <div className="step-item">
                <div className="step-badge">{t('howToPlay.rules.rule2.move')} 1</div>
                <div className="htp-board small">
                  <div className="htp-cell quantum">X<sub>1</sub></div>
                  <div className="htp-cell quantum">X<sub>1</sub></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                </div>
                <p className="step-desc">{isRTL ? 'X₁ ← المربعات 1، 2' : 'X₁ → Squares 1, 2'}</p>
              </div>

              <div className="step-arrow">{isRTL ? '←' : '→'}</div>

              {/* Move 2 */}
              <div className="step-item">
                <div className="step-badge">{t('howToPlay.rules.rule2.move')} 2</div>
                <div className="htp-board small">
                  <div className="htp-cell quantum">X<sub>1</sub></div>
                  <div className="htp-cell multi cycle">
                    <span className="x">X<sub>1</sub></span>
                    <span className="o">O<sub>2</sub></span>
                  </div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell quantum-o">O<sub>2</sub></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                  <div className="htp-cell"></div>
                </div>
                <p className="step-desc">{isRTL ? 'O₂ ← المربعات 2، 5' : 'O₂ → Squares 2, 5'}</p>
              </div>
            </div>

            {/* Entanglement explanation */}
            <div className="entanglement-explanation">
              <div className="explanation-box">
                <h4>{t('howToPlay.rules.rule2.why')}</h4>
                <p>{t('howToPlay.rules.rule2.because')}</p>
                <div className="entanglement-visual">
                  <div className="ent-item">
                    <span className="ent-mark x">X₁</span>
                    <span className="ent-connector">↔</span>
                    <span className="ent-mark o">O₂</span>
                  </div>
                  <p className="ent-label">{t('howToPlay.rules.rule2.shareSquare')} 2</p>
                </div>
              </div>
              
              <div className="explanation-box result">
                <h4>{t('howToPlay.rules.rule2.result')}</h4>
                <ul className="result-list">
                  <li>{t('howToPlay.rules.rule2.if1')}</li>
                  <li>{t('howToPlay.rules.rule2.if2')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rule 3: Cycle */}
      <section className="htp-section htp-rule">
        <div className="htp-container">
          <div className="rule-header">
            <span className="rule-number">3</span>
            <h2>{t('howToPlay.rules.rule3.title')}</h2>
          </div>
          <p className="rule-desc">{t('howToPlay.rules.rule3.desc')}</p>
          
          <div className="illustration-box wide">
            {/* Move 3 creates cycle */}
            <div className="step-label-top">
              {isRTL ? 'الحركة 3: X₃ ← المربعات 1، 5' : 'Move 3: X₃ → Squares 1, 5'}
            </div>
            
            <div className="cycle-container">
              {/* Board with cycle */}
              <div className="htp-board">
                <div className="htp-cell multi cycle">
                  <span className="x">X<sub>1</sub></span>
                  <span className="x">X<sub>3</sub></span>
                </div>
                <div className="htp-cell multi cycle">
                  <span className="x">X<sub>1</sub></span>
                  <span className="o">O<sub>2</sub></span>
                </div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell multi cycle">
                  <span className="o">O<sub>2</sub></span>
                  <span className="x">X<sub>3</sub></span>
                </div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
              </div>

              {/* Cycle diagram */}
              <div className="cycle-diagram">
                <div className="cycle-badge">
                  <Zap size={16} />
                  {t('howToPlay.rules.rule3.cycleDetected')}
                </div>
                <svg className="cycle-svg" viewBox="0 0 180 140">
                  {/* Triangle cycle */}
                  <polygon points="90,15 165,120 15,120" fill="none" stroke="#ffc800" strokeWidth="3"/>
                  
                  {/* Nodes */}
                  <circle cx="90" cy="15" r="22" fill="#1a1a2e" stroke="#06ffa5" strokeWidth="2"/>
                  <text x="90" y="20" fill="#06ffa5" fontSize="11" textAnchor="middle">X₁</text>
                  
                  <circle cx="165" cy="120" r="22" fill="#1a1a2e" stroke="#ff6b6b" strokeWidth="2"/>
                  <text x="165" y="125" fill="#ff6b6b" fontSize="11" textAnchor="middle">O₂</text>
                  
                  <circle cx="15" cy="120" r="22" fill="#1a1a2e" stroke="#06ffa5" strokeWidth="2"/>
                  <text x="15" y="125" fill="#06ffa5" fontSize="11" textAnchor="middle">X₃</text>
                  
                  {/* Labels on edges */}
                  <text x="135" y="60" fill="#ffc800" fontSize="9">{isRTL ? 'مربع 2' : 'Sq 2'}</text>
                  <text x="90" y="135" fill="#ffc800" fontSize="9">{isRTL ? 'مربع 5' : 'Sq 5'}</text>
                  <text x="40" y="60" fill="#ffc800" fontSize="9">{isRTL ? 'مربع 1' : 'Sq 1'}</text>
                </svg>
                <p className="cycle-explanation">{t('howToPlay.rules.rule3.cycleExplanation')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rule 4: Collapse */}
      <section className="htp-section htp-rule alt-bg">
        <div className="htp-container">
          <div className="rule-header">
            <span className="rule-number">4</span>
            <h2>{t('howToPlay.rules.rule4.title')}</h2>
          </div>
          <p className="rule-desc">{t('howToPlay.rules.rule4.desc')}</p>
          
          <div className="illustration-box wide">
            <div className="collapse-container">
              {/* Who chooses */}
              <div className="who-chooses">
                <div className="chooser-badge">
                  <span className="chooser-icon">👆</span>
                  <span>{t('howToPlay.rules.rule4.whoChooses')}</span>
                </div>
                <p>{t('howToPlay.rules.rule4.chooserExplanation')}</p>
              </div>

              {/* Two options */}
              <div className="collapse-options">
                {/* Option 1 */}
                <div className="collapse-option">
                  <h4>{t('howToPlay.rules.rule4.option')} 1</h4>
                  <p className="option-choice">
                    {isRTL ? 'اختر: X₁ ← مربع 2' : 'Choose: X₁ → Square 2'}
                  </p>
                  <div className="htp-board small">
                    <div className="htp-cell"></div>
                    <div className="htp-cell classical-x">X</div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell classical-o">O</div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                  </div>
                  <div className="collapse-chain">
                    {isRTL ? (
                      <>
                        <span>X₃←1</span>
                        <span>←</span>
                        <span>O₂←5</span>
                        <span>←</span>
                        <span>X₁←2</span>
                      </>
                    ) : (
                      <>
                        <span>X₁→2</span>
                        <span>→</span>
                        <span>O₂→5</span>
                        <span>→</span>
                        <span>X₃→1</span>
                      </>
                    )}
                  </div>
                  <p className="option-result">O {t('howToPlay.rules.rule4.getsCenter')} ✓</p>
                </div>

                {/* OR */}
                <div className="option-or">{t('howToPlay.rules.rule4.or')}</div>

                {/* Option 2 */}
                <div className="collapse-option">
                  <h4>{t('howToPlay.rules.rule4.option')} 2</h4>
                  <p className="option-choice">
                    {isRTL ? 'اختر: X₁ ← مربع 1' : 'Choose: X₁ → Square 1'}
                  </p>
                  <div className="htp-board small">
                    <div className="htp-cell classical-x">X</div>
                    <div className="htp-cell classical-o">O</div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell classical-x">X</div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                    <div className="htp-cell"></div>
                  </div>
                  <div className="collapse-chain">
                    {isRTL ? (
                      <>
                        <span>O₂←2</span>
                        <span>←</span>
                        <span>X₃←5</span>
                        <span>←</span>
                        <span>X₁←1</span>
                      </>
                    ) : (
                      <>
                        <span>X₁→1</span>
                        <span>→</span>
                        <span>X₃→5</span>
                        <span>→</span>
                        <span>O₂→2</span>
                      </>
                    )}
                  </div>
                  <p className="option-result">X {t('howToPlay.rules.rule4.getsCenter')} ✗</p>
                </div>
              </div>

              {/* Best choice */}
              <div className="best-choice">
                <Lightbulb size={18} />
                <p>{t('howToPlay.rules.rule4.bestChoice')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rule 5: Winning */}
      <section className="htp-section htp-rule">
        <div className="htp-container">
          <div className="rule-header">
            <span className="rule-number">5</span>
            <h2>{t('howToPlay.rules.rule5.title')}</h2>
          </div>
          <p className="rule-desc">{t('howToPlay.rules.rule5.desc')}</p>
          
          <div className="illustration-box">
            <div className="winning-container">
              <div className="htp-board">
                <div className="htp-cell classical-x win">X</div>
                <div className="htp-cell classical-x win">X</div>
                <div className="htp-cell classical-x win">X</div>
                <div className="htp-cell classical-o">O</div>
                <div className="htp-cell classical-o">O</div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell classical-o">O</div>
              </div>
              
              <div className="winner-announcement">
                <Trophy size={28} />
                <span>{t('howToPlay.rules.rule5.xWins')}</span>
              </div>
            </div>
            <p className="illustration-caption">{t('howToPlay.rules.rule5.caption')}</p>
          </div>
        </div>
      </section>

      {/* Special Case: Simultaneous Win */}
      <section className="htp-section htp-special">
        <div className="htp-container">
          <div className="special-card">
            <div className="special-icon">
              <AlertCircle size={32} />
            </div>
            <h2>{t('howToPlay.special.title')}</h2>
            <p className="special-desc">{t('howToPlay.special.desc')}</p>
            
            <div className="special-illustration">
              <div className="htp-board small">
                <div className="htp-cell win-x">X<sub>3</sub></div>
                <div className="htp-cell win-x">X<sub>3</sub></div>
                <div className="htp-cell win-x">X<sub>3</sub></div>
                <div className="htp-cell win-o">O<sub>4</sub></div>
                <div className="htp-cell win-o">O<sub>4</sub></div>
                <div className="htp-cell win-o">O<sub>4</sub></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
                <div className="htp-cell"></div>
              </div>
              
              <div className="special-result">
                <div className="result-comparison">
                  <span className="move-num x">X₃</span>
                  <span className="vs">vs</span>
                  <span className="move-num o">O₄</span>
                </div>
                <div className="result-arrow">↓</div>
                <div className="result-winner">
                  <span>3 &lt; 4</span>
                  <div className="winner-badge">
                    <Trophy size={18} />
                    {t('howToPlay.special.xWins')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="special-tip">
              <Lightbulb size={18} />
              <p>{t('howToPlay.special.tip')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="htp-section htp-summary">
        <div className="htp-container">
          <h2 className="htp-section-title">{t('howToPlay.summary.title')}</h2>
          
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-num">1</span>
              <p>{t('howToPlay.summary.step1')}</p>
            </div>
            <div className="summary-item">
              <span className="summary-num">2</span>
              <p>{t('howToPlay.summary.step2')}</p>
            </div>
            <div className="summary-item">
              <span className="summary-num">3</span>
              <p>{t('howToPlay.summary.step3')}</p>
            </div>
            <div className="summary-item">
              <span className="summary-num">4</span>
              <p>{t('howToPlay.summary.step4')}</p>
            </div>
            <div className="summary-item">
              <span className="summary-num">5</span>
              <p>{t('howToPlay.summary.step5')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="htp-section htp-cta">
        <div className="htp-container">
          <div className="cta-content">
            <h2>{t('howToPlay.cta.title')}</h2>
            <p>{t('howToPlay.cta.desc')}</p>
            <button className="cta-button" onClick={() => navigate('/game')}>
              <Gamepad2 size={22} />
              {t('howToPlay.cta.button')}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowToPlay;