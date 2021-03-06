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

describe('RecipeUpdate', () => {
    beforeEach(() => {
        const updateButton = screen.getByRole('button', { name: /update recipe/i });
        userEvent.click(updateButton);
    });

    describe('general ', () => {
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
            expect(textbox.required).toBe(false);
            expect(textbox.type).toBe('text');
            expect(textbox.name).toBe('description');
        });
        test('description value change according to input (onchange)', () => {
            const textbox = screen.getByPlaceholderText(/description/i);
            userEvent.type(textbox, 'new description');
            expect(textbox.value).toBe('new description');
        });
    });

    describe('cook time input', () => {
        test('render cook time textbox', () => {
            const textbox = screen.getByPlaceholderText(/1hr 30min/i);
            expect(textbox).toBeInTheDocument();
        });
        test('cook time attributes', () => {
            const textbox = screen.getByPlaceholderText(/1hr 30min/i);
            expect(textbox.required).toBe(true);
            expect(textbox.type).toBe('text');
            expect(textbox.name).toBe('cookTime');
        });
        test('cook time value change according to input (onchange)', () => {
            const textbox = screen.getByPlaceholderText(/1hr 30min/i);
            userEvent.type(textbox, '2hr 30min');
            expect(textbox.value).toBe('2hr 30min');
        });
    });

    describe('serving input', () => {
        test('render serving textbox', () => {
            const textbox = screen.getByPlaceholderText(/2 people/i);
            expect(textbox).toBeInTheDocument();
        });
        test('serving attributes', () => {
            const textbox = screen.getByPlaceholderText(/2 people/i);
            expect(textbox.required).toBe(true);
            expect(textbox.type).toBe('text');
            expect(textbox.name).toBe('serving');
        });
        test('serving value change according to input (onchange)', () => {
            const textbox = screen.getByPlaceholderText(/2 people/i);
            userEvent.type(textbox, '5 people');
            expect(textbox.value).toBe('5 people');
        });
    });
    describe('instruction section', () => {
        test('render instructions title', () => {
            const title = screen.getByText('Instructions');
            expect(title).toBeInTheDocument();
        });
        describe('instruction input', () => {
            test('render instructions textbox', () => {
                const textbox = screen.getByPlaceholderText(/add onions to the mixture/i);
                expect(textbox).toBeInTheDocument();
            });
            test('instructions attributes', () => {
                const textbox = screen.getByPlaceholderText(/add onions to the mixture/i);
                expect(textbox.required).toBe(false);
                expect(textbox.type).toBe('text');
                expect(textbox.name).toBe('instruction');
            });
            test('instructions value change according to input (onchange)', () => {
                const textbox = screen.getByPlaceholderText(/add onions to the mixture/i);
                userEvent.type(textbox, 'add rotten tomatoes');
                expect(textbox.value).toBe('add rotten tomatoes');
            });
        });

        describe('add instruction button', () => {
            test('render add instructions button', () => {
                const button = screen.getByPlaceholderText(/add instruction/i);
                expect(button).toBeInTheDocument();
            });
            test('button should not save the instruction if its empty', () => {
                const button = screen.getByPlaceholderText(/add instruction/i);
                userEvent.click(button);
                const savedInstruction = screen.queryByPlaceholderText('savedInstruction');
                expect(savedInstruction).not.toBeInTheDocument();
            });

            test('button should save the instructions and display it if its contains text', async () => {
                const textbox = screen.getByPlaceholderText(/add onions to the mixture/i);
                const button = screen.getByPlaceholderText(/add instruction/i);

                userEvent.type(textbox, '1. add rotten tomatoes');
                userEvent.click(button);

                userEvent.type(textbox, '2. add rotten cucumbers');
                userEvent.click(button);

                const firstSavedInstruction = await screen.findByText('1. add rotten tomatoes');
                const secondSavedInstruction = await screen.findByText('2. add rotten cucumbers');
                expect(firstSavedInstruction).toBeInTheDocument();
                expect(secondSavedInstruction).toBeInTheDocument();
            });
        });
        describe('new instruction actions', () => {
            test('clicking the delete button should remove the chosen instruction', async () => {
                // setup
                const textbox = screen.getByPlaceholderText(/add onions to the mixture/i);
                const button = screen.getByPlaceholderText(/add instruction/i);

                userEvent.type(textbox, '1. add rotten tomatoes');
                userEvent.click(button);

                userEvent.type(textbox, '2. add rotten cucumbers');
                userEvent.click(button);

                const firstSavedInstruction = await screen.findByText('1. add rotten tomatoes');
                const secondSavedInstruction = await screen.findByText('2. add rotten cucumbers');

                // test
                const deleteButtons = await screen.findAllByPlaceholderText('delete instruction');
                const [firstDeleteButton] = deleteButtons;
                userEvent.click(firstDeleteButton);

                expect(firstSavedInstruction).not.toBeInTheDocument();
                expect(secondSavedInstruction).toBeInTheDocument();
            });
            test('editing and saving saved instruction should work', async () => {
                // setup
                const textbox = screen.getByPlaceholderText(/add onions to the mixture/i);
                const button = screen.getByPlaceholderText(/add instruction/i);

                userEvent.type(textbox, '1. add rotten tomatoes');
                userEvent.click(button);

                userEvent.type(textbox, '2. add rotten cucumbers');
                userEvent.click(button);

                const firstSavedInstruction = await screen.findByText('1. add rotten tomatoes');
                const secondSavedInstruction = await screen.findByText('2. add rotten cucumbers');

                // test
                const editButtons = await screen.findAllByPlaceholderText('edit instruction');
                const [firstEditButton] = editButtons;
                userEvent.click(firstEditButton);

                const editInstructionTextbox = await screen.findByPlaceholderText('modify the instruction');
                userEvent.type(editInstructionTextbox, 'updated instruction');

                const saveButton = await screen.findByPlaceholderText('save instruction');
                userEvent.click(saveButton);

                const updatedFirstInstruction = await screen.findByText('updated instruction');
                expect(firstSavedInstruction).not.toBeInTheDocument();
                expect(updatedFirstInstruction).toBeInTheDocument();
                expect(secondSavedInstruction).toBeInTheDocument();
            });
            test.todo('test uploading images to instructions');
        });
    });
    describe('ingredient section', () => {
        test('render ingredients title', () => {
            const title = screen.getByText('Ingredients');
            expect(title).toBeInTheDocument();
        });
        describe('ingredients input', () => {
            test('render ingredients textbox', () => {
                const textbox = screen.getByPlaceholderText(/2 onions/i);
                expect(textbox).toBeInTheDocument();
            });
            test('ingredients attributes', () => {
                const textbox = screen.getByPlaceholderText(/2 onions/i);
                expect(textbox.required).toBe(false);
                expect(textbox.type).toBe('text');
                expect(textbox.name).toBe('ingredient');
            });
            test('ingredients value change according to input (onchange)', () => {
                const textbox = screen.getByPlaceholderText(/2 onions/i);
                userEvent.type(textbox, '2 cucumbers');
                expect(textbox.value).toBe('2 cucumbers');
            });
        });

        describe('add ingredient button', () => {
            test('render add ingredients button', () => {
                const button = screen.getByPlaceholderText(/add ingredient/i);
                expect(button).toBeInTheDocument();
            });
            test('button should not save the ingredients if its empty', () => {
                const button = screen.getByPlaceholderText(/add ingredient/i);
                userEvent.click(button);
                const savedIngredient = screen.queryByPlaceholderText('savedIngredient');
                expect(savedIngredient).not.toBeInTheDocument();
            });

            test('button should save the ingredients and display it if its contains text', async () => {
                const textbox = screen.getByPlaceholderText(/2 onions/i);
                const button = screen.getByPlaceholderText(/add ingredient/i);

                userEvent.type(textbox, '1. 2 cucumbers');
                userEvent.click(button);

                userEvent.type(textbox, '2. 3 lemons');
                userEvent.click(button);

                const firstSavedIngredient = await screen.findByText('1. 2 cucumbers');
                const secondSavedIngredient = await screen.findByText('2. 3 lemons');
                expect(firstSavedIngredient).toBeInTheDocument();
                expect(secondSavedIngredient).toBeInTheDocument();
            });
        });
        describe('new ingredient actions', () => {
            test('clicking the delete button should remove the chosen ingredients', async () => {
                // setup
                const textbox = screen.getByPlaceholderText(/2 onions/i);
                const button = screen.getByPlaceholderText(/add ingredient/i);

                userEvent.type(textbox, '1. 2 cucumbers');
                userEvent.click(button);

                userEvent.type(textbox, '2. 3 lemons');
                userEvent.click(button);

                const firstSavedIngredient = await screen.findByText('1. 2 cucumbers');
                const secondSavedIngredient = await screen.findByText('2. 3 lemons');

                // test
                const deleteButtons = await screen.findAllByPlaceholderText('delete ingredient');
                const [firstDeleteButton] = deleteButtons;
                userEvent.click(firstDeleteButton);

                expect(firstSavedIngredient).not.toBeInTheDocument();
                expect(secondSavedIngredient).toBeInTheDocument();
            });
            test('editing and saving saved ingredients should work', async () => {
                // setup
                const textbox = screen.getByPlaceholderText(/2 onions/i);
                const button = screen.getByPlaceholderText(/add ingredient/i);

                userEvent.type(textbox, '1. 2 cucumbers');
                userEvent.click(button);

                userEvent.type(textbox, '2. 3 lemons');
                userEvent.click(button);

                const firstSavedIngredient = await screen.findByText('1. 2 cucumbers');
                const secondSavedIngredient = await screen.findByText('2. 3 lemons');

                // test
                const editButtons = await screen.findAllByPlaceholderText('edit ingredient');
                const [firstEditButton] = editButtons;
                userEvent.click(firstEditButton);

                const editIngredientTextbox = await screen.findByPlaceholderText('modify the ingredient');
                userEvent.type(editIngredientTextbox, 'updated ingredient');

                const saveButton = await screen.findByPlaceholderText('save ingredient');
                userEvent.click(saveButton);

                const updatedFirstIngredient = await screen.findByText('updated ingredient');
                expect(firstSavedIngredient).not.toBeInTheDocument();
                expect(updatedFirstIngredient).toBeInTheDocument();
                expect(secondSavedIngredient).toBeInTheDocument();
            });
            test.todo('test uploading images to ingredients');
        });
    });
    describe('submit button', () => {
        test('should render submit button', () => {
            const submitButton = screen.getByRole('button', { name: /submit/i });
            expect(submitButton).toBeInTheDocument();
        });
        test('button type should be type submit', () => {
            const submitButton = screen.getByRole('button', { name: /submit/i });
            expect(submitButton.type).toBe('submit');
        });
        test('clicking the submit button should call dispatch recipeUpdateAction', () => {
            const titleTextbox = screen.getByPlaceholderText(/title/i);
            const descriptionTextbox = screen.getByPlaceholderText(/description/i);
            const cookTimeTextbox = screen.getByPlaceholderText(/1hr 30min/i);
            const servingTextbox = screen.getByPlaceholderText(/2 people/i);
            const instructionTextbox = screen.getByPlaceholderText(/add onions to the mixture/i);
            const ingredientTextbox = screen.getByPlaceholderText(/2 onions/i);
            const addIngredientButton = screen.getByPlaceholderText(/add ingredient/i);

            const addInstructionButton = screen.getByPlaceholderText(/add instruction/i);
            const submitButton = screen.getByRole('button', { name: /submit/i });

            userEvent.type(titleTextbox, 'new title');
            userEvent.type(descriptionTextbox, 'new description');
            userEvent.type(servingTextbox, 'new serving');
            userEvent.type(cookTimeTextbox, 'new cook time');

            userEvent.type(ingredientTextbox, '1. 2 cucumbers');
            userEvent.click(addIngredientButton);

            userEvent.type(instructionTextbox, '1. add rotten tomatoes');
            userEvent.click(addInstructionButton);

            userEvent.click(submitButton);

            const timesActionDispatched = recipeUpdateAction.mock.calls.length;
            expect(timesActionDispatched).toBe(1);
            expect(recipeUpdateAction.mock.calls[0][0].title).toBe('new title');
            expect(recipeUpdateAction.mock.calls[0][0].description).toBe('new description');
            expect(recipeUpdateAction.mock.calls[0][0].serving).toBe('new serving');
            expect(recipeUpdateAction.mock.calls[0][0].cookTime).toBe('new cook time');
            expect(recipeUpdateAction.mock.calls[0][0].ingredientsTextList).toEqual(['1. 2 cucumbers']);
            expect(recipeUpdateAction.mock.calls[0][0].instructionsTextList).toEqual(['1. add rotten tomatoes']);
        });
        test('submitting recipeCreateForm with empty instructions array is forbidden', () => {
            const titleTextbox = screen.getByPlaceholderText(/title/i);
            const descriptionTextbox = screen.getByPlaceholderText(/description/i);
            const cookTimeTextbox = screen.getByPlaceholderText(/1hr 30min/i);
            const servingTextbox = screen.getByPlaceholderText(/2 people/i);
            const instructionTextbox = screen.getByPlaceholderText(/add onions to the mixture/i);

            const addInstructionButton = screen.getByPlaceholderText(/add instruction/i);
            const submitButton = screen.getByRole('button', { name: /submit/i });

            userEvent.type(titleTextbox, 'new title');
            userEvent.type(descriptionTextbox, 'new description');
            userEvent.type(servingTextbox, 'new serving');
            userEvent.type(cookTimeTextbox, 'new cook time');

            userEvent.type(instructionTextbox, '1. add rotten tomatoes');
            userEvent.click(addInstructionButton);

            userEvent.click(submitButton);

            const timesActionDispatched = recipeUpdateAction.mock.calls.length;
            expect(timesActionDispatched).toBe(0);
        });
        test('submitting recipeCreateForm with empty ingredients array is forbidden', () => {
            const titleTextbox = screen.getByPlaceholderText(/title/i);
            const descriptionTextbox = screen.getByPlaceholderText(/description/i);
            const cookTimeTextbox = screen.getByPlaceholderText(/1hr 30min/i);
            const servingTextbox = screen.getByPlaceholderText(/2 people/i);
            const ingredientTextbox = screen.getByPlaceholderText(/2 onions/i);
            const addIngredientButton = screen.getByPlaceholderText(/add ingredient/i);

            const submitButton = screen.getByRole('button', { name: /submit/i });

            userEvent.type(titleTextbox, 'new title');
            userEvent.type(descriptionTextbox, 'new description');
            userEvent.type(servingTextbox, 'new serving');
            userEvent.type(cookTimeTextbox, 'new cook time');

            userEvent.type(ingredientTextbox, '1. 2 cucumbers');
            userEvent.click(addIngredientButton);

            userEvent.click(submitButton);

            const timesActionDispatched = recipeUpdateAction.mock.calls.length;
            expect(timesActionDispatched).toBe(0);
        });
    });
});
