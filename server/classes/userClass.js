class User{
    constructor(firstName, lastName, username, email, password, role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    checkNullAttributes(){
        return Object.values(this).some(key => key === null || key === undefined);
    }

    displayAttributes(){
        Object.entries(this).forEach(([key, value]) => {console.log(`${key}: ${value}`)});
    }
    
}

module.exports = {
    User
}