const User = require('./models/User')
const bcrypt = require('bcrypt')


const manualAdmin = async () => { // res, req avasaram ledu ikkada
    try {
        const adminEmail = 'admin@gmail.com';
        const hashed = await bcrypt.hash('admin', 10);
        
        // Role tho kakunda Email tho check cheyi
        const existingUser = await User.findOne({ email: adminEmail });

        if (!existingUser) {
            await User.create({
                name: 'admin',
                email: adminEmail,
                password: hashed,
                role: 'admin',
            });
            console.log("Admin Created successfully");
        } else {
            console.log("User with this email already exists");
            
            if(existingUser.role !== 'admin'){
                existingUser.role = 'admin';
                await existingUser.save();
                console.log("Existing user promoted to Admin");
            }
        }
    } catch (err) {
        console.error("Error in manualAdmin:", err.message);
    }
}

manualAdmin();

module.exports = {manualAdmin}
