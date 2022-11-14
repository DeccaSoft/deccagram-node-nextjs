import type { NextApiRequest, NextApiResponse } from "next";
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {LoginResposta} from '../../types/LoginResposta';
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from 'jsonwebtoken';
import { politicaCORS } from "../../middlewares/politicaCORS";


const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | LoginResposta>   //res é uma resposta padrão ou qualquer coisa! Depois any será transformado em um objeto... e foi substituído por LoginResposta
) => {
    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro: 'ENV JWT NÃO Informada!'});
    }

    if(req.method === 'POST'){
        const {login, senha} = req.body;    //Destructor (Desconstroi um objeto)
        const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];

            const token = jwt.sign({_id : usuarioEncontrado._id}, MINHA_CHAVE_JWT);
            //return res.status(200).json({msg: `Usuário ${usuarioEncontrado.nome} Autenticado com Sucesso!`});
            return res.status(200).json({
                nome: usuarioEncontrado.nome, 
                email: usuarioEncontrado.email, 
                token});

        }
        return res.status(400).json({erro: 'Usuário e/ou Senha Inválido(s)!'});
    }
    return res.status(405).json({erro: 'O Método Informado NÃO é Válido!'});
}

export default politicaCORS(conectarMongoDB(endpointLogin));