import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Función para encontrar un usuario en la base de datos
   * @param email correo del usuario que se busca
   * @returns {User} objeto de usuario
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).lean();
  }

  /**
   * 
   * @param email 
   * @param newUserData 
   * @returns 
   */
  async updateLastConnection(email: string, last_connection: number): Promise<User | null>{
    return await this.userModel.findOneAndUpdate({ email }, { last_connection }).lean()
  }

  async setCredits(email: string, credit: number): Promise<User | null> {
    return await this.userModel.findOneAndUpdate({ email }, { credit }).lean()
  }


  /**
   * Función para crear un nuevo usuario en MongoDB
   * @param userData el objeto del nuevo usuario
   * @returns {User} el objeto del nuevo usuario en la base de datos
   */
   async register(userData: User): Promise<User | null> {
    console.log("[Operación]: creando usuario");

    const user = await this.findUserByEmail(userData.email);

    if (user) {
      throw new HttpException({ status: HttpStatus.FORBIDDEN, error: "El e-mail ingresado ya está registrado, prueba con otro o ingresa a tu cuenta" }, HttpStatus.FORBIDDEN);
    }

    // Generar contraseña encriptada
    const saltRounds = 10;
    const cryptedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const userObjectDB = { email: userData.email, password: cryptedPassword };

    const createdUserModel = new this.userModel(userObjectDB);
    
    // Guardamos esto en la base de datos
    return createdUserModel.save();
  }

}