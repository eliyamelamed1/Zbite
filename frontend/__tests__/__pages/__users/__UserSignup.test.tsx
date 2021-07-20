import '@testing-library/jest-dom/extend-expect';

import { cleanup, render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import Router from 'next/router';
import UserSignup from '../../../pages/users/signup';
import configureStore from 'redux-mock-store';
import { signupAction } from '../../../redux/actions/auth';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let initialState = {
    authReducer: {},
};
const store = mockStore(initialState);
jest.mock('../../../redux/actions/auth', () => ({
     signupAction: jest.fn().mockReturnValue(()=> true) 
}));
jest.mock('next/router', () => ({ push: jest.fn() }));
describe('UserSignup - guest user', () => {
    
    beforeEach(() => {
        render(
            <Provider store={store}>
                <UserSignup />
            </Provider>
        );
    });
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });
    
    describe('UserSignup - general', () => {
        test('renders without crashing', () => {});
        test('should render Already have an account? linking to the login page', () => {
            const signIn = screen.getByRole('link', { name: /Sign in/i });
            expect(signIn).toBeInTheDocument();
            expect(signIn.href).toBe('http://localhost/login');
        });
    });
    
    describe('UserSignup- name input', () => {
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
    
    describe('UserSignup- email input', () => {
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
    
    describe('UserSignup- password input', () => {
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
    
    describe('UserSignup- confirm password input', () => {
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
    
    describe('UserSignup- register button', () => {
        test('should render register button', () => {
            const button = screen.getByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        
        describe('UserSignup - signupForm', () => {
            test('signup should dispatch signupAction',  () => {
            const nameTextbox = screen.getByPlaceholderText('Name*');
            const emailTextbox = screen.getByPlaceholderText('Email*');
            const passwordTextbox = screen.getByPlaceholderText('Password*');
            const confirmTextbox = screen.getByPlaceholderText('Confirm Password*');
            const signupButton = screen.getByRole('button', { name: 'Register' });
            
            const nameValue = 'testuser';
            const emailValue = 'testuser@gmail.com';
            const passwordValue = 'testuser123';
            const rePasswordValue = 'testuser123';
            
            userEvent.type(nameTextbox, nameValue);
            userEvent.type(emailTextbox, emailValue);
            userEvent.type(passwordTextbox, passwordValue);
            userEvent.type(confirmTextbox, rePasswordValue);
            userEvent.click(signupButton);
            
            const timesActionDispatched =  signupAction.mock.calls.length;
            
            expect(timesActionDispatched).toBe(1);
            expect( signupAction.mock.calls[0][0].name).toEqual(nameValue);
            expect( signupAction.mock.calls[0][0].email).toEqual(emailValue);
            expect( signupAction.mock.calls[0][0].password).toEqual(passwordValue);
            expect( signupAction.mock.calls[0][0].re_password).toEqual(rePasswordValue);
        });
        test('successful signup should redirect user to login page', () => {
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
        
            expect(signupAction.mock.calls.length).toBe(1)
            expect(Router.push.mock.calls.length).toBe(1)
            expect(Router.push.mock.calls[0][0]).toBe('/login')
        });
        });
    });
})


describe('UserSignup - guest authenticated users', () => {
    initialState = {
        authReducer: { isUserAuthenticated: true },
    };
    const store = mockStore(initialState);
    beforeEach(() => {
        render(
            <Provider store={store}>
                <UserSignup />
            </Provider>
        );
    });
    test('should redirect authenticated user to home page', async () => {
        expect(Router.push.mock.calls.length).toBe(1);
        expect(Router.push.mock.calls.[0][0]).toBe('/');
    });
});