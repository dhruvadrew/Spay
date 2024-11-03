import React from 'react';

function ProductRow({ itemNumber, imageSrc, name, price, rating, description }) {
    return (
        <div style={styles.row}>
            <img src={imageSrc} alt={name} style={styles.image} />
            <div style={styles.info}>
                <div style={styles.details}>
                    <span style={styles.itemNumber}>Item #{itemNumber}</span>
                    <span style={styles.name}>{name}</span>
                    <span style={styles.rating}>{"⭐   ".repeat(rating)}</span>
                    <p style={styles.description}>{description}</p>
                </div>
                <span style={styles.price}>{price}</span>
            </div>
        </div>
    );
}

const styles = {
    row: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ddd',
        justifyContent: 'space-between'
    },
    image: {
        width: '200px',
        height: '200px',
        marginRight: '10px'
    },
    info: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left'
    },
    itemNumber: {
        fontSize: '12px',
        color: '#666'
    },
    name: {
        fontSize: '20px',
        fontWeight: 'bold'
    },
    rating: {
        fontSize: '20px',
        color: '#FFD700', // Gold color for stars
        marginTop: '4px'
    },
    description: {
        fontSize: '14px',
        color: 'CCCCCC',
        marginTop: '6px',
        maxWidth: '50vw', // Restricts description width to 50% of the viewport
        wordWrap: 'break-word' // Ensures text wraps to a new line within maxWidth
    },
    price: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'right',
        alignSelf: 'center'
    }
};

export default ProductRow;
