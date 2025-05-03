const bcrypt = require('bcrypt');
const plainPassword = 'password'; // Replace with the actual password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("Plain Password:", plainPassword);
    console.log("Bcrypt Hash:", hash);
    // Copy this hash value into your SQL INSERT statement
});