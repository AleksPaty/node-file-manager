import fs from 'fs/promises';
import path from 'path';

export async function goWorkingDirectory(dirpath, cmd = '') {
    try {
        dirpath = path.normalize(dirpath)
        if(dirpath.split(path.sep).length > 1 && cmd === 'up') {
            let newDir = dirpath.split(path.sep).slice(0, -1).join(path.sep)
            return (await fs.opendir(newDir)).path
        } else {
            return (await fs.opendir(dirpath)).path
        }
    } catch (error) {
        console.error(error)
    }
}

export async function goDedicatedDir(curDir, nextDir) {
    try {
        nextDir = path.normalize(nextDir)
        if(path.isAbsolute(nextDir) && typeof(nextDir) === 'string') {
            return (await fs.opendir(nextDir)).path
        } else if(typeof(nextDir) === 'string') {
            let newDir = path.join(curDir, nextDir)
            return (await fs.opendir(newDir)).path
        }
        throw new Error(`${nextDir} is not path`)
    } catch (error) {
        console.log(`Operation failed: ${error}`)
        return curDir
    }
}

export async function showAllInDirectory(dir) {
    try {
        let itemList = await fs.readdir(dir, {withFileTypes: true})
        let list = itemList.map((dirent) => {
            return dirent.isFile()
                        ? {Name: dirent.name, Type: 'file'}
                        : {Name: dirent.name, Type: 'directory'}
        })
        
        list.sort((a, b) => a.Type.localeCompare(b.Type))
        return list
    } catch (error) {
        console.log(`Operation failed: ${error}`)
    }
}