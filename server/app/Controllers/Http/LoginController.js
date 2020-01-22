'use strict'

const User = use("App/Models/User");

class LoginController {

    async login({request, auth}){
        const {email, password} = request.all()

        const token = await auth.attempt(email, password)
        return token
    }
    
    async signin({request, response}){
        const {name, email, password} = request.all()

        try{
            const user = await User.create({
                email,
                password,
                name
            })

            const result = user.toJSON();
            return {
                email: result.email,
                name: result.name,
                message: "User created succesfully"
            }

        }catch(e){
            return response.status(e.status).json({
                message: e.message
            });
        }
    }
}

module.exports = LoginController