// TODO - test submit button call on submit function
// TODO - test onsubmit call signupAction

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import store from '../../store';
import { Provider } from 'react-redux';
import SignupPage from '../../containers/SignupPage';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
    const onSubmit = jest.fn();
    render(
        <Provider store={store}>
            <Router>
                <SignupPage onSubmit={onSubmit} />
            </Router>
        </Provider>
    );
});

afterEach(() => {
    cleanup();
});

describe('SignupPage - general', () => {
    test('renders without crashing', () => {});
    test('should render Already have an account? linking to the login page', () => {
        const signin = screen.getByRole('link', { name: /Sign in/i });
        expect(signin).toBeInTheDocument();
        expect(signin.href).toBe('http://localhost/login');
    });
});

describe('SignupPage- name input', () => {
    test('renders name text box', () => {
        const nameTextbox = screen.getByPlaceholderText('Name*');
        expect(nameTextbox).toBeInTheDocument();
    });
    test('name input should be required', () => {
        const nameTextbox = screen.getByPlaceholderText('Name*');
        expect(nameTextbox.required).toBe(true);
    });
    test('name value should change according to input ', () => {
        const nameTextbox = screen.getByPlaceholderText('Name*');
        userEvent.type(nameTextbox, 'testName');
        expect(nameTextbox.value).toBe('testName');
    });
});

describe('SignupPage- email input', () => {
    test('renders email text box', () => {
        const emailTextbox = screen.getByPlaceholderText('Email*');
        expect(emailTextbox).toBeInTheDocument();
        expect(emailTextbox.required).toBe(true);
    });
    test('email input should be required', () => {
        const emailTextbox = screen.getByPlaceholderText('Email*');
        expect(emailTextbox.required).toBe(true);
    });
    test('email value should change according to input ', () => {
        const emailTextbox = screen.getByPlaceholderText('Email*');
        userEvent.type(emailTextbox, 'test@gmail.com');
        expect(emailTextbox.value).toBe('test@gmail.com');
    });
});

describe('SignupPage- password input', () => {
    test('renders password box', () => {
        const passwordTextbox = screen.getByPlaceholderText('Password*');
        expect(passwordTextbox).toBeInTheDocument();
    });
    test('password input should be required', () => {
        const passwordTextbox = screen.getByPlaceholderText('Password*');
        expect(passwordTextbox.required).toBe(true);
    });
    test('password value should change according to input ', () => {
        const passwordTextbox = screen.getByPlaceholderText('Password*');
        userEvent.type(passwordTextbox, 'test123456');
        expect(passwordTextbox.value).toBe('test123456');
    });
});

describe('SignupPage- confirm password input', () => {
    test('renders confirm password box', () => {
        const confirmPasswordTextbox = screen.getByPlaceholderText('Confirm Password*');
        expect(confirmPasswordTextbox).toBeInTheDocument();
    });
    test('confirm password input should be required', () => {
        const confirmPasswordTextbox = screen.getByPlaceholderText('Confirm Password*');
        expect(confirmPasswordTextbox.required).toBe(true);
    });
    test('confirm password value should change according to input ', () => {
        const confirmPasswordTextbox = screen.getByPlaceholderText('Confirm Password*');
        userEvent.type(confirmPasswordTextbox, 'test123456');
        expect(confirmPasswordTextbox.value).toBe('test123456');
    });
});

describe('SignupPage- register button', () => {
    test('should render register button', () => {
        const button = screen.getByRole('button', { name: 'Register' });
        expect(button).toBeInTheDocument();
    });
});

// TODO - imporve this tests by checking the redirection url (authenticated user redirect to home page, user who signed up to login page)
describe('SignupPage - redirect', () => {
    beforeEach(() => {
        cleanup();
    });
    test('should redirect authenticated user', async () => {
        store.dispatch({ type: 'LOGIN_SUCCESS', payload: { isAuthenticated: true } });
        render(
            <Provider store={store}>
                <Router>
                    <SignupPage />
                </Router>
            </Provider>
        );
        const signupPage = screen.queryByTestId('signupPage');
        expect(signupPage).not.toBeInTheDocument();
    });
    test('should redirect after signing up and call onSubmit function', () => {
        store.dispatch({ type: 'LOGOUT', payload: { isAuthenticated: false } });
        render(
            <Provider store={store}>
                <Router>
                    <SignupPage />
                </Router>
            </Provider>
        );
        const signupPage = screen.getByTestId('signupPage');
        const nameTextbox = screen.getByPlaceholderText('Name*');
        const emailTextbox = screen.getByPlaceholderText('Email*');
        const passwordTextbox = screen.getByPlaceholderText('Password*');
        const confirmTextbox = screen.getByPlaceholderText('Confirm Password*');
        const signupButton = screen.getByRole('button', { name: 'Register' });

        userEvent.type(nameTextbox, 'testuser');
        userEvent.type(emailTextbox, 'testuser@gmail.com');
        userEvent.type(passwordTextbox, 'testuser123');
        userEvent.type(confirmTextbox, 'testuser123');
        userEvent.click(signupButton);

        expect(signupPage).not.toBeInTheDocument();
    });
});