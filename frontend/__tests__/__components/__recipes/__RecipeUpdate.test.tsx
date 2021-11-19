// TODO - add test to reload page after recipe have been updated
// TODO - add tests to verify onSubmit function is working properly

import '@testing-library/jest-dom/extend-expect';

import { cleanup, render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import RecipeUpdate from '../../../components/recipes/RecipeUpdate';
import configureStore from 'redux-mock-store';
import { recipeUpdateAction } from '../../../redux/actions/recipeActions';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initialState = {};
const store = mockStore(initialState);
jest.mock('../../../redux/actions/recipeActions', () => ({ recipeUpdateAction: jest.fn() }));
beforeEach(() => {
    const id = '1';
    render(
        <Provider store={store}>
            <RecipeUpdate id={id} />
        </Provider>
    );
});

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});
describe('RecipeUpdate - general ', () => {
    test('should render without crashing', () => {});
    test('data-testid match recipeUpdate', () => {
        const testid = screen.getByTestId('recipeUpdate');
        expect(testid).toBeInTheDocument();
    });
});

describe('title input', () => {
    test('render title textbox', () => {
        const textbox = screen.getByPlaceholderText(/title/i);
        expect(textbox).toBeInTheDocument();
    });
    test('title attributes', () => {
        const textbox = screen.getByPlaceholderText(/title/i);
        expect(textbox.required).toBe(true);
        expect(textbox.type).toBe('text');
        expect(textbox.name).toBe('title');
    });
    test('title value change according to input (onchange)', () => {
        const textbox = screen.getByPlaceholderText(/title/i);
        userEvent.type(textbox, 'new title');
        expect(textbox.value).toBe('new title');
    });
});

describe('description input', () => {
    test('render description textbox', () => {
        const textbox = screen.getByPlaceholderText(/description/i);
        expect(textbox).toBeInTheDocument();
    });
    test('description attributes', () => {
        const textbox = screen.getByPlaceholderText(/description/i);
        expect(textbox.required).toBe(true);
        expect(textbox.type).toBe('text');
        expect(textbox.name).toBe('description');
    });
    test('description value change according to input (onchange)', () => {
        const textbox = screen.getByPlaceholderText(/description/i);
        userEvent.type(textbox, 'new description');
        expect(textbox.value).toBe('new description');
    });
});

describe('RecipeUpdate - update button', () => {
    test('should render update button', () => {
        const updateButton = screen.getByRole('button', { name: /update/i });
        expect(updateButton).toBeInTheDocument();
    });
    test('button type should be type submit', () => {
        const updateButton = screen.getByRole('button', { name: /update/i });
        expect(updateButton.type).toBe('submit');
    });
    test('update button should dispatch recipeUpdateAction ', () => {
        const titleTextbox = screen.getByPlaceholderText(/title/i);
        const descriptionTextbox = screen.getByPlaceholderText(/description/i);
        const updateButton = screen.getByRole('button', { name: /update/i });
        const updatedTitle = 'updatedTitle';
        const updatedDescription = 'updatedDescription';

        userEvent.type(titleTextbox, updatedTitle);
        userEvent.type(descriptionTextbox, updatedDescription);
        userEvent.click(updateButton);
        const timesActionDispatched = recipeUpdateAction.mock.calls.length;

        expect(timesActionDispatched).toBe(1);
        expect(recipeUpdateAction.mock.calls[0][0].title).toBe(updatedTitle);
        expect(recipeUpdateAction.mock.calls[0][0].description).toBe(updatedDescription);
    });
});
