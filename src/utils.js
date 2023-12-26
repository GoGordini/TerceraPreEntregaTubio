import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import bcrypt from "bcrypt";
import configs from "./config.js";
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const productPath = join (__dirname,"./files/productos.json");
export const  cartPath = join (__dirname, "./files/carritos.json")
export const  chatPath = join (__dirname, "./files/chats.json")

//1. hashear nuestra contraseña
export const createHash = password => //paso como parámetro password a hashear
        bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //primer parámetro es lo que quiero hashear, segundo el número de rondas de hasheo (se recomienda 10)
    //1234
    //ASDASD435@#$#$

//2. validar nuestro password
export const isValidPassword = (plainPassword, hashedPassword) => //plainpassword es lo que valida el usuario, hashedpassword es lo que ya tenemos guardado hasheado.
    bcrypt.compareSync(plainPassword, hashedPassword);

export const generateToken = (user) => {
        const token = jwt.sign({ user }, configs.privateKeyJWT, { expiresIn: '1h' });
        return token;
    }
//Autenticación primer paso lo hace passport
//req.user = {}
export const authorization = (role) => {
    return async (req, res, next) => {
        if(req.user.role !== role) return res.status(403).send({ status: 'error', message: 'no permissions' })
        next();
    }
}
// export const authToken = (req, res, next) => {
//         //1. validamos que el token llegue en los headers del request
//         const authToken = req.headers.authorization; 
    
//         if(!authToken) return res.status(401).send({ status: 'error', message: 'No token provided' });
    
//         //Bearer DFJGKSDNFJGKSDNFGK345656398U5GSDFNGKJSDNFG23485KDFGNJSDG
//         // {
//         //     user: {
//         //         name: 'alex',
//         //         email: 'ap@gmail.com'
//         //     }
//         // }
//         const token = authToken.split(' ')[1];
//         //2. Validar el jwt
//         jwt.verify(token, configs.privateKeyJWT, (error, credentials) => {
//             if (error) return res.status(401).send({ status: 'error',  message: 'Not authenticated'});
//             req.user = credentials.user;
//             next();
//         })
//     }
    