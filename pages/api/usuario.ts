import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJwt} from '../../middlewares/validarTokenJwt';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from './../../models/UsuarioModel';

const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg> | any) => {
    try {
        //Recuperando o Id do Usuário
        const {userId} = req?.query;
        //Buscando Dados do Usuário
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);

    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro : 'Não foi possível obter Dados do Usuário!'});
}

export default validarTokenJwt(conectarMongoDB(usuarioEndpoint));