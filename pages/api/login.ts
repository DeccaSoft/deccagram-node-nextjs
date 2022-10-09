import type { NextApiRequest, NextApiResponse } from "next";
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';

const endpointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;
        if(login === 'admin@admin.com' && senha === 'Admin@123'){
            return res.status(200).json({msg: 'Usuário Autenticado com Sucesso!'});
        }
        return res.status(400).json({erro: 'Usuário e/ou Senha Inválido(s)!'});
    }
    return res.status(405).json({erro: 'O Método Informado NÃO é Válido!'});
}

export default conectarMongoDB(endpointLogin);