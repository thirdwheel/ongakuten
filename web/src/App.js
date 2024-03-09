// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>{ process.env.REACT_APP_SHORT_NAME }</h1>
            </header>
            <div className="page-content">
                <p>{ process.env.REACT_APP_INTRO_TEXT }</p>
            </div>
            <div className="table">
                <p>Loading store, please wait...</p>
            </div>
            <div className="login">
                <a href={`https://www.sandbox.paypal.com/signin/authorize?flowEntry=static&client_id=${process.env.REACT_APP_PAYPAL_APP_ID}&scope=openid&redirect_uri=${process.env.REACT_APP_PAYPAL_RETURN_URL}`}>
                    <img alt="" src="https://www.paypalobjects.com/devdoc/log-in-with-paypal-button.png" />
                </a>
            </div>
        </div>
    );
}

export default App;
