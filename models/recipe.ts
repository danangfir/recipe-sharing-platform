import mongoose, { Document, Schema } from 'mongoose';

interface Irecipe extends Document {
    title: string;
    description: string;
    imageUrl: string;
    cheff: mongoose.Types.ObjectId;
    labels: string[];
    createdAt: Date;
}

const RecipeSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cheff: { type: mongoose.Types.ObjectId, ref: 'cheff', required: true},
    labels: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model<Irecipe>('Recipe', RecipeSchema);
export default Recipe;
