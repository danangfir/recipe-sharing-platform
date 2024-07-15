import loginAndGetToken from './loginAndGetToken';
import addRecipe from './addRecipe';

async function loginAndAddRecipe(email, password, title, description, labels, file) {
  try {
    const token = await loginAndGetToken(email, password);
    const recipe = await addRecipe(token, title, description, labels, file);
    console.log('Recipe added:', recipe);
  } catch (error) {
    console.error('Error:', error);
  }
}

export default loginAndAddRecipe;
