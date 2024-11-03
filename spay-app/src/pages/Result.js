import React, { useEffect, useState } from 'react';
import ProductRow from '../components/ProductRow';
import User from '../components/User'; // Import the User component
import { Card, CardContent } from '@mui/material';
import axios from 'axios';

function Result() {
    const [activeTab, setActiveTab] = useState("Products");

    const stocksData = [
        {
          "ticker": "INFY",
          "current_price": 20.77,
          "quantity_owned": 50,
          "total_value": 1038.50
        },
        {
          "ticker": "COF",
          "current_price": 163.86,
          "quantity_owned": 30,
          "total_value": 4915.80
        },
        {
          "ticker": "BAND",
          "current_price": 18.70,
          "quantity_owned": 20,
          "total_value": 374.00
        },
        {
          "ticker": "AAPL",
          "current_price": 222.85,
          "quantity_owned": 15,
          "total_value": 3342.75
        },
        {
          "ticker": "MSFT",
          "current_price": 410.01,
          "quantity_owned": 10,
          "total_value": 4100.10
        },
        {
          "ticker": "AMZN",
          "current_price": 197.87,
          "quantity_owned": 5,
          "total_value": 989.35
        },
        {
          "ticker": "GOOGL",
          "current_price": 171.27,
          "quantity_owned": 8,
          "total_value": 1370.16
        },
        {
          "ticker": "TSLA",
          "current_price": 248.85,
          "quantity_owned": 12,
          "total_value": 2986.20
        },
        {
          "ticker": "META",
          "current_price": 567.16,
          "quantity_owned": 7,
          "total_value": 3970.12
        },
        {
          "ticker": "NVDA",
          "current_price": 135.42,
          "quantity_owned": 25,
          "total_value": 3385.50
        }
      ];

    // useEffect(() => {
    //     getData();
    // }, []);

    const getData = async () => {
        axios.get('http://127.0.0.1:8000/allCustomers')
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                
            });
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
                            description="The modern sectional couch features a high-quality wooden frame with sturdy plastic legs. Its elegant chenille fabric surface complements your room's style perfectly. The fixed combination construction enhances stability and durability. This modular sofa includes a spacious double recliner, ideal for living room comfort. Its cushions are crafted from soft, elastic sponge material and filled with premium cotton for added softness and resilience."
                        />
                    </CardContent>
                </Card>
            )}

            {/* Show User component for other tabs */}
            {activeTab !== "Payment Summary" && (
                <div style={styles.userContainer}>
                    <User first_name="Dhruva" last_name="Barua" balance=" $100.00" stocks = {stocksData}/>
                </div>
            )}
        </div>
    );
}

export default Result;

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#121212', // Dark mode background for the container
        color: '#ffffff', // White text for readability
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align children to the left
        position: 'relative', // For child positioning
    },
    userContainer: {
        position: 'relative', // Positioning for user container
        top: 0, // Distance from the top
        right: 0, // Distance from the right
        textAlign: 'left', // Align text to the right
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
        margin: '0 auto', // Center the card
    },
};
