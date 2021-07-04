// test useEffect dispatch action
// test use list is displayed

import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import DisplayRecipes from './DisplayRecipes';
import { loadRecipeListAction } from '../../redux/actions/recipe';

const recipeList = () => {
    const recipeListData = useSelector((state) => state.recipeReducer.recipeListData);
    const dispatch = useDispatch();
    useEffect(() => {
        try {
            dispatch(loadRecipeListAction());
        } catch {
            // TODO - display err msg
        }
    }, [dispatch]);

    return (
        <main>
            <div data-testid='recipeList'></div>
            {recipeListData ? <DisplayRecipes recipes={recipeListData} /> : null}
        </main>
    );
};

export default connect()(recipeList);
