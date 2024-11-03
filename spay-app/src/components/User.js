import React from 'react';
import PropTypes from 'prop-types';
import '../User.css'; // Make sure to create this CSS file

function User({ first_name, last_name, balance, stocks }) {
    // Constructing the full name from props
    const fullName = `${first_name} ${last_name}`;

    return (
        <div className="user-container">
            <h1 className="user-name">{fullName}</h1>
            <p className="account-balance">
                <span className="balance-label">Account Balance:</span> 
                <span className="balance-amount">{balance}</span>
            </p>
            <div className="stocks-list">
                <h2>Your Stocks</h2>
                <div className="stocks-container">
                    {stocks.map((stock, index) => (
                        <div key={index} className="stock-card">
                            <div className="stock-info">
                                <span className="ticker">{stock.ticker}</span>
                                <div className="quantity-price">
                                    <span className="quantity">Quantity: {stock.quantity_owned}</span>
                                </div>
                                <div className="quantity-price">
                                    <span className="current-price">Current Price: ${stock.current_price.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="total-value">
                                Total Value: ${stock.total_value.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// PropTypes to ensure correct prop types
User.propTypes = {
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    stocks: PropTypes.arrayOf(
        PropTypes.shape({
            ticker: PropTypes.string.isRequired,
            current_price: PropTypes.number.isRequired,
            quantity_owned: PropTypes.number.isRequired,
            total_value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default User;
