import fs from 'fs/promises';
import { createReadStream, createWriteStream, read } from 'fs';
import path from 'path';

export const fileRider = async(filepath, filename) => {
    try {
        let fileDir = path.join(filepath, filename)
        await fs.access(fileDir, fs.constants.F_OK).catch((err) => {throw err})
        
        let content = await createReadStream(fileDir)
        content.pipe(process.stdout)
    } catch(err) {
        console.log('Operation failed')
    }
}

export const createFile = async(curDir, filename) => {
    try {
        let _filename = path.join(curDir, filename)
        await fs.appendFile(_filename,"").catch((err) => {throw err})
    } catch(err) {
        console.log('Operation failed')
    } 
}

export const renameFile = async(curDir, data, text="It's done!") => {
    try {
        const pathObj = path.parse(data)
        let pathToFile;
        if(path.isAbsolute(pathObj.dir)) {
            pathToFile = path.normalize(pathObj.dir);
        } else { 
            pathToFile = path.join(curDir, path.normalize(pathObj.dir))
        }

        const typeFile1 = path.extname(pathObj.name).slice(0, path.extname(pathObj.name).indexOf(' '))
        const typeFile2 = pathObj.ext       
        let [oldNameFile, newNameFile] = pathObj.name.split(typeFile1)
        if(newNameFile.startsWith(' ')) newNameFile = newNameFile.slice(1)

        await fs.rename(`${pathToFile}${path.sep}${oldNameFile}${typeFile1}`, `${pathToFile}${path.sep}${newNameFile}${typeFile2}`)
            .then(() => console.log(text))
            .catch((err) => {throw err})
    } catch (err) {
        console.log(`Operation failed: ${err}`)
    }
}

export const copyFile = async(basePath, newPath, text="It's done!") => {
    try {
        await fs.copyFile(basePath, newPath, fs.constants.COPYFILE_EXCL)
            .catch((err) => {throw err})

        let readBaseFile = await createReadStream(basePath)
        let writeNewFile = await createWriteStream(newPath)

        readBaseFile.pipe(writeNewFile)
        writeNewFile.on('close', () => console.log(text))
    } catch (err) {
        console.log('Operation failed')
    }
}

export const removeFile = async(pathFile, newDir, text="It's done!") => {
    try {
        fs.copyFile(pathFile, newDir).catch((err) => {throw err})

        let readBaseFile = await createReadStream(pathFile)
        let writeNewFile = await createWriteStream(newDir)

        readBaseFile.pipe(writeNewFile)
        if(writeNewFile.writable) {
            fs.rm(pathFile)
            console.log(text)
        }
    } catch (err) {
        console.log('Operation failed')
    }
}

export const deleteFile = async(pathFile, text="It's done!") => {
    fs.rm(pathFile)
        .then(() => console.log(text))
        .catch(() => console.log('Operation failed'))
}