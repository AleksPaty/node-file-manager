import { createReadStream, createWriteStream, readFile } from 'fs';
import path from 'path'
import zip from 'zlib';

export const compressFile = async(pathFile, compressPath) => {
    try {
        let nameFIle = path.basename(pathFile).split('.')[0]
        compressPath = path.normalize(compressPath)

        const compress = zip.createBrotliCompress({
            params: {[zip.constants.BROTLI_PARAM_MODE]: zip.constants.BROTLI_MODE_TEXT}
        })

        const readFile = createReadStream(pathFile)
        const writeCompress = createWriteStream(`${compressPath}${path.sep}${nameFIle}.br`)

        readFile.pipe(compress).pipe(writeCompress)
        console.log("It's done!")
    } catch (error) {
        console.log('Operation failed')
    }
    
}

export const decompessFile = async(compressPath, pathFile) => {
    try {
        let nameFIle = path.basename(compressPath).split('.')[0]
        let decompressPath = path.normalize(pathFile)

        const decompess = zip.createBrotliDecompress()
        const readCompress = createReadStream(compressPath)
        const writeDecompress = createWriteStream(`${decompressPath}${path.sep}${nameFIle}.txt`)

        readCompress.pipe(decompess).pipe(writeDecompress)
        console.log("It's done!")
    } catch (error) {
        console.log('Operation failed')
    }
}