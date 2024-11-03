from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import yfinance as yf
import json
from .models import Account, DebitAccount

import sys
import os
import importlib.util
file_path = os.path.abspath('../Spay/spay-app/backend/stock_prediction.py')

# Load the module from the file path
spec = importlib.util.spec_from_file_location("stock_prediction", file_path)
stock_prediction = importlib.util.module_from_spec(spec)
sys.modules["stock_prediction"] = stock_prediction
spec.loader.exec_module(stock_prediction)

# Now you can access `predict` from `stock_prediction`
predict = stock_prediction.predict



capitalKey = "e771edccbc20793962729f6c3dd26599"
accountId = "67271aa19683f20dd518b2a3"
customerId = "6726e6dd9683f20dd518b2a2"

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


@app.get("/api/stock")
async def predict_stock():
    prediction_json = predict('ALG')
    return json.dumps(prediction_json)



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


    


