from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import nest_asyncio
import uvicorn

nest_asyncio.apply()

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise EnvironmentError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

app = FastAPI(title="Stock Selling Recommendations API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class Stock(BaseModel):
    symbol: str
    current_price: float
    quantity: int
    next_day_change: float
    next_week_change: float
    next_month_change: float

class SellingRequest(BaseModel):
    stocks: List[Stock]
    cash_needed: float = Field(..., description="Amount of cash needed in USD")

class RecommendationItem(BaseModel):
    symbol: str
    shares_to_sell: float
    expected_cash: float
    reasoning: str

class Recommendation(BaseModel):
    recommendations: List[RecommendationItem]
    total_cash_generated: float
    strategy_explanation: str

def clean_json_response(response_text: str) -> str:
    """Clean the JSON response from Gemini."""
    if response_text.startswith('json'):
        response_text = response_text[4:]
    return response_text.strip('`').strip()

@app.post("/api/recommendations", response_model=List[Recommendation])
async def get_selling_recommendations(request: SellingRequest):
    """Generate selling recommendations for stocks."""

    # Construct the prompt
    prompt = f"""You are a stock portfolio optimization expert. I need to generate ${request.cash_needed:,.2f} in cash by selling some underperforming stocks.

Here are my stocks that are predicted to decline:

"""
    # Add stocks to prompt
    for stock in request.stocks:
        prompt += f"""
        Stock: {stock.symbol}
        Current Price: ${stock.current_price:.2f}
        Shares Owned: {stock.quantity}
        Current Total Value: ${stock.current_price * stock.quantity:,.2f}
        Predicted Changes:
        - Tomorrow: {stock.next_day_change:.1f}%
        - Next Week: {stock.next_week_change:.1f}%
        - Next Month: {stock.next_month_change:.1f}%
        """

    prompt += f"""
Please analyze these stocks and tell me:
1. Which stocks I should sell
2. How many shares of each to sell (can be partial/in decimal)
3. Why you made these recommendations

Return ONLY text in the format of a JSON file as shown below. Make 2 versions. The 1st version would have less variability (focusing on selling more of the worst stocks), and the 2nd version would have more variability (focusing on selling a mix of stocks):
{{
    "recommendations": [
        {{
            "symbol": "STOCK_SYMBOL",
            "shares_to_sell": number,
            "expected_cash": number,
            "reasoning": "brief explanation"
        }}
    ],
    "total_cash_generated": number,
    "strategy_explanation": "brief overall explanation"
}}

Make sure the total_cash_generated meets or slightly exceeds ${request.cash_needed:,.2f}.
Prioritize selling stocks with the worst long-term outlook."""

    try:
        # Generate response using Gemini
        response = model.generate_content(prompt)

        if not hasattr(response, 'text'):
            raise HTTPException(status_code=500, detail="Empty response received from Gemini")

        # Clean and parse the response
        cleaned_response = clean_json_response(response.text)

        # Extract JSON objects using regex
        import re
        json_pattern = r'\{(?:[^{}]|(?:\{[^{}]*\}))*\}'
        json_blocks = re.findall(json_pattern, cleaned_response, re.DOTALL)

        # Parse JSON blocks
        recommendations = []
        for block in json_blocks:
            try:
                parsed_json = json.loads(block)
                recommendations.append(parsed_json)
            except json.JSONDecodeError as e:
                print(f"Failed to decode JSON block: {e}")
                continue

        if not recommendations:
            raise HTTPException(status_code=500, detail="Failed to parse any valid recommendations")

        return recommendations

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

def start_server():
    """Function to start the server"""
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    start_server()
