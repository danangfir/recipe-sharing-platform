import { Schema, model, models } from 'mongoose';

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  labels: {
    type: [String],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cheff: {
    type: Schema.Types.ObjectId,
    ref: 'Cheff',
    required: true,
  },
}, { timestamps: true });

const Recipe = models.Recipe || model('Recipe', RecipeSchema);

export default Recipe;
