import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for type checking

const AccountDetails = ({ account }) => {
  if (!account) {
    return <div>No account information available.</div>;
  }

  return (
    <div className="account-details">
      <h1>Account Details</h1>
      <p><strong>Name:</strong> {account.name}</p>
      <p><strong>Email:</strong> {account.email}</p>
      <p><strong>Username:</strong> {account.username}</p>
      <p><strong>Balance:</strong> {account.balance} {account.currency}</p>
      <p><strong>Preferences:</strong> {JSON.stringify(account.preferences)}</p>
      <p><strong>Transactions:</strong> {JSON.stringify(account.transactions)}</p>
      <p><strong>Security:</strong> {JSON.stringify(account.security)}</p>
      <p><strong>Settings:</strong> {JSON.stringify(account.settings)}</p>
      <p><strong>Backup:</strong> {JSON.stringify(account.backup)}</p>
    </div>
  );
};

// Define prop types
AccountDetails.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    balance: PropTypes.number,
    currency: PropTypes.string,
    preferences: PropTypes.object,
    transactions: PropTypes.array,
    security: PropTypes.object,
    settings: PropTypes.object,
    backup: PropTypes.object
  })
};

export default AccountDetails;
