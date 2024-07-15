import { Schema, model, models } from 'mongoose';

const CheffSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Cheff = models.Cheff || model('Cheff', CheffSchema);

export default Cheff;
