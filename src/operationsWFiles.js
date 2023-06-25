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

export const renameFile = async(oldPath, newFileName, text="It's done!") => {
    try {
        let filePath = path.dirname(oldPath)
        await fs.rename(oldPath, `${filePath}/${newFileName}`)
            .then(() => console.log(text))
            .catch((err) => {throw err})
    } catch (err) {
        console.log('Operation failed')
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