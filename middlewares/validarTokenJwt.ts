import { JwtPayload } from './../node_modules/@types/jsonwebtoken/index.d';
import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';
import jwt from 'jsonwebtoken';

export const validarTokenJwt = (handler : NextApiHandler) => 
    (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {
        try {
            const {MINHA_CHAVE_JWT} = process.env;
        if(!MINHA_CHAVE_JWT){
            return res.status(500).json({erro: 'ENV de Chave JWT NÃO informada na Execução do Projeto!'});
        }
        if(!req || !req.headers){
            return res.status(401).json({erro: 'NÃO foi Possível validar o Token de Acesso!'});
        }
        if(req.method !== 'OPTIONS'){
            const authorization = req.headers['authorization'];
            if(!authorization){
                return res.status(401).json({erro: 'NÃO foi Possível validar o Token de Acesso!'});
            }
            
            const token = authorization.substring(7);
            if(!token){
                return res.status(401).json({erro: 'NÃO foi Possível validar o Token de Acesso!'});
            }

            const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
            if(!decoded){
                return res.status(401).json({erro: 'NÃO foi Possível validar o Token de Acesso!'});
            }

            if(!req.query){
                req.query = {};
            }
            req.query.userId = decoded._id;
        }
        } catch (e) {
            console.log(e)
            return res.status(401).json({erro: 'NÃO foi Possível validar o Token de Acesso!'});
        }

        
    return handler(req, res);
};