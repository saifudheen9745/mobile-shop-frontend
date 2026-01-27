import mongose from "mongoose";


const CategorySchema = new mongose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
});

export default mongose.model("Category", CategorySchema);