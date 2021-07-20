// TODO - change PropTypes id to .isRequired
// TODO test propTypes

import PropTypes from 'prop-types';
import React from 'react';
import Router from 'next/router';
import { recipeDeleteAction } from '../../redux/actions/recipe';
import { useDispatch } from 'react-redux';

const RecipeDelete = ({ id }) => {
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        try {
            dispatch(recipeDeleteAction({ id }));
            Router.push('/');
        } catch {
            // TODO - add err msg
        }
    };

    return (
        <div data-testid='recipeDelete'>
            <form onSubmit={(e) => onSubmit(e)}>
                <button type='submit'>delete Recipe</button>
            </form>
        </div>
    );
};

RecipeDelete.propTypes = {
    id: PropTypes.string,
};

export default RecipeDelete;