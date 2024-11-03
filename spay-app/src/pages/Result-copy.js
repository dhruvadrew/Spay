import React, { useEffect, useState } from 'react';
import ProductRow from '../components/ProductRow';
import { Card, CardContent, Typography } from '@mui/material';

function Resultcopy() {
    const [activeTab, setActiveTab] = useState("Products");
    const recommendations = [
        {
            "recommendations": [
                {
                    "symbol": "GOOGL",
                    "shares_to_sell": 1,
                    "expected_cash": 2800.0,
                    "reasoning": "GOOGL has a significant predicted decline next month (-7.3%), but less severe short-term declines. Selling a small amount helps diversify the sale and reduce overall portfolio risk."
                },
                {
                    "symbol": "AAPL",
                    "shares_to_sell": 24,
                    "expected_cash": 3600.0,
                    "reasoning": "AAPL shows a moderate decline across all timeframes. Selling a portion helps diversify the sale and contribute to the cash goal."
                },
                {
                    "symbol": "META",
                    "shares_to_sell": 20,
                    "expected_cash": 6000.0,
                    "reasoning": "META has a poor long-term outlook. Including it in the mix further reduces potential losses while diversifying the sale across all underperforming stocks."
                }
            ],
            "total_cash_generated": 12400.0,
            "strategy_explanation": "This strategy diversifies the sale across all underperforming assets, prioritizing the stock with the worst long-term outlook while also considering short-term declines. This spreads the risk and aims to minimize potential further losses across the portfolio."
        }
    ];

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        console.log(data);
    };

    return (
        <div style={styles.container}>
            {/* Tabs */}
            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab("Payment Summary")}
                    style={activeTab === "Payment Summary" ? styles.activeTab : styles.tab}
                >
                    Payment Summary
                </button>
                <button
                    onClick={() => setActiveTab("Account Info")}
                    style={activeTab === "Account Info" ? styles.activeTab : styles.tab}
                >
                    Account Info
                </button>
            </div>

            {/* Display content based on active tab */}
            {activeTab === "Payment Summary" && (
                <Card style={styles.card}>
                    <CardContent>
                        <ProductRow
                            itemNumber="5517679"
                            imageSrc={require('../images/test.png')}
                            name="Vineego 50-in Modern Gray Chenille Sectional"
                            price="$429.99"
                            rating={4}
                            style={{ border: 0 }}
                            description="The modern sectional couch features a high-quality wooden frame with sturdy plastic legs. Its elegant chenille fabric surface complements your room's style perfectly. The fixed combination construction enhances stability and durability. This modular sofa includes a spacious double recliner, ideal for living room comfort. Its cushions are crafted from soft, elastic sponge material and filled with premium cotton for added softness and resilience."
                        />
                    </CardContent>
                </Card>
            )}

            {/* Recommendations Section */}
            <div style={{ marginTop: '20px' }}>
                <Card style={styles.card}>
                    <CardContent>
                        <Typography variant="h5" style={{ marginBottom: '10px' }}>Investment Recommendations</Typography>
                        {recommendations[0].recommendations.map((rec, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <Typography variant="h6">{rec.symbol}</Typography>
                                <Typography>Shares to Sell: {rec.shares_to_sell}</Typography>
                                <Typography>Expected Cash: ${rec.expected_cash.toFixed(2)}</Typography>
                                <Typography>Reasoning: {rec.reasoning}</Typography>
                            </div>
                        ))}
                        <Typography variant="h6">Total Cash Generated: ${recommendations[0].total_cash_generated.toFixed(2)}</Typography>
                        <Typography variant="body2" style={{ marginTop: '10px' }}>{recommendations[0].strategy_explanation}</Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Resultcopy;

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#121212', // Dark mode background for the container
        color: '#ffffff', // White text for readability
        minHeight: '100vh',
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    tab: {
        padding: '10px 20px',
        margin: '0 10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#333', // Darker background for inactive tabs
        color: '#ffffff', // White text for inactive tabs
        cursor: 'pointer',
    },
    activeTab: {
        padding: '10px 20px',
        margin: '0 10px',
        border: '1px solid #5fc238',
        borderRadius: '5px',
        backgroundColor: '#5fc238', // Green for active tab
        color: '#ffffff', // White text for active tab
        cursor: 'pointer',
    },
    card: {
        backgroundColor: '#333', // Dark background for the card
        color: '#ffffff', // White text color for the card content
        border: '1px solid #444', // Border for contrast
        width: '80%',
        margin: '0 auto',
    },
};
