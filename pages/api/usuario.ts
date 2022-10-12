import type {NextApiRequest, NextApiResponse} from 'next';
import {validarTokenJwt} from '../../middlewares/validarTokenJwt';

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse) => {
    return res.status(200).json('Usuário Autenticado com Sucesso!');
}

export default validarTokenJwt(usuarioEndpoint);