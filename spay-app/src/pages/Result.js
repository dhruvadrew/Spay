import React, { useEffect, useState } from 'react';
import ProductRow from '../components/ProductRow';
import User from '../components/User'; // Import the User component
import { Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import User2 from '../components/User2';

function Result() {
    const [activeTab, setActiveTab] = useState("Products");
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        id: '',
        balance: 0, // Add balance to user data state
        stocks: [] // Add stocks to user data state
    });

    useEffect(() => {
        getData(); // Fetch data when the component mounts
    }, []);

    const getData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/allCustomers');
            const userInfo = response.data[0]; // Assuming response.data[0] contains user data
            
            // Update local storage with user info
            if (userInfo) {
                storeUserData(userInfo.first_name, userInfo.last_name, userInfo._id);
                await fetchStocks(userInfo._id); // Fetch stocks for the user
                await fetchAccountBalance(userInfo._id); // Fetch account balance
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStocks = async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/stockByCustomerId/${userId}`);
            const stockInfo = response.data || []; // Fallback to empty array if no stocks are returned
            setUserData((prevData) => ({ 
                ...prevData,
                stocks: stockInfo // Update userData with stocks
            }));
            localStorage.setItem('stocks', JSON.stringify(stockInfo)); // Store stocks in local storage
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAccountBalance = async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/accountByCustomerId/${userId}`);
            const accountData = response.data[0]; // Assuming response.data[0] contains account balance info
            if (accountData) {
                setUserData((prevData) => ({
                    ...prevData,
                    balance: accountData.balance // Update balance in userData
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
        setUserData({ firstName, lastName, id, balance: 0, stocks: [] }); // Initialize balance and stocks
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "Account Info") {
            // Refresh data when switching to Account Info
            const storedFirstName = localStorage.getItem('firstName');
            const storedLastName = localStorage.getItem('lastName');
            const storedId = localStorage.getItem('userId');
            const storedStocks = JSON.parse(localStorage.getItem('stocks')) || []; // Retrieve stocks from local storage

            if (storedFirstName && storedLastName && storedId) {
                setUserData({ 
                    firstName: storedFirstName, 
                    lastName: storedLastName, 
                    id: storedId,
                    balance: 0, // Reset balance to fetch updated value
                    stocks: storedStocks // Set stocks from local storage
                });
                fetchAccountBalance(storedId); // Fetch account balance when switching tabs
            }
        }
    };

    return (
        <div style={styles.container}>
            {/* Tabs */}
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
                    <div style={styles.userContainer}>
                        <User2
                            first_name=""
                            last_name=""
                            balance=""
                            stocks={userData.stocks} // Pass stocks from state to User component
                        />
                    </div>
                    <div style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.confirmButton}>
                            Confirm
                        </Button>
                    </div>
                </Card>
            )}

            {/* Show User component for Account Info tab */}
            {activeTab === "Account Info" && (
                <div style={styles.userContainer}>
                    <User
                        first_name={userData.firstName}
                        last_name={userData.lastName}
                        balance={`$${userData.balance}`} // Display the actual balance
                        stocks={userData.stocks} // Pass stocks from state to User component
                    />
                    <div style={styles.buttonContainer}>
                        <Button onClick = {getReccomendation} variant="contained" style={styles.confirmButton}>
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
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    confirmButton: {
        borderRadius: '25px', // Rounded corners
        backgroundColor: '#5fc238', // Confirm button background color
        color: '#ffffff', // Confirm button text color
        marginBottom: '20px',
    },
};
