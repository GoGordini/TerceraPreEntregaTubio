import {chatsModel} from "./models/chats.model.js";
        
export default class Chats {
constructor (){
}

getAll = async ()=>{
const messages = await chatsModel.find().lean();
// el .lean() pasa de BSON a POJO:
return messages;
}

save = async (message) => {
const result = await chatsModel.create(message);
return result;
}


}