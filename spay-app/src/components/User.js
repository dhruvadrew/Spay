import React from 'react';
import PropTypes from 'prop-types';
import '../User.css'; // Make sure to create this CSS file

function User({ first_name, last_name }) {
    // Constructing the full name from props
    const fullName = `${first_name} ${last_name}`;

    return (
        <div className="user-container">
            <h1 className="user-name">{fullName}</h1>
        </div>
    );
}

// PropTypes to ensure correct prop types
User.propTypes = {
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
};

export default User;
