import mongoose, { Document, Schema } from 'mongoose';

interface Iceff extends Document {
    name: string;
    email: string;
    password: string;
}

const CheffSchema: Schema = new Schema({
    name:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const cheff = mongoose.model<Iceff>('cheff', CheffSchema);
export default cheff;
