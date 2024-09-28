import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="header">
            <div className="logo-container">
                <img class="logo-png" src= {require("./assets/images/Logo.png")} alt= "logo" />
                <h1 class="logo-text">Calc.ai</h1>
            </div>
            <p class="logo-caption">Simplify math learning and problem-solving with our AI-powered math solver</p>
        </div>
    );
};

export default Header;