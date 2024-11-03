from pydantic import BaseModel
from typing import Optional, List

class Address(BaseModel):
    street_number: str
    street_name: str
    city: str
    state: str
    zip: str

class Account(BaseModel):
    _id: str
    first_name: str
    last_name: str
    address: Address

class DebitAccount(BaseModel):
    _id: str
    type: str
    nickname: str
    rewards: int
    balance: float
    customer_id: str


class StockRec(BaseModel):
    symbol: str
    shares_to_sell: float
    expected_cash: float
    reasoning: str

class Recommendations(BaseModel):
    recommendations: List[StockRec]
    total_cash_generated: float
    strategy_explanation: str
