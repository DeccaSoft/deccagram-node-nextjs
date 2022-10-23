import multer from "multer";
import cosmicjs from "cosmicjs";

const {CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env;

//Criando instancias
const Cosmic = cosmicjs();

//Criando od Buckets
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES
});

//Utilizando o Storage do Multer em Memória
const storage = multer.memoryStorage();
//Criando função de upload do multer em cima do storage criado
const upload = multer({storage : storage});

//Regra de Negócio
const uploadImagemCosmic = async(req : any) => {    
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };
        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media : media_object});
        }else{
            return await bucketAvatares.addMedia({media : media_object});
        }
    }
}

export {upload, uploadImagemCosmic};