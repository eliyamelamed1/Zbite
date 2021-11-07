import { useDispatch, useSelector } from 'react-redux';

import DisplayRecipes from '../../components/recipes/DisplayRecipes';
import Router from 'next/router';
import { loadSavedRecipesAction } from '../../redux/actions/recipeActions';
import { pageRoute } from '../../globals';
import styles from '../../styles/pages/home.module.scss';
import { useEffect } from 'react';

const SavedRecipes = () => {
    const dispatch = useDispatch();
    const { listOfSavedRecipes } = useSelector((state) => state.recipeReducer);
    const { isUserAuthenticated } = useSelector((state) => state.userReducer);

    useEffect(() => {
        try {
            isUserAuthenticated || Router.push(pageRoute().login);
            dispatch(loadSavedRecipesAction());
        } catch {}
    }, [dispatch, isUserAuthenticated]);

    return (
        <section className={styles.container}>
            {listOfSavedRecipes && (
                <div className={styles.recipes_container}>
                    <DisplayRecipes recipesToDisplay={listOfSavedRecipes} />
                </div>
            )}
        </section>
    );
};
export default SavedRecipes;
