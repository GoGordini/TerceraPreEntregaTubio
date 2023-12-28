//Esto no está en uso.
import UsersDto from '../DTO/users.dto.js';

export default class UsersRepository {
    constructor (dao){
        this.dao=dao;
    }

    getUsers = async() => {
        const result = await this.dao.get();
        return result;
    }

    createUser = async (user) => {
        const userToInsert = new UsersDto(user);
       // const result = await this.dao.create(userToInsert);
        return userToInsert;
    }
}

//recibe como parámetro el dao con el que nos vamos a conectar. Luego hago la implementación del CRUD.
//En el router, en lugar de importar 