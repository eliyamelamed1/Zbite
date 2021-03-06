// TODO - test reset password button call onSubmit
// TODO - test onSubmit work as expected
// TODO - test redirect to home after seding reset password email

import '@testing-library/jest-dom';

import { cleanup, render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import UserResetPassword from '../../../../pages/users/reset_password/UserResetPassword';
import { pageRoute } from '../../../../enums';
import { resetPasswordAction } from '../../../../redux/actions/userActions';
import store from '../../../../redux/store';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../redux/actions/userActions', () => ({
    resetPasswordAction: jest.fn().mockReturnValue(() => true),
}));

beforeEach(() => {
    render(
        <Provider store={store}>
            <UserResetPassword />
        </Provider>
    );
});

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe('UserResetPassword', () => {
    test('renders without crashing', () => {});
});

describe('UserResetPassword - email input', () => {
    test('should render email text box', () => {
        const emailTextbox = screen.getByPlaceholderText('Email');
        expect(emailTextbox).toBeInTheDocument();
        expect(emailTextbox.required).toBe(true);
    });
    test('email input should be required', () => {
        const emailTextbox = screen.getByPlaceholderText('Email');
        expect(emailTextbox.required).toBe(true);
    });
    test('email value should change according to input ', () => {
        const emailTextbox = screen.getByPlaceholderText('Email');
        userEvent.type(emailTextbox, 'test@gmail.com');
        expect(emailTextbox.value).toBe('test@gmail.com');
    });
    test('submit button should render ', () => {
        const submitButton = screen.getByRole('button', { name: 'Send Email Reset' });

        expect(submitButton).toBeInTheDocument();
    });
    test('submit button type should be submit ', () => {
        const submitButton = screen.getByRole('button', { name: 'Send Email Reset' });

        expect(submitButton.type).toBe('submit');
    });
    test('completing the reset password form should dispatch resetPasswordAction successfully', async () => {
        const emailTextbox = screen.getByPlaceholderText('Email');
        const submitButton = screen.getByRole('button', { name: 'Send Email Reset' });
        const emailValue = 'test@gmail.com';

        userEvent.type(emailTextbox, emailValue);
        userEvent.click(submitButton);

        const timesActionDispatched = resetPasswordAction.mock.calls.length;

        expect(timesActionDispatched).toBe(1);
    });
});
