import React from 'react';
import PropTypes from 'prop-types';
import '../User2.css'; // Ensure this CSS file exists

function User2({ first_name, last_name, balance, stocks }) {
    // Constructing the full name from props
    const fullName = `${first_name} ${last_name}`;

    return (
        <div className="user-container">
            <h1 className="user-name">{fullName}</h1>
            <p className="account-balance">
                <span className="balance-amount">{balance}</span>
            </p>
            <div className="stocks-list">
                <h2 className="stocks-title">Your Recommendations</h2>
                <div className="stocks-container">
                    {stocks.length > 0 ? (
                        stocks.map((stock, index) => (
                            <div key={index} className="stock-card">
                                <div className="stock-info">
                                    <span className="ticker">{stock.symbol}</span> {/* Use the symbol from the stock object */}
                                    <div className="quantity-price">
                                        <span className="quantity">Shares to Sell: {stock.shares_num}</span> {/* Use shares_num from the stock object */}
                                    </div>
                                    <div className="quantity-price">
                                        <span className="current-price">Expected Cash: ${stock.expected.toFixed(2)}</span> {/* Use expected from the stock object */}
                                    </div>
                                    <div className="stock-reasoning">
                                        <span className="reasoning">{stock.desc}</span> {/* Use reasoning for the description */}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No recommendations available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// PropTypes to ensure correct prop types
User2.propTypes = {
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    stocks: PropTypes.arrayOf(
        PropTypes.shape({
            symbol: PropTypes.string.isRequired, // Symbol of the stock
            shares_num: PropTypes.number.isRequired, // Number of shares to sell
            expected: PropTypes.number.isRequired, // Expected cash from selling
            desc: PropTypes.string.isRequired, // Reasoning for the recommendation
        })
    ).isRequired,
};

export default User2;
