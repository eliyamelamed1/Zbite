// TODO - change PropTypes id to .isRequired
// test onSubmit dispatch actiob
// test form calls onSubmit

import React, { useState } from 'react';

import GeneralForm from '../../forms/recipeCreate/GeneralForm';
import IngredientForm from '../../forms/recipeCreate/IngredientForm';
import InstructionForm from '../../forms/recipeCreate/InstructionForm';
import UiOptionsButton from '../ui/optionsForm/UiOptionsButton';
import UiPopUp from '../ui/UiPopUp';
import UiSectionSeparator from '../ui/UiSectionSeperator';
import { recipeUpdateAction } from '../../redux/actions/recipeActions';
import styles from '../../styles/pages/recipeCreate.module.scss';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

interface StateTypes {
    photoMain: null | File;
    photoMainBlob: string;
    title: string;
    description: string;
    cookTime: string;
    serving: string;
    instructionList: any[];
    ingredientList: any[];

    instruction: string;
    ingredient: string;
    modifiedText: string;
    inputId: string;
}

const RecipeUpdate: React.FC<{ id: string }> = ({ id }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<StateTypes>({
        // recipe fields
        photoMain: null,
        photoMainBlob: '',
        title: '',
        description: '',
        cookTime: '',
        serving: '',
        instructionList: [],
        ingredientList: [],

        // functionality fields
        instruction: '',
        ingredient: '',
        modifiedText: '',
        inputId: '',
    });
    const {
        photoMain,
        photoMainBlob,
        title,
        description,
        cookTime,
        serving,
        instructionList,
        ingredientList,

        instruction,
        ingredient,
        modifiedText,
        inputId,
    } = formData;
    const [displayForm, setDisplayForm] = useState(false);

    const onChangeText = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onChangeImage = async (e) => {
        try {
            setFormData((prevState) => ({ ...prevState, photoMain: e.target.files[0] as File }));
            const imageBlob = await URL.createObjectURL(e.target.files[0]);
            setFormData((prevState) => ({ ...prevState, [e.target.name]: imageBlob }));
        } catch {}
    };
    const onSubmit = (e) => {
        e.preventDefault();
        try {
            const ingredientsTextList = ingredientList.map((ingredient) => ingredient.text);
            const instructionsTextList = instructionList.map((instruction) => instruction.text);

            if (ingredientsTextList.length === 0) return toast.error('ingredients is not allowed to be empty');
            if (instructionsTextList.length === 0) return toast.error('instructions is not allowed to be empty');

            dispatch(
                recipeUpdateAction({
                    id,
                    photoMain,
                    title,
                    description,
                    serving,
                    cookTime,
                    ingredientsTextList,
                    instructionsTextList,
                })
            );
            setDisplayForm(false);
        } catch {}
    };

    const recipeUpdateForm = (
        <UiPopUp onSubmit={onSubmit} setDisplayForm={setDisplayForm}>
            <h1>Update Recipe</h1>
            {GeneralForm({ onChangeImage, photoMainBlob, onChangeText, title, description, cookTime, serving })}
            <UiSectionSeparator />
            {IngredientForm({ onChangeText, ingredient, setFormData, ingredientList, inputId, modifiedText })}
            <UiSectionSeparator />
            {InstructionForm({ onChangeText, instruction, setFormData, instructionList, inputId, modifiedText })}
            <UiSectionSeparator />
            <button className={styles.create_button}>Submit</button>
        </UiPopUp>
    );

    return (
        <div data-testid='recipeUpdate'>
            <form onClick={() => setDisplayForm(!displayForm)}>
                <UiOptionsButton>Update Recipe</UiOptionsButton>
            </form>
            {displayForm && recipeUpdateForm}
        </div>
    );
};

export default RecipeUpdate;
