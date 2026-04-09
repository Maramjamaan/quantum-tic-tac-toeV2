import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import QuantumLogo from '../../components/QuantumLogo';
import {
  Link, Eye, Gamepad2, ArrowRight,
  Zap, Sparkles, Snowflake, Microchip, Lightbulb,
  Pill, Lock, TrendingUp, Truck
} from 'lucide-react';
import './QuantumComputing.css';
import googleQuantumImg from '../../assets/images/google-quantum.jpg';
import googleWillowImg from '../../assets/images/google-willow-chip.jpg';

const QuantumComputing = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('superposition');
  const isAr = language === 'ar';

  const tabs = [
    { key: 'superposition', icon: <Sparkles size={15} />, label: isAr ? 'التراكب' : 'Superposition' },
    { key: 'entanglement', icon: <Link size={15} />, label: isAr ? 'التشابك' : 'Entanglement' },
    { key: 'measurement', icon: <Eye size={15} />, label: isAr ? 'القياس' : 'Measurement' },
  ];

  const tabContent = {
    superposition: {
      color: '#06ffa5',
      headline: isAr ? 'الجسيم في مكانين في آنٍ واحد' : 'A particle in two places at once',
      body: isAr
        ? 'في الفيزياء الكلاسيكية، الشيء إما هنا أو هناك. في الكم، يمكن أن يكون في الحالتين معاً حتى تقوم بقياسه. الكيوبت ليس صفراً أو واحداً، بل احتمال في كل الحالات في آنٍ واحد.'
        : "In classical physics, things are either here or there. In quantum, something can exist in both states at once — until you observe it. A qubit isn't 0 or 1, it's a probability across all states simultaneously.",
      gameNote: isAr
        ? 'كل حركة في اللعبة موجودة في مربعَين في آنٍ واحد — X₁ في المربع 1 والمربع 2 معاً حتى يحدث الانهيار. هذا التراكب الكمي الحقيقي.'
        : 'Every move in the game exists in two squares simultaneously — X₁ in square 1 AND square 2 at the same time until collapse. This is real quantum superposition.',
      animation: (
        <div className="qc-anim-super">
          <div className="qc-sup-particle"><span>X</span></div>
          <div className="qc-sup-positions">
            <div className="qc-sup-pos" /><div className="qc-sup-pos" />
          </div>
        </div>
      )
    },
    entanglement: {
      color: '#a855f7',
      headline: isAr ? 'تغيير أحدهما يغير الآخر فوراً' : 'Change one, the other changes instantly',
      body: isAr
        ? 'عندما يتشابك جسيمان، يصبح مصيرهما مرتبطاً تماماً — مهما بَعُدت المسافة. قياس أحدهما يحدد حالة الآخر في نفس اللحظة. أينشتاين سمّاه "الخوف من بُعد".'
        : 'When two particles become entangled, their fates are linked regardless of distance. Measuring one instantly determines the other\'s state. Einstein called it "spooky action at a distance."',
      gameNote: isAr
        ? 'عندما تشترك حركتان في مربع، تتشابكان — ما يحدث لـ X₁ يحدد ما يمكن أن يفعله O₂. هذا الترابط هو قلب اللعبة الاستراتيجي.'
        : "When two moves share a square, they entangle — what happens to X₁ determines what O₂ can do. This linkage is the strategic heart of the game.",
      animation: (
        <div className="qc-anim-entangle">
          <div className="qc-ent-particle"><span>X</span></div>
          <div className="qc-ent-link">
            <div className="qc-ent-line" /><Link size={18} className="qc-ent-icon" /><div className="qc-ent-line" />
          </div>
          <div className="qc-ent-particle qc-ent-p2"><span>O</span></div>
        </div>
      )
    },
    measurement: {
      color: '#3b82f6',
      headline: isAr ? 'الملاحظة تصنع الواقع' : 'Observation creates reality',
      body: isAr
        ? 'قبل القياس، الجسيم في حالة تراكب. لحظة تقيسه، "ينهار" ويستقر في حالة واحدة. المراقبة نفسها تغير النتيجة.'
        : 'Before measurement, a particle exists as superposition. The moment you observe it, it "collapses" into one definite state. The observation itself changes the outcome.',
      gameNote: isAr
        ? 'عند تشكّل دورة في التشابكات، يُجبَر النظام على "القياس" — الحركات تنهار إلى مواقع كلاسيكية ثابتة. أنت تلعب دور المراقب.'
        : 'When a cycle forms in the entanglements, the system is forced to "measure" — moves collapse into fixed classical positions. You play the role of the observer.',
      animation: (
        <div className="qc-anim-measure">
          <div className="qc-meas-before">
            <div className="qc-meas-split"><span>X</span><span>X</span></div>
          </div>
          <div className="qc-meas-arrow">
            <Eye size={20} className="qc-meas-eye" /><ArrowRight size={16} />
          </div>
          <div className="qc-meas-after">
            <div className="qc-meas-collapsed"><span>X</span></div>
          </div>
        </div>
      )
    }
  };

  const shifts = isAr ? [
    { from: 'الثنائية', to: 'الاحتمالية', desc: 'ليس 0 أو 1 فقط — كل الاحتمالات في آنٍ واحد حتى القياس.' },
    { from: 'التسلسل', to: 'التوازي', desc: 'ليس خطوة بعد خطوة — ملايين المسارات في نفس اللحظة.' },
    { from: 'الاستقلالية', to: 'الترابط', desc: 'ليس كياناً منفصلاً — شبكة تأثيرات متبادلة فورية.' },
  ] : [
    { from: 'Binary', to: 'Probabilistic', desc: 'Not just 0 or 1 — all possibilities simultaneously until measurement.' },
    { from: 'Sequential', to: 'Parallel', desc: 'Not step by step — millions of paths in the same instant.' },
    { from: 'Independent', to: 'Entangled', desc: 'Not isolated — a web of instantaneous mutual influence.' },
  ];

  const apps = isAr ? [
    { icon: <Pill size={26} />, title: 'اكتشاف الأدوية', desc: 'محاكاة جزيئية كاملة — عقود بحث قد تصبح أياماً.' },
    { icon: <TrendingUp size={26} />, title: 'النمذجة المالية', desc: 'HSBC حسّنت توقعات التداول بنسبة 34% عام 2025.' },
    { icon: <Lock size={26} />, title: 'التشفير الكمي', desc: 'مفاتيح يضمنها قانون الفيزياء، لا خوارزميات.' },
    { icon: <Truck size={26} />, title: 'تحسين اللوجستيات', desc: 'Ford قلّصت وقت الجدولة من 30 دقيقة إلى أقل من 5.' },
  ] : [
    { icon: <Pill size={26} />, title: 'Drug Discovery', desc: 'Full molecular simulations — decades of research compressed to days.' },
    { icon: <TrendingUp size={26} />, title: 'Financial Modeling', desc: 'HSBC improved bond trading predictions by 34% in 2025.' },
    { icon: <Lock size={26} />, title: 'Quantum Cryptography', desc: 'Keys guaranteed by the laws of physics, not breakable math.' },
    { icon: <Truck size={26} />, title: 'Logistics Optimization', desc: 'Ford reduced scheduling time from 30 minutes to under 5.' },
  ];

  return (
    <div className="qc-page">
      <Navbar />

      <div className="particles-bg">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* HERO */}
      <section className="qc-hero">
        <QuantumLogo size={130} />
        <div className="qc-hero-eyebrow">{isAr ? 'الحوسبة الكمية' : 'Quantum Computing'}</div>
        <h1 className="qc-hero-title">
          {isAr
            ? <>{`الكم غيّر حتى `}<em>إكس-أو</em><br />{`تخيّل ما سيفعله بالبقية`}</>
            : <>{'Quantum changed even '}<em>Tic-Tac-Toe</em><br />{"Imagine what it'll do to everything else"}</>
          }
        </h1>
        <p className="qc-hero-sub">
          {isAr
            ? 'بنيت هذه اللعبة لإثبات نقطة: قوانين الكم يمكن لأي شخص تجربتها وفهمها.'
            : 'I built this game to prove one point: quantum laws can be experienced and understood by anyone.'}
        </p>
      </section>

      {/* WHAT IS QC */}
      <section className="qc-section qc-what">
        <div className="qc-container">
          <p className="qc-label">{isAr ? 'ما هي الحوسبة الكمية؟' : 'What is Quantum Computing?'}</p>
          <div className="qc-what-grid">
            <div>
              <h2 className="qc-what-headline">
                {isAr ? 'حواسيب تعمل بقوانين عالم مختلف تماماً' : 'Computers that run on the laws of a completely different world'}
              </h2>
              <p className="qc-what-body">
                {isAr
                  ? 'الكمبيوتر الكلاسيكي يعمل بالبتات — إما صفر أو واحد. الكمبيوتر الكمي يعمل بالكيوبتات التي يمكن أن تكون الاثنين في آنٍ واحد، مما يجعله يعالج ملايين الاحتمالات دفعة واحدة.'
                  : 'Classical computers work with bits — 0 or 1. Quantum computers work with qubits that can be both at once, enabling them to process millions of possibilities simultaneously rather than one by one.'}
              </p>
              <p className="qc-what-body">
                {isAr
                  ? 'مسائل تستغرق على أقوى الحواسيب الكلاسيكية أعمار الكون يمكن حلها في دقائق.'
                  : 'Problems that would take classical supercomputers longer than the age of the universe can be solved in minutes.'}
              </p>
            </div>
            <div className="qc-what-compare">
              <div className="qc-cmp-card">
                <span className="qc-cmp-tag">{isAr ? 'كلاسيكي' : 'Classical'}</span>
                <div className="qc-bits">
                  <div className="qc-bit">0</div>
                  <span>{isAr ? 'أو' : 'or'}</span>
                  <div className="qc-bit">1</div>
                </div>
                <p>{isAr ? 'احتمال واحد في كل مرة' : 'One possibility at a time'}</p>
              </div>
              <Zap size={20} className="qc-cmp-vs" />
              <div className="qc-cmp-card qc-cmp-q">
                <span className="qc-cmp-tag qc-cmp-tag-q">{isAr ? 'كمي' : 'Quantum'}</span>
                <div className="qc-qubit-box">
                  <span>0</span><span className="qc-plus">+</span><span>1</span>
                </div>
                <p>{isAr ? 'ملايين الاحتمالات معاً' : 'Millions of possibilities at once'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="qc-section qc-principles">
        <div className="qc-container qc-principles-inner">
          <p className="qc-label">{isAr ? '٣ مفاهيم تغير كل شيء' : '3 concepts that change everything'}</p>
          <p className="qc-sublabel">
            {isAr ? 'وكيف تجدها مجسّدة في لعبة إكس-أو الكمية' : 'And how you can see them in Quantum Tic-Tac-Toe'}
          </p>

          <div className="qc-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`qc-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                style={activeTab === tab.key ? { '--tc': tabContent[tab.key].color } : {}}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          <div className="qc-panel" key={activeTab}>
            <div className="qc-panel-left">
              <h3 style={{ color: tabContent[activeTab].color }}>{tabContent[activeTab].headline}</h3>
              <p className="qc-panel-body">{tabContent[activeTab].body}</p>
              <div className="qc-game-note" style={{ '--nc': tabContent[activeTab].color }}>
                <span className="qc-note-tag"><Gamepad2 size={12} />{isAr ? 'في لعبتنا' : 'In our game'}</span>
                <p>{tabContent[activeTab].gameNote}</p>
              </div>
            </div>
            <div className="qc-panel-right">
              <div className="qc-anim-box" style={{ '--ac': tabContent[activeTab].color }}>
                {tabContent[activeTab].animation}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENTAL SHIFT */}
      <section className="qc-section qc-shifts">
        <div className="qc-container qc-shifts-inner">
          <p className="qc-label">{isAr ? 'كيف يغيّر هذا طريقة تفكيرك' : 'How this changes the way you think'}</p>
          <p className="qc-sublabel">
            {isAr
              ? 'فهم الكم يتطلب التخلي عن بعض أساسيات التفكير الكلاسيكي'
              : 'Understanding quantum requires unlearning some classical thinking fundamentals'}
          </p>
          <p className="qc-shifts-text">
            {shifts.map((s, i) => (
              <span key={i}>
                <span className="qc-shift-from">{s.from}</span>
                <span className="qc-shift-arrow"> → </span>
                <span className="qc-shift-to">{s.to}</span>
                <span className="qc-shift-desc"> — {s.desc}</span>
                {i < shifts.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* INSIDE QC */}
      <section className="qc-section qc-inside">
        <div className="qc-container">
          <p className="qc-label">{isAr ? 'داخل الكمبيوتر الكمي' : 'Inside a Quantum Computer'}</p>
          <p className="qc-sublabel">
            {isAr ? 'الهيكل العملاق ليس الكمبيوتر — إنه يحافظ فقط على برودة الشريحة الصغيرة' : "The giant structure isn't the computer — it just keeps the tiny chip cold"}
          </p>
          <div className="qc-inside-grid">
            {[
              {
                img: googleQuantumImg, icon: <Snowflake size={20} />,
                title: isAr ? 'نظام التبريد' : 'Cooling System', cls: '',
                points: isAr
                  ? ['بحجم غرفة كاملة — 3 أمتار ارتفاعاً', 'يبرد إلى -273°C، أبرد من الفضاء بـ 100 مرة', 'أي اهتزاز صغير يدمر الحسابات']
                  : ['Size of a room — 3 meters tall', 'Cools to -273°C — 100x colder than space', 'Any tiny vibration destroys calculations']
              },
              {
                img: googleWillowImg, icon: <Microchip size={20} />,
                title: isAr ? 'الشريحة الكمية' : 'Quantum Chip', cls: 'qc-inside-green',
                points: isAr
                  ? ['بحجم ظفر الإصبع — هذا هو الكمبيوتر الحقيقي', '50 إلى 1000+ كيوبت', 'الكيوبتات تعيش ميكروثواني فقط']
                  : ['Size of a fingernail — this IS the actual computer', '50 to 1000+ qubits', 'Qubits survive only microseconds']
              }
            ].map((card, i) => (
              <div key={i} className={`qc-inside-card ${card.cls}`}>
                <div className="qc-inside-img"><img src={card.img} alt={card.title} /></div>
                <div className="qc-inside-body">
                  <div className="qc-inside-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <ul>{card.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
          <div className="qc-insight">
            <Lightbulb size={16} />
            <p>{isAr
              ? 'الهيكل الذهبي العملاق موجود فقط لحماية الشريحة الصغيرة. بدون التبريد الشديد، تفقد الكيوبتات خصائصها الكمية في أجزاء من الثانية!'
              : 'The giant golden structure exists only to protect the tiny chip inside. Without extreme cooling, qubits lose their quantum properties in microseconds!'}
            </p>
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="qc-section qc-apps">
        <div className="qc-container">
          <p className="qc-label">{isAr ? 'تطبيقات واقعية' : 'Real-world applications'}</p>
          <div className="qc-apps-grid">
            {apps.map((app, i) => (
              <div key={i} className="qc-app-card">
                <div className="qc-app-icon">{app.icon}</div>
                <h3>{app.title}</h3>
                <p>{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="qc-section qc-cta">
        <div className="qc-container">
          <div className="qc-cta-box">
            <h2>{isAr ? 'لا تقرأ عن ميكانيكا الكم — العبها' : "Don't read about quantum mechanics — play it"}</h2>
            <p>{isAr
              ? 'كل حركة تُجسّد التراكب. كل مربع مشترك يُنشئ تشابكاً. كل دورة تُجبرك على الانهيار.'
              : 'Every move embodies superposition. Every shared square creates entanglement. Every cycle forces collapse.'}
            </p>
            <button onClick={() => navigate('/how-to-play')}>
              <Gamepad2 size={16} />
              {isAr ? 'تعلم كيفية اللعب' : 'Learn How to Play'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QuantumComputing;