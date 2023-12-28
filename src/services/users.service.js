import { UserManager } from '../dao/factory.js';
import { userPath } from '../utils.js';
import  UserManagerRepository  from '../repositories/users.repository.js';
const userManager = new UserManager(userPath);
const userManagerRepository= new UserManagerRepository(userManager);