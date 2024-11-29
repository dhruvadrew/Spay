# SPay: Let Your Stocks Do the Paying

## Project Overview

SPay is a revolutionary payment system that leverages the power of stock trading to provide users with instant spending power.  Instead of relying on credit cards, SPay intelligently identifies and sells underperforming stocks in real-time to cover purchases. This innovative approach streamlines personal finance by dynamically utilizing existing investments. SPay integrates with user portfolios, offering a secure and efficient way to access funds for everyday spending. The system uses a sophisticated predictive analytics engine, powered by an LSTM time-series forecasting model and a Retrieval Augmented Generation (RAG) framework built on Google Gemini, to make optimized selling decisions.

## Main Features and Functionality

* **Real-time Stock Valuation and Prediction:** SPay utilizes an LSTM model trained on historical stock data to predict short-term and long-term price movements. This model predicts price trends for multiple time horizons (next day, next week, next month), allowing for informed selling decisions at checkout.

* **Automated Stock Sale at Checkout:** Integrated into the checkout process, SPay automatically identifies and sells the most appropriate underperforming stocks to cover the purchase amount.  The selection algorithm prioritizes minimizing risk and maximizing the utilization of underperforming assets.

* **Secure Portfolio Integration:** SPay integrates securely with the user's stock portfolio (simulated using the Capital One Nessie API for this project).  Authentication mechanisms ensure the safety and privacy of user data.

* **RAG-based Decision Making (Gemini):** A RAG-based framework using Google Gemini refines the stock selling decisions, considering a broader context and risk factors beyond just price predictions.  This intelligent system aims to optimize the selling strategy for the user's overall portfolio health.

* **FastAPI Backend:** A high-performance FastAPI backend provides real-time responses and ensures efficient transaction processing.

* **React Frontend:** A user-friendly React frontend provides a seamless user experience for browsing, selecting items, and completing purchases.


## Setup and Installation Instructions

This project consists of a backend (FastAPI) and a frontend (Create React App).  You'll need to set up both independently.

**Prerequisites:**

* Python 3.7+
* Node.js and npm
* A Google Cloud project with the Gemini API enabled (for the backend).  Obtain and set the `GEMINI_API_KEY` environment variable.
* A `.env` file containing `API_KEY` for the Capital One Nessie API (currently not functional in the provided code, replaced with simulated data).

**Backend (FastAPI):**

1. Clone the repository:  `git clone <repository_url>`
2. Navigate to the backend directory: `cd spay-app/backend`
3. Create a virtual environment: `python3 -m venv venv`
4. Activate the virtual environment:  `source venv/bin/activate` (Linux/macOS) or `venv\Scripts\activate` (Windows)
5. Install dependencies: `pip install -r requirements.txt`
6. Run the application: `uvicorn main:app --reload`


**Frontend (Create React App):**

1. Navigate to the frontend directory: `cd spay-app`
2. Install dependencies: `npm install`
3. Run the application: `npm start`

## Usage Guide

1. **Frontend:** The React application provides a store-like interface. Select items to purchase.  The checkout process will automatically initiate the backend's stock selling logic.

2. **Backend:** The FastAPI server handles stock prediction, portfolio integration (simulated), and transaction processing.  The `/getRecs` endpoint is crucial for generating stock selling recommendations. The `/sellStock` endpoint executes the sale, updating the simulated portfolio.  The backend uses a simulated dataset for stock data and customer accounts, as the provided Nessie API key is not functional within this code.

## Dependencies

**Backend (FastAPI):**

* `fastapi`
* `uvicorn`
* `requests`
* `yfinance`
* `python-dotenv`
* `google-generativeai`
* `pandas`
* `scikit-learn`
* `tensorflow`
* `keras`
* `numpy`
* `matplotlib`


**Frontend (Create React App):**

* `react`
* `react-dom`
* `react-router-dom`
* `react-icons`
* `@mui/material`
* and other dependencies listed in `package.json`


## How to Contribute

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your branch to your forked repository.
5. Create a pull request to the main repository.


**Important Notes:**

* The current implementation uses simulated data for stock prices and portfolio information due to limitations in accessing real-time data and the provided Nessie API key.  Integration with a real-world brokerage API would be required for a fully functional system.
* The Gemini API key is essential for running the stock recommendation functionality.  Ensure you have configured your Google Cloud project correctly and set the `GEMINI_API_KEY` environment variable.
* Error handling and robust security measures should be further implemented for a production-ready system.


This README provides a foundation for understanding the structure and functionality of the SPay project.  Further details can be found within the individual code files.
