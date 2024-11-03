from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import yfinance as yf

from .models import Account, DebitAccount, StockRec, Recommendations

capitalKey = "e771edccbc20793962729f6c3dd26599"
accountId = "67271aa19683f20dd518b2a3"
customerId = "6726e6dd9683f20dd518b2a2"

STOCKMAP = {
    "6726e6dd9683f20dd518b2a2": {
        "INFY": 50,
        "COF": 30,
        "BAND": 20,
        "AAPL": 15,
        "MSFT": 10,
        "AMZN": 5,
        "GOOGL": 8,
        "TSLA": 12,
        "META": 7,
        "NVDA": 25
    }
}

#IF WE WANT TO ALLOW USERNAME PASSWORD TO AUTHENTICATE
dummyMap = {("username", "password"), "6726e6dd9683f20dd518b2a2"}

app = FastAPI(
    title = "CRUD app for posts",
    description="Yippee"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}



@app.get("/")
async def landing():
    return {"message": "Home Page"}\
    

@app.get("/allCustomers")
async def allCustomers():
    # Make the GET request
    url = "http://api.nessieisreal.com/customers"
    response = requests.get(f"{url}?key={capitalKey}")

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()

        for x in data:
            person = Account(**x)
            print(person)

            #just store username and password linkiing to account ID just in case we want to allow it
            pass

        return data
    else:
        return {"message": "No Customer or Error"}
    

@app.get("/customerById/{id}")
async def customerById(id: str):
    # Make the GET request
    url = "http://api.nessieisreal.com/customers/" + id
    response = requests.get(f"{url}?key={capitalKey}")

    # Check if the request was successful
    if response.status_code == 200:
        x = response.json()
        person = Account(**x)
        print(person)
        return person
    
    else:
        return {"message": "No Customer or Error"}
    

@app.get("/stockByCustomerId/{id}")
async def stockByCustomerId(id: str):
    
    if id not in STOCKMAP:
        return {"message": "No Customer or Error"}
    

    # Fetch stock data using Yahoo Finance
    def stockPrice(ticker):
        stock = yf.Ticker(ticker)
    
        intraday_data = stock.history(period="1d", interval="1m")  # 1-minute interval data

        latest_price = intraday_data['Close'].iloc[-1]  # Get the last closing price
        latest_time = intraday_data.index[-1]  # Get the timestamp of the last price
        return latest_price
    

    OUTPUT = []
    for t, q in STOCKMAP[id].items():
        name = t
        price = stockPrice(name)
        quanity = q                       
        total = quanity * price

        OUTPUT.append({
            "ticker": name,
            "current_price": price,
            "quantity_owned": quanity,
            "total_value": total
        })

    return OUTPUT


    
@app.get("/accountByAccountId/{id}")
async def accountByAccountId(id: str):
    # Make the GET request
    url = " http://api.nessieisreal.com/accounts/" + id
    response = requests.get(f"{url}?key={capitalKey}")

    # Check if the request was successful
    if response.status_code == 200:
        x = response.json()
        account = DebitAccount(**x)
        print(account)
        return account
    
    else:
        return {"message": "No Customer or Error"}
    

@app.get("/accountByCustomerId/{id}")
async def accountByCustomerId(id: str):
    # Make the GET request
    url = "http://api.nessieisreal.com/customers/" + id + "/accounts"
    response = requests.get(f"{url}?key={capitalKey}")

    # Check if the request was successful
    if response.status_code == 200:
        x = response.json()
        print(x)
        accounts = [DebitAccount(**account) for account in x]
        
        return accounts
    
    else:
        return {"message": "No Customer or Error"}
    


@app.get("/getAll/{id}")
async def getAll(id: str):
    #get customer data
    customer = await customerById(id)

    #get account data
    accounts = await accountByCustomerId(id)

    #get stock data
    stocks = await stockByCustomerId(id)

    print(customer)
    print(accounts)
    print(stocks)

    return {
        "customer": customer,
        "accounts": accounts,
        "stocks": stocks
    }


    


#GET recs
import os
import re
import json
from dotenv import load_dotenv
from tqdm import tqdm
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-pro")

