"""
Real-Time Crop Recommendation (XGBoost)
---------------------------------------
Takes temperature and humidity from API and predicts the best crop.

Author: Your Name
Date: 2025-09-13
"""

import pandas as pd
import numpy as np
import warnings
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")

def train_crop_model(data_path="Crop_recommendation.csv"):
    # Load dataset
    df = pd.read_csv(data_path)

    # Features: only temperature and humidity
    X = df[['temperature', 'humidity']]
    y = df['label']

    # Encode target
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    # Hyperparameter grid
    param_grid = {
        "n_estimators": [100, 300, 500, 800],
        "max_depth": [3, 4, 5, 6],
        "learning_rate": [0.01, 0.05, 0.1],
        "subsample": [0.8, 1.0],
        "colsample_bytree": [0.8, 1.0],
        "gamma": [0, 1],
        "reg_alpha": [0, 0.1],
        "reg_lambda": [1, 2],
        "min_child_weight": [1, 3]
    }

    # Initialize model
    xgb = XGBClassifier(
        objective="multi:softmax",
        num_class=len(np.unique(y_encoded)),
        random_state=42,
        use_label_encoder=False,
        eval_metric="mlogloss"
    )

    # RandomizedSearchCV
    random_search = RandomizedSearchCV(
        estimator=xgb,
        param_distributions=param_grid,
        n_iter=15,
        scoring="accuracy",
        cv=3,
        verbose=1,
        random_state=42,
        n_jobs=-1
    )

    # Fit model
    random_search.fit(X_train, y_train)

    # Evaluate
    y_pred = random_search.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc:.3f}")

    return random_search.best_estimator_, le

def predict_crop(model, label_encoder, temperature, humidity):
    # Prepare input
    input_df = pd.DataFrame({'temperature': [temperature], 'humidity': [humidity]})
    
    # Predict
    pred_encoded = model.predict(input_df)[0]
    pred_label = label_encoder.inverse_transform([pred_encoded])[0]
    
    return pred_label

if __name__ == "__main__":
    # Train model (one-time, can be saved to disk later)
    model, le = train_crop_model()

    # Example: API gives these values
    api_temperature = 30
    api_humidity = 85

    predicted_crop = predict_crop(model, le, api_temperature, api_humidity)
    print(f"Recommended Crop: {predicted_crop}")
