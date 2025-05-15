import sys
from pathlib import Path
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
import joblib
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class FeatureExtractor:
    def extract_all_features(self, email_data):
        text = f"{email_data.get('subject', '')} {email_data.get('body', '')}"
        features = {
            'text': text,
            'subject_length': len(email_data.get('subject', '')),
            'num_urls': len(email_data.get('urls', [])),
            'has_urgent': int('urgent' in text.lower())
        }
        return str(features)

def main():
    script_dir = Path(__file__).parent
    data_path = script_dir.parent.parent / "backend/data/training/emails_dataset.csv"
    model_path = script_dir.parent.parent / "backend/data/models/phishing_model.pkl"
    
    model_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        df = pd.read_csv(data_path)
        logger.info(f"Loaded dataset with {len(df)} records")
    except FileNotFoundError:
        logger.error(f"Could not find dataset at {data_path}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        sys.exit(1)

    required_columns = {'subject', 'body', 'is_phishing'}
    if not required_columns.issubset(df.columns):
        logger.error(f"Dataset missing required columns: {required_columns - set(df.columns)}")
        sys.exit(1)

    extractor = FeatureExtractor()
    X = df.apply(lambda row: extractor.extract_all_features({
        "subject": row["subject"],
        "body": row["body"],
        "urls": []
    }), axis=1)
    y = df["is_phishing"]

    logger.info("Training model...")
    model = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    model.fit(X, y)

    joblib.dump(model, model_path)
    logger.info(f"Model saved to: {model_path}")

if __name__ == "__main__":
    main()