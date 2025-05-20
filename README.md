
# 🛡️ PhishGuard – Real-Time Phishing Detection

PhishGuard is an AI-powered phishing email detection system developed by **Team Ping Peek** (Rasindu, Viranga, Erica, Ashini) for the **ThinkFest Hackathon 2025**. It leverages NLP, rule-based AI, and VirusTotal analysis to identify phishing attempts with **92% accuracy** in **0.15 seconds**, helping mitigate the 88% of data breaches caused by phishing (IBM, 2024).

🔗 **Live Demo**: [phishing-threat-vision.lovable.app](https://phishing-threat-vision.lovable.app/)

---

## 🚀 Key Features

- **🔍 Real-Time Detection**  
  Combines NLTK, scikit-learn, and VirusTotal API for high-precision threat analysis.

- **📊 Interactive Dashboard**  
  Built with React & TypeScript, featuring an adjustable security threshold and intuitive data visualizations.

- **⚙️ Scalable Python Backend**  
  Flask-powered backend processes `.eml` files, with a REST API coming soon.

---

## 🧠 Tech Stack

| Layer       | Technologies Used                                      |
|-------------|--------------------------------------------------------|
| **Frontend** | React, TypeScript, Material-UI, Chart.js               |
| **Backend**  | Python, Flask, scikit-learn, NLTK, VirusTotal API      |
| **Tools**    | Lovable AI (UI design), GitHub Copilot, Jest (testing) |
| **Deploy**   | Vercel (Frontend), Localhost (Backend)                 |

---

## 📦 Installation

### ✅ Prerequisites
- Node.js v18+
- Python 3.9+
- Git
- VirusTotal API Key

### 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/rasi23/pingpeek-phishguard.git
cd pingpeek-phishguard
```

#### 🔧 Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

#### 🐍 Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
VIRUSTOTAL_API_KEY=your_api_key_here
```

Then run:

```bash
python main.py
# API runs on http://localhost:5000
```

---

## 🧪 Usage Guide

1. **Start the app**: Run both frontend and backend.
2. **Upload or input email**: Use the dashboard to analyze.
3. **View results**:
   - Classification (e.g., "Phishing – 92% confidence")
   - Triggered rules (e.g., "Suspicious Sender")
   - Visualizations (ROC curve, confusion matrix)
4. **Adjust detection sensitivity** using the interactive security slider.

📂 To test, add `.eml` files in: `backend/emails/`  
🧾 Example file: `backend/emails/sample.eml`

---

## 📊 Performance Metrics

| Metric     | Value       |
|------------|-------------|
| Accuracy   | 92%         |
| Precision  | 89%         |
| Recall     | 90%         |
| Latency    | 0.15 sec    |

📄 Detailed results in [`docs/results.md`](docs/results.md)

---

## 📁 Project Structure

```plaintext
pingpeek-phishguard/
├── frontend/       # React UI
│   └── src/
│       ├── components/  # StatsCard, ThreatChart, etc.
│       ├── pages/       # Dashboard, EmailAnalysis
│       └── App.tsx
├── backend/        # Flask backend
│   ├── emails/     # Test email files
│   ├── detector.py # Detection logic
│   └── main.py     # Flask app entry
├── docs/           # Metrics, architecture docs
└── README.md
```

---

## 🤝 Contributing

We welcome contributions from the community!

1. Fork the repo
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes & commit:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push and open a pull request:
   ```bash
   git push origin feature/your-feature
   ```

🔖 Please review our [Code of Conduct](CODE_OF_CONDUCT.md) and use [GitHub Issues](https://github.com/rasi23/pingpeek-phishguard/issues) for reporting bugs or suggestions.

---

## 🧭 Roadmap

- ✅ Real-time detection with rule-based + ML
- 🛠️ **2025**: REST API integration for broader compatibility
- 🌍 **2026**: Multilingual phishing detection using BERT

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for full terms.

---

## 👥 Team Ping Peek

| Name                 | Role                         |
|----------------------|------------------------------|
| Rasindu Illangaratne | Backend / UI-UX Architect    |
| Viranga Thulshan     | ML Engineer                  |
| Erica Dilshani       | Frontend Developer           |
| Ashini Nanayakkara   | Security Researcher          |

🔗 GitHub: [rasi23/pingpeek-phishguard](https://github.com/rasi23/pingpeek-phishguard)  
🌐 Demo: [phishing-threat-vision.lovable.app](https://phishing-threat-vision.lovable.app/)
