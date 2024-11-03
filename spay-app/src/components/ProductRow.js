import React from 'react'

function ProductRow({ imageSrc, name, price }) {
    return (
        <div style={styles.row}>
            <img src={imageSrc} alt={name} style={styles.image} />
            <div style={styles.info}>
                <span style={styles.name}>{name}</span>
                <span style={styles.price}>{price}</span>
            </div>
        </div>
    );
}

const styles = {
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ddd'
    },
    image: {
        width: '300px',
        height: '300px',
        marginRight: '10px'
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    name: {
        fontSize: '16px',
        fontWeight: 'bold'
    },
    price: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right'
    }
};

export default ProductRow;