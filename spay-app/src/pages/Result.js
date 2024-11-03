import React, { useEffect, useState } from 'react';
import ProductRow from '../components/ProductRow';
import User from '../components/User';
import { Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import User2 from '../components/User2';

function Result() {
    const [activeTab, setActiveTab] = useState("Products");
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        id: '',
        balance: 0,
        stocks: [],
        recInfo: [],
        totalCashGenerated: 0,
        strategyExplanation: '',
        secondRec: null,
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/allCustomers');
            const userInfo = response.data[0];

            if (userInfo) {
                storeUserData(userInfo.first_name, userInfo.last_name, userInfo._id);
                await fetchStocks(userInfo._id);
                await fetchAccountBalance(userInfo._id);
            }

            const response2 = await axios.get(`http://127.0.0.1:8000/getRecs?id=${userInfo._id}&moneyNeeded=5000`);
            const recs = response2.data;

            if (recs.length > 1) {
                const secondRec = recs[1];
                const recommendations = secondRec.recommendations.map(rec => ({
                    symbol: rec.symbol,
                    shares_num: rec.shares_to_sell,
                    expected: rec.expected_cash,
                    desc: rec.reasoning,
                }));

                setUserData(prevData => ({
                    ...prevData,
                    recInfo: recommendations,
                    totalCashGenerated: secondRec.total_cash_generated,
                    strategyExplanation: secondRec.strategy_explanation,
                    secondRec, // Store secondRec in state
                }));
            }

        } catch (error) {
            console.error(error);
        }
    };

    const fetchStocks = async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/stockByCustomerId/${userId}`);
            const stockInfo = response.data || [];
            setUserData(prevData => ({
                ...prevData,
                stocks: stockInfo,
            }));
            localStorage.setItem('stocks', JSON.stringify(stockInfo));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAccountBalance = async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/accountByCustomerId/${userId}`);
            const accountData = response.data[0];
            if (accountData) {
                setUserData(prevData => ({
                    ...prevData,
                    balance: accountData.balance,
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const storeUserData = (firstName, lastName, id) => {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('userId', id);
        setUserData({ firstName, lastName, id, balance: 0, stocks: [], recInfo: [], totalCashGenerated: 0, strategyExplanation: '' });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "Account Info") {
            const storedFirstName = localStorage.getItem('firstName');
            const storedLastName = localStorage.getItem('lastName');
            const storedId = localStorage.getItem('userId');
            const storedStocks = JSON.parse(localStorage.getItem('stocks')) || [];

            if (storedFirstName && storedLastName && storedId) {
                setUserData(prevData => ({
                    firstName: storedFirstName,
                    lastName: storedLastName,
                    id: storedId,
                    balance: 0,
                    stocks: storedStocks,
                    recInfo: prevData.recInfo,
                    totalCashGenerated: prevData.totalCashGenerated,
                    strategyExplanation: prevData.strategyExplanation,
                    secondRec: prevData.secondRec,
                }));
                fetchAccountBalance(storedId);
            }
        }
    };

    const postPurchase = async () => {
        if (userData.id && userData.secondRec) {
            try {
                await axios.post(`http://127.0.0.1:8000/purchase/${userData.id}/${5000}`, userData.secondRec);
                console.log("Purchase confirmed!");

                // Switch to "Account Info" tab and refresh account data
                setActiveTab("Account Info");
                await fetchAccountBalance(userData.id);
                await fetchStocks(userData.id);
            } catch (error) {
                console.error("Failed to confirm purchase:", error);
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.tabs}>
                <button
                    onClick={() => handleTabChange("Payment Summary")}
                    style={activeTab === "Payment Summary" ? styles.activeTab : styles.tab}
                >
                    Payment Summary
                </button>
                <button
                    onClick={() => handleTabChange("Account Info")}
                    style={activeTab === "Account Info" ? styles.activeTab : styles.tab}
                >
                    Account Info
                </button>
            </div>

            {activeTab === "Payment Summary" && (
                <Card style={styles.card}>
                    <CardContent>
                        <ProductRow
                            itemNumber="5517679"
                            imageSrc={require('../images/test.png')}
                            name="Vineego 50-in Modern Gray Chenille Sectional"
                            price="$5000.00"
                            rating={4}
                            description="The modern sectional couch features a high-quality wooden frame with sturdy plastic legs. Its elegant chenille fabric surface complements your room's style perfectly. The fixed combination construction enhances stability and durability. This modular sofa includes a spacious double recliner, ideal for living room comfort. Its cushions are crafted from soft, elastic sponge material and filled with premium cotton for added softness and resilience."
                        />
                    </CardContent>
                    <div style={styles.userContainer}>
                        <User2
                            first_name=""
                            last_name=""
                            balance=""
                            stocks={userData.recInfo}
                        />
                    </div>
                    <div style={styles.strategyContainer}>
                        <p style={styles.strategyText}>
                            {userData.strategyExplanation}
                        </p>
                    </div>
                    <div style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.confirmButton} onClick={postPurchase}>
                            Confirm
                        </Button>
                    </div>
                </Card>
            )}

            {activeTab === "Account Info" && (
                <div style={styles.userContainer}>
                    <User
                        first_name={userData.firstName}
                        last_name={userData.lastName}
                        balance={`$${userData.balance}`}
                        stocks={userData.stocks}
                    />
                    <div style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.confirmButton}>
                            Confirm
                        </Button>
                    </div>
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
        backgroundColor: '#121212',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
    },
    userContainer: {
        position: 'relative',
        top: 0,
        right: 0,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: '#333',
        color: '#ffffff',
        cursor: 'pointer',
    },
    activeTab: {
        padding: '10px 20px',
        margin: '0 10px',
        border: '1px solid #5fc238',
        borderRadius: '5px',
        backgroundColor: '#5fc238',
        color: '#ffffff',
        cursor: 'pointer',
    },
    card: {
        backgroundColor: '#333',
        color: '#ffffff',
        border: '1px solid #444',
        width: '80%',
        margin: '0 auto',
    },
    strategyContainer: {
        marginTop: '20px',
    },
    strategyText: {
        padding: '0 20px',  // Adds padding to the text within the card
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    confirmButton: {
        backgroundColor: '#5fc238',
        color: '#ffffff',
        padding: '10px 30px',
        borderRadius: '5px',
    },
};