def clean_json_response(response_text):
    if response_text.startswith('json'):
        response_text = response_text[4:]

    # Remove any markdown code block markers
    response_text = response_text.strip('`')

    # Remove any leading/trailing whitespace
    response_text = response_text.strip()

    return response_text

def get_selling_recommendations(stocks, cash_needed, x=3):
    # Initialize the prompt
    prompt = f"""You are a stock portfolio optimization expert. I need to generate ${cash_needed:,.2f} in cash by selling some underperforming stocks.

Here are my stocks that are predicted to decline:

"""
    # Progress bar for processing each stock
    for stock in tqdm(stocks, desc="Adding stocks to prompt"):
        prompt += f"""
        Stock: {stock['symbol']}
        Current Price: ${stock['current_price']:.2f}
        Shares Owned: {stock['quantity']}
        Current Total Value: ${stock['current_price'] * stock['quantity']:,.2f}
        Predicted Changes:
        - Tomorrow: {stock['next_day_change']:.1f}%
        - Next Week: {stock['next_week_change']:.1f}%
        - Next Month: {stock['next_month_change']:.1f}%
        """

    prompt += f"""
Please analyze these stocks and tell me:
1. Which stocks I should sell
2. How many shares of each to sell must be INTEGERS
3. Why you made these recommendations

Return ONLY text in the format of a JSON file as shown below. Make 2 versions. The 1st version would have less variability (focusing on selling more of the worst stocks), and the 2nd version would have more variability (focusing on selling a mix of stocks) MAKE SURE THE NUMBER OF SHARES IN AN INTEGER.:
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

Make sure the total_cash_generated meets or slightly exceeds ${cash_needed:,.2f}.
Prioritize selling stocks with the worst long-term outlook."""

    # Step 2: Generating Content and showing progress
    with tqdm(total=1, desc="Generating Response") as progress_bar:
        try:
            response = model.generate_content(prompt)
            progress_bar.update(1)

            # Clean and parse the response
            if hasattr(response, 'text'):
                cleaned_response = clean_json_response(response.text)
                try:
                    return cleaned_response  # Return raw response for regex parsing later
                except json.JSONDecodeError as e:
                    print(f"Failed to parse JSON after cleaning. Response text:\n{cleaned_response}")
                    print(f"JSON Error: {str(e)}")
                    return None
            else:
                print("Empty response received from Gemini.")
                return None
        except Exception as e:
            print(f"Error during content generation: {e}")
            return None


@app.get("/getRecs")
async def get_recs(id:str, moneyNeeded:float):
    underperforming_stocks = [
        {
            "symbol": "AAPL",
            "current_price": 150.0,
            "quantity": 100,
            "next_day_change": -1.5,
            "next_week_change": -3.2,
            "next_month_change": -6.8
        },
        {
            "symbol": "GOOGL",
            "current_price": 2800.0,
            "quantity": 10,
            "next_day_change": -0.8,
            "next_week_change": -2.1,
            "next_month_change": -7.3
        },
        {
            "symbol": "META",
            "current_price": 300.0,
            "quantity": 50,
            "next_day_change": -2.1,
            "next_week_change": -0.5,
            "next_month_change": -7.2
        }
    ]

    # Get recommendations for generating $10,000
    recommendations = get_selling_recommendations(underperforming_stocks, 10000)

    # Define a regex pattern to capture JSON objects from the response
    json_pattern = r'\{(?:[^{}]|(?:\{[^{}]*\}))*\}'

    # Find all JSON-like blocks in the recommendations output
    json_blocks = re.findall(json_pattern, recommendations, re.DOTALL)

    # Attempt to parse each JSON block and store in a list
    parsed_jsons = []
    for block in json_blocks:
        try:
            parsed_json = json.loads(block)
            parsed_jsons.append(parsed_json)
        except json.JSONDecodeError as e:
            print(f"Failed to decode a JSON block: {e}")

    # # Save parsed JSON objects to a file
    # with open("parsed_outputs.json", "w") as f:
    #     json.dump(parsed_jsons, f, indent=2)

    # print("JSON blocks successfully saved to parsed_outputs.json")

    return parsed_jsons


@app.post('/sellStock')
async def sell_stock(rec: Recommendations):
    #print(rec)

    for r in rec.recommendations:
        print(f"Selling {r.shares_to_sell} shares of {r.symbol}")


    return {"message": "Stock sold"}

