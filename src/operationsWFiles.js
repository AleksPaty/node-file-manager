import fs from 'fs/promises';
import { createReadStream, createWriteStream, read } from 'fs';
import path from 'path';

export const separatePath = async(curDir, data) => {
    let arrA = data.split('.')
    let result = []
    let typeFile = arrA[1].slice(0, arrA[1].indexOf(' '))

    let pathFile = path.normalize([arrA[0], typeFile].join('.'))
    if(!path.isAbsolute(pathFile)) {   
        pathFile = path.join(curDir, pathFile)
    }

    let newPath = arrA[1].slice((typeFile.length + 1))
    if(!path.isAbsolute(newPath)) {
        newPath = path.join(curDir, newPath)
        newPath = [newPath, path.sep, path.basename(pathFile)].join('')
    } else {
        newPath = [newPath, path.sep, path.basename(pathFile)].join('')
    }
    result.push(pathFile, newPath, typeFile)
    return result
}

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

export const copyFile = async(curDir, data, text="It's done!") => {
    try {
        const [pathFile, newPath] = await separatePath(curDir, data)
        
        await fs.copyFile(pathFile, newPath, fs.constants.COPYFILE_EXCL)
            .catch((err) => {throw err})

        let readBaseFile = await createReadStream(pathFile)
        let writeNewFile = await createWriteStream(newPath)

        readBaseFile.pipe(writeNewFile)
        writeNewFile.on('close', () => console.log(text))
    } catch (err) {
        console.log('Operation failed')
    }
}

export const removeFile = async(curDir, data, text="It's done!") => {
    try {
        const [pathFile, newPath] = await separatePath(curDir, data)
        fs.copyFile(pathFile, newPath).catch((err) => {throw err})

        let readBaseFile = await createReadStream(pathFile)
        let writeNewFile = await createWriteStream(newPath)

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