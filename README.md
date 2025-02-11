# SPay: Let Your Stocks Do the Paying
Developed by Ahbab Abeer, Ahmad Choudhary, Dhruva Barua, and Islam Tayeb for HackNC.

## Project Overview
SPay is a payment system leveraging stock trading for instant spending power.  Instead of credit cards, SPay sells underperforming stocks to cover purchases, dynamically utilizing existing investments.  It integrates with user portfolios (simulated using the Capital One Nessie API) for secure fund access.  A predictive analytics engine, using an LSTM time-series forecasting model and a Retrieval Augmented Generation (RAG) framework built on Google Gemini, optimizes selling decisions.

## Features
* **Real-time Stock Valuation and Prediction:**  LSTM model predicts short-term and long-term price movements for informed selling decisions.
* **Automated Stock Sale at Checkout:** Automatically identifies and sells underperforming stocks to cover purchases, minimizing risk.
* **Secure Portfolio Integration:** Secure integration with user's stock portfolio (simulated).
* **RAG-based Decision Making (Gemini):** RAG framework using Google Gemini refines stock selling decisions, considering broader context and risk factors.
* **FastAPI Backend:** High-performance FastAPI backend for real-time responses and efficient transaction processing.
* **React Frontend:** User-friendly React frontend for a seamless user experience.

## Usage
1. **Frontend:** Select items; checkout initiates backend's stock selling logic.
2. **Backend:** Handles stock prediction, simulated portfolio integration, and transaction processing.  The `/getRecs` endpoint generates stock selling recommendations, and `/sellStock` executes sales.

## Installation
This project has a FastAPI backend and a Create React App frontend.

**Prerequisites:**

* Python 3.7+
* Node.js and npm
* Google Cloud project with the Gemini API enabled. Set the `GEMINI_API_KEY` environment variable.
* `.env` file with `API_KEY` for the Capital One Nessie API (currently simulated).

**Backend (FastAPI):**

1. `git clone <repository_url>`
2. `cd spay-app/backend`
3. `python3 -m venv venv`
4. `source venv/bin/activate` (Linux/macOS) or `venv\Scripts\activate` (Windows)
5. `pip install fastapi uvicorn requests yfinance python-dotenv google-generativeai pandas scikit-learn tensorflow keras numpy matplotlib`
6. `uvicorn main:app --reload`

**Frontend (Create React App):**

1. `cd spay-app`
2. `npm install`
3. `npm start`

## Technologies Used
* **Python:** Backend logic, LSTM model, data processing.
* **FastAPI:** High-performance, efficient API framework for the backend.
* **React:** Frontend development for user interface.
* **Google Gemini:**  RAG framework for enhanced decision-making.
* **LSTM (Long Short-Term Memory):** Recurrent neural network for time-series forecasting of stock prices.
* **yfinance:**  For fetching simulated stock data (would integrate with a real brokerage API in a production environment).
* **pandas, scikit-learn, tensorflow, keras, numpy, matplotlib:** Data manipulation, machine learning, and visualization libraries.
* **Capital One Nessie API (Simulated):**  Simulated API for portfolio integration (would require a real brokerage API in production).

## Statistical Analysis
The backend utilizes an LSTM model trained on historical stock data (currently simulated) to predict short-term and long-term price movements.  The model's predictions are used to identify underperforming stocks for sale. The `gemini.ipynb` notebook demonstrates the Gemini API integration for refining these decisions.

## Configuration
* **Backend:** Requires setting `GEMINI_API_KEY` and using a `.env` file for API keys.
* **Frontend:**  Uses Create React App's default configuration.

## API Documentation
**Backend Endpoints:**

* `/getRecs`:  GET request.  Requires `id` (customer ID) and `moneyNeeded` (amount of money to generate). Returns JSON with stock selling recommendations.
* `/sellStock`: POST request.  Requires `id` (customer ID), `product` (purchase price), and a JSON payload containing selling recommendations. Executes the sale and updates the simulated portfolio.

*README.md was made with [Etchr](https://etchr.dev)*