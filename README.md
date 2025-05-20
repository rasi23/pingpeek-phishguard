![image](https://github.com/user-attachments/assets/1cd45030-f219-4e90-8579-14c8ff28f59a)![image](https://github.com/user-attachments/assets/29b19c32-9325-4f5e-ae95-a4fcb21eac41)# PhishGuard

## Overview
PhishGuard is an AI-powered phishing email detection system developed by Team Ping Peek (Eric, Farindu, Ashini, Viranga) for ThinkFest Hackathon 2025. With 92% accuracy, it analyzes emails in real-time (0.15s latency) using NLP and rule-based AI, protecting users from 88% of data breaches caused by phishing (IBM 2024). Features include:

- **Real-Time Detection**: Combines NLTK, scikit-learn, and VirusTotal API for 92% accuracy and 89% precision (10,000-email tests).
- **Interactive Dashboard**: React/TypeScript UI with a customizable security slider and visualizations (ROC Curve, Confusion Matrix).
- **Scalable Backend**: Python/Flask processes emails, with REST API planned for 2025.
- **Demo**: Try it at [phishing-threat-vision.lovable.app](https://phishing-threat-vision.lovable.app/).

## Technology Stack
- **Frontend**: React, TypeScript, Material-UI, Chart.js
- **Backend**: Python, Flask, NLTK, scikit-learn, VirusTotal API
- **Tools**: Lovable AI (UI design), GitHub Copilot (development), Jest (testing)
- **Deployment**: Vercel (frontend), local server (backend)

## Installation
### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Git
- VirusTotal API key (add to `backend/.env`)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rasi23/pingpeek-phishguard.git
   cd pingpeek-phishguard
   ```
2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Access at `http://localhost:5173`.
3. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   - Add VirusTotal API key to `backend/.env`:
     ```
     VIRUSTOTAL_API_KEY=your_api_key_here
     ```
   - Run:
     ```bash
     python main.py
     ```
   - Access at `http://localhost:5000`.
4. **Test Data**:
   - Place `.eml` files in `backend/emails/` for analysis (see `backend/emails/sample.eml`).

## Usage
1. **Run Application**:
   - Start frontend (`npm run dev`) and backend (`python main.py`).
   - Open `http://localhost:5173` in a browser.
2. **Analyze Emails**:
   - Upload an email or input text in the dashboard.
   - View verdict (e.g., “Phishing, 92% confidence”), rules triggered (e.g., “Suspicious Sender”), and visualizations.
   - Adjust the security slider to balance false positives (see demo: [phishing-threat-vision.lovable.app](https://phishing-threat-vision.lovable.app/)).
3. **Metrics**:
   - Accuracy: 92%, Precision: 89%, Recall: 90%, Latency: 0.15s (10,000-email tests).
   - See `docs/results.md` for detailed metrics and Confusion Matrix.

## Project Structure
```
pingpeek-phishguard/
├── frontend/                 # React/TypeScript UI
│   ├── src/
│   │   ├── components/       # StatsCard, ThreatChart, EmailList
│   │   ├── pages/            # DashboardPage, EmailAnalysis
│   │   └── App.tsx
├── backend/                  # Python/Flask backend
│   ├── emails/               # Sample .eml files
│   ├── detector.py           # Phishing detection logic
│   ├── main.py               # Flask app
│   └── .env                  # Environment variables
├── docs/                     # Results, architecture
└── README.md
```

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and report issues on [GitHub Issues](https://github.com/rasi23/pingpeek-phishguard/issues).

## Future Enhancements
- 2025: REST API for scalability.
- 2026: BERT for multilingual NLP and deeper detection.

## License
MIT License. See [LICENSE](LICENSE) for details.

## Contact
- Our Team:
             - RASINDU ILLANGRATHNE (Backend/UI UX Architect)
             - VIRANGA THULSHAN (ML Engineer)
             - ERICA DILSHANI (Frontend Developer)
             - ASHINI NANAYAKKARA (Security Researcher)
- GitHub: [github.com/rasi23/pingpeek-phishguard](https://github.com/rasi23/pingpeek-phishguard)
- Demo: [phishing-threat-vision.lovable.app](https://phishing-threat-vision.lovable.app/)
