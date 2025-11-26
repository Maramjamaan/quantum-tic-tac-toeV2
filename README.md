# Quantum Tic-Tac-Toe ⚛️
### لعبة إكس-أو الكمية

<div align="center">

![Quantum Game](https://img.shields.io/badge/Quantum-Game-blue?style=for-the-badge&logo=atom)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python)
![Qiskit](https://img.shields.io/badge/Qiskit-0.45-6929C4?style=for-the-badge)

**An educational quantum computing game based on Allan Goff's research paper**

[English](#english) | [العربية](#arabic)

</div>

---

<a name="english"></a>
## 🇬🇧 English

### 📖 About

Quantum Tic-Tac-Toe is an educational tool that brings quantum mechanics concepts to life through interactive gameplay. Unlike classical tic-tac-toe where you place one mark in one square, here each move exists in **two squares simultaneously** until measurement forces it to "collapse" to a single position.

This project implements the complete ruleset from **Allan Goff's research paper**, including:
- ✅ Quantum Superposition
- ✅ Quantum Entanglement
- ✅ Cyclic Entanglement Detection
- ✅ Collapse Mechanism with Player Choice
- ✅ Stems (branches) Auto-collapse
- ✅ Simultaneous Wins Scoring System

---

### 🎮 How to Play

#### Basic Rules:

1. **Quantum Moves**: Each turn, select **2 squares**. Your mark exists in both simultaneously (superposition).

2. **Entanglement**: When moves share a square, they become entangled - their fates are connected.

3. **Cycles & Collapse**: When entanglements form a closed loop (cycle), all involved moves must collapse. The player who **didn't** create the cycle chooses how.

4. **Winning**: Get 3 **classical** (collapsed) marks in a row. Quantum marks don't count!

#### Advanced Rules:

5. **Stems**: Moves entangled with a cycle but not part of it collapse automatically to their only available square.

6. **Simultaneous Wins**: If both players get 3-in-a-row after collapse, the player whose winning line contains the **earliest move** (lowest subscript) wins with 1 point; the other gets ½ point.

---

### 🔬 Quantum Concepts Demonstrated

| Concept | In Physics | In Game |
|---------|-----------|---------|
| **Superposition** | Particle exists in multiple states | Mark in 2 squares at once |
| **Entanglement** | Connected particles affect each other | Shared squares link moves |
| **Measurement** | Observation collapses superposition | Cycle forces collapse |
| **Collapse** | State becomes definite | Mark settles in one square |

---

### 🛠️ Installation & Setup

#### Prerequisites

```bash
# Node.js 14+
node --version

# Python 3.8+
python --version
```

#### Backend Setup

```bash
cd python
pip install -r requirements.txt
python api.py
```
Backend runs on: `http://localhost:8000`

#### Frontend Setup

```bash
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

---

### 📁 Project Structure

```
quantum-tic-tac-toe/
├── python/                     # Backend
│   ├── api.py                  # FastAPI REST API
│   ├── quantum_game.py         # Game engine with Qiskit
│   └── requirements.txt        # Python dependencies
├── src/                        # Frontend
│   ├── components/             # React components
│   │   ├── QuantumTicTacToe.jsx
│   │   ├── GuidePanel/         # Smart guide panel
│   │   └── GameBoard/          # Game board
│   ├── hooks/                  # Custom hooks
│   │   ├── useGameState.js     # Game state management
│   │   └── useQuantumAPI.js    # API communication
│   ├── contexts/               # React contexts
│   │   └── LanguageContext.jsx # i18n support
│   ├── translations/           # Language files
│   │   ├── en.json             # English
│   │   └── ar.json             # Arabic
│   └── types/                  # Type definitions
│       └── gameTypes.js
├── public/                     # Static assets
└── README.md
```

---

### 🔧 Technical Implementation

#### Quantum Circuit (Qiskit)

```python
# Each quantum move creates a real quantum circuit
circuit = QuantumCircuit(1, 1)
circuit.h(0)  # Hadamard gate - creates superposition
circuit.measure(0, 0)  # Measurement
```

#### Cycle Detection Algorithm

Uses **Depth-First Search (DFS)** on the entanglement graph to detect cycles:

```python
def _check_for_cycles(self) -> Tuple[bool, List[str]]:
    # Build graph from entanglements
    # DFS with path tracking
    # Return (has_cycle, cycle_moves)
```

#### Collapse Options Generation

Uses **Backtracking Algorithm** to generate all valid collapse combinations:

```python
def generate_collapse_options(self, max_options=5, cycle_moves=None):
    # Recursive backtracking
    # Diversity selection for best options
```

---

### 🌐 Features

- 🎮 Interactive quantum gameplay
- 🌍 Bilingual support (English/Arabic)
- 📱 Responsive design
- 🎨 Modern UI with quantum-themed styling
- 📊 Real-time game statistics
- 🎓 Educational smart guide
- ⚡ Real quantum circuits with Qiskit

---

### 📚 References

- **Allan Goff** - "Quantum Tic-Tac-Toe: A Teaching Metaphor for Superposition in Quantum Mechanics"
- **IBM Qiskit** - [qiskit.org](https://qiskit.org/)

---

### 👩‍💻 Author

**Maram Jamaan**  
Information Technology Student  
Graduation Project - 2025

[![GitHub](https://img.shields.io/badge/GitHub-Maramjamaan-181717?style=flat&logo=github)](https://github.com/Maramjamaan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-maram--jamaan-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/maram-jamaan)

---

<a name="arabic"></a>
## 🇸🇦 العربية

### 📖 عن المشروع

لعبة إكس-أو الكمية هي أداة تعليمية تجسد مفاهيم ميكانيكا الكم من خلال لعبة تفاعلية. على عكس اللعبة التقليدية حيث تضع علامة في مربع واحد، هنا كل حركة توجد في **مربعين في نفس الوقت** حتى يجبرها القياس على "الانهيار" إلى موقع واحد.

هذا المشروع يطبق جميع قواعد **ورقة Allan Goff البحثية**، بما في ذلك:
- ✅ التراكب الكمي (Superposition)
- ✅ التشابك الكمي (Entanglement)
- ✅ كشف التشابك الدوري (Cycles)
- ✅ آلية الانهيار مع اختيار اللاعب
- ✅ الفروع (Stems) والانهيار التلقائي
- ✅ نظام نقاط الفوز المتزامن

---

### 🎮 طريقة اللعب

#### القواعد الأساسية:

1. **الحركات الكمية**: كل دور، اختر **مربعين**. علامتك توجد في كليهما معاً (تراكب).

2. **التشابك**: عندما تشترك حركتان في مربع، تصبحان متشابكتين - مصيرهما مرتبط.

3. **الدورات والانهيار**: عندما تشكل التشابكات حلقة مغلقة (دورة)، جميع الحركات المتورطة تنهار. اللاعب الذي **لم** يُنشئ الدورة هو من يختار كيفية الانهيار.

4. **الفوز**: احصل على 3 علامات **كلاسيكية** (منهارة) في صف. العلامات الكمية لا تُحتسب!

#### القواعد المتقدمة:

5. **الفروع (Stems)**: الحركات المتشابكة مع الدورة لكن ليست جزءاً منها تنهار تلقائياً في مربعها الوحيد المتاح.

6. **الفوز المتزامن**: إذا حصل كلا اللاعبين على 3 في صف بعد الانهيار، الفائز هو صاحب الثلاثية التي تحتوي على **الحركة الأقدم** (الرقم الأصغر) بنقطة كاملة؛ والآخر يحصل على ½ نقطة.

---

### 🔬 المفاهيم الكمية المُوضَّحة

| المفهوم | في الفيزياء | في اللعبة |
|---------|-------------|-----------|
| **التراكب** | الجسيم موجود في حالات متعددة | العلامة في مربعين معاً |
| **التشابك** | الجسيمات المتصلة تؤثر على بعضها | المربعات المشتركة تربط الحركات |
| **القياس** | الملاحظة تُنهي التراكب | الدورة تُجبر الانهيار |
| **الانهيار** | الحالة تصبح محددة | العلامة تستقر في مربع واحد |

---

### 🛠️ التثبيت والإعداد

#### المتطلبات

```bash
# Node.js 14+
node --version

# Python 3.8+
python --version
```

#### إعداد الـ Backend

```bash
cd python
pip install -r requirements.txt
python api.py
```
يعمل على: `http://localhost:8000`

#### إعداد الـ Frontend

```bash
npm install
npm start
```
يعمل على: `http://localhost:3000`

---

### 🎓 مشروع تخرج

هذا المشروع هو جزء من متطلبات التخرج لبرنامج تقنية المعلومات.

**الهدف**: تعليم مفاهيم الحوسبة الكمية بطريقة تفاعلية وممتعة.

---

### 👩‍💻 المطورة

**مرام جمعان**  
طالبة تقنية المعلومات  
مشروع التخرج - 2025

---

## 📄 License

This project is for educational purposes as part of a graduation project.

---

<div align="center">

**Made with ❤️ for quantum computing education**

⚛️ 🎮 🎓

</div>