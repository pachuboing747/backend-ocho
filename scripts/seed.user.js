const faker = require('faker');
const userModel = require('../dao/models/userModel.js')
const mongoose = require('mongoose')

// function generateUsersRecord(count) {
//   const users = [];

//   for (let i = 0; i < count; i++) {
//     const firstname = faker.name.firstName();
//     const lastname = faker.name.lastName();
//     const email = faker.internet.email(firstname, lastname);
//     const gender = faker.random.arrayElement(['Male', 'Female']);
//     const role = faker.random.arrayElement(['Admin', 'Customer']);

//     users.push({ firstname, lastname, email, gender, role });
//   }

//   return users;
// }

// const numberOfUsers = 5000;
// const usersRecords = generateUsersRecord(numberOfUsers);

// console.log(usersRecords)

async function main() {
    await mongoose.connect("mongodb+srv://pachu1982721:VPXombCDAVDvOaVQ@cluster0.lvefot0.mongodb.net/ecommerce?retryWrites=true&w=majority")
//   const result = await userModel.insertMany(usersRecords)

  const result = await userModel.find({ lastname: "Grant" }).explain("executionStats")

  console.log(result)

  await mongoose.disconnect()
}

main()