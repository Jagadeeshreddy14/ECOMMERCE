const Category = require("../models/Category");

const categories = [
  

 
  { _id: "65a7e24602e12c44f5994431", name: "home-decoration" },
  { _id: "65a7e24602e12c44f5994432", name: "furniture" },
  
  { _id: "65a7e24602e12c44f5994434", name: "womens-dresses" },


 
  { _id: "65a7e24602e12c44f599443a", name: "womens-bags" },
  { _id: "65a7e24602e12c44f599443b", name: "womens-jewellery" },
  
  { _id: "65a7e24602e12c44f599443f", name: "lighting" },
];

exports.seedCategory = async () => {
  try {
    await Category.insertMany(categories);
    console.log("Category seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
