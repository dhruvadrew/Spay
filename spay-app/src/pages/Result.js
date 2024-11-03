import React, { useEffect, useState } from 'react';
import ProductRow from '../components/ProductRow';
import { Card, CardContent } from '@mui/material';

function Result() {
    const [activeTab, setActiveTab] = useState("Products");

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
                      description="The modern sectional couch features a high-quality wooden frame with sturdy plastic legs. Its elegant chenille fabric surface complements your room's style perfectly. The fixed combination construction enhances stability and durability. This modular sofa includes a spacious double recliner, ideal for living room comfort. Its cushions are crafted from soft, elastic sponge material and filled with premium cotton for added softness and resilience."
                  />
                </CardContent>
              </Card>
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
        width: '80%'
    },
};
