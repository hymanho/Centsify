# Centsible - Expense Tracker Application

Centsible is a React-based expense tracker application that allows users to manage their personal finances by tracking daily expenses. This app uses Firebase for authentication and Firestore for storing expense data, along with AI-driven insights to help users understand their spending patterns and detect anomalies. 

## Table of Contents

- Features
- Installation
- Usage
- Screenshots
- Technologies Used
- Contributing
- License

## Features

- **User Authentication**: Secure login and registration using Firebase Authentication.
- **Expense Management**: Add, edit, and delete expense entries in real-time using Firestore.
- **Expense Categories**: Organize expenses by customizable categories (e.g., groceries, entertainment, etc.).
- **Data Visualization**: Graphical representation of spending patterns over time.
- **AI-Driven Insights**: Personalized expense analysis using AI to detect anomalies, find most frequent categories, and provide average/median cost insights.
- **Responsive UI**: A mobile-friendly, user-friendly design that adapts to different screen sizes.
- **Rasa Chatbot**: Integrated chatbot to assist users in managing their expenses and answering financial queries.

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/centsible.git
    ```
2. Navigate to the project directory:
    ```
    cd centsible
    ```
3. Install dependencies:
    ```
    npm install
    ```

4. Set up Firebase:
   - Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
   - Copy your Firebase configuration and replace the placeholder in `firebase.js`.

5. Run the application:
    ```
    npm start
    ```

## Usage

1. **Login/Register**: Use Firebase authentication to log in or register for an account.
2. **Track Expenses**: Add new expenses, categorize them, and view them in the expense list.
3. **Data Visualization**: View expense charts showing spending trends over time.
4. **Chatbot Assistance**: Use the Rasa-integrated chatbot to ask for expense reports, insights, and more.

## Screenshots

### Dashboard
![Dashboard](path-to-your-screenshot.png)

### Add Expense
![Add Expense](path-to-your-screenshot.png)

### Chatbot Interaction
![Chatbot](path-to-your-screenshot.png)

## Technologies Used

- **Frontend**: React, React Router, CSS
- **Backend**: Firebase Authentication, Firestore
- **AI**: Rasa Chatbot, Expense Analysis (RandomForest Classifier)
- **Data Visualization**: Chart.js
- **Deployment**: Firebase Hosting

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
    ```
    git checkout -b feature/your-feature-name
    ```
3. Commit your changes:
    ```
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```
    git push origin feature/your-feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
