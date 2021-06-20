// TODO - test redirect after login
// TODO - test submit calls loginAction

import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

import { cleanup, render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserLogin from '../../../components/users/UserLogin';
import store from '../../../redux/store';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
    render(
        <Provider store={store}>
            <Router>
                <UserLogin />
            </Router>
        </Provider>
    );
});

afterEach(() => {
    cleanup();
});

describe('UserLogin', () => {
    test('renders without crashing', () => {});
    test('render userLogin', () => {
        const userLogin = screen.getByTestId('userLogin');
        expect(userLogin).toBeInTheDocument();
    });
    test('renders email text box', () => {
        const emailInput = screen.getByPlaceholderText(/email/i);
        expect(emailInput).toBeInTheDocument();
        expect(emailInput.required).toBe(true);
    });
    test('email value change according to input', () => {
        const emailInput = screen.getByPlaceholderText(/email/i);
        userEvent.type(emailInput, 'test@gmail.com');
        expect(emailInput.value).toBe('test@gmail.com');
    });
    test('renders password text box', () => {
        const passwordInput = screen.getByPlaceholderText(/password/i);
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput.required).toBe(true);
    });
    test('password value change according to input', () => {
        const passwordInput = screen.getByPlaceholderText(/password/i);
        userEvent.type(passwordInput, '123456');
        expect(passwordInput.value).toBe('123456');
    });
    test('renders submit button', () => {
        const submitButton = screen.getByRole('button', { name: 'Login' });
        expect(submitButton).toBeInTheDocument();
    });
});

// TODO - imporve this tests by checking the redirection url (should be home page)
describe('UserLogin - redirect', () => {
    beforeEach(() => {
        cleanup();
    });
    test('should redirect authenticated user', async () => {
        store.dispatch({ type: 'LOGIN_SUCCESS', payload: { isAuthenticatedData: true } });
        render(
            <Provider store={store}>
                <Router>
                    <UserLogin />
                </Router>
            </Provider>
        );
        const userLogin = screen.queryByTestId('userLogin');
        expect(userLogin).not.toBeInTheDocument();
    });
    // test('should redirect after successful login', () => {});
});