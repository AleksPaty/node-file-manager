import { homedir } from 'os';
import * as readline from 'node:readline';
import { goWorkingDirectory, goDedicatedDir, showAllInDirectory } from './navigation.js';
import { fileRider, createFile, renameFile, copyFile, removeFile, deleteFile } from './operationsWFiles.js';
import { getOsResponse } from './operationSystemInfo.js';
import { calcHash } from './hashCalculate.js';
import { compressFile, decompessFile } from './zipOperations.js';


const great = async() => {
    try {
        const user = process.argv.find((arg) => arg.includes("--username")).replace('--username=',"")
        const homeDir = homedir()
        let workingDir = await goWorkingDirectory(homeDir)
        
        console.log(`Welcome to the File Manager, ${user}!`)
        console.log(`You are currently in ${workingDir}`)

        const indexLine = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        indexLine.on('line', async(line) => {
            let command = line.slice(0, 2);
            switch(command) {
                case 'up':
                    workingDir = await goWorkingDirectory(workingDir, 'up')
                    break;
                case 'cd':
                    let targetPath = line.slice(3)
                    workingDir = await goDedicatedDir(workingDir, targetPath)
                    break;
                case 'ls':
                    let list = await showAllInDirectory(workingDir)
                    console.table(list)
                    break;
                case 'ca':
                    if(line.includes('cat')) {
                        let targetFile = line.slice(4)
                        await fileRider(workingDir, targetFile)
                    } else console.log('Invalid input')
                    break;
                case 'ad':
                    if(line.includes('add')) {
                        let fileName = line.slice(4)
                        await createFile(workingDir, fileName)
                    } else console.log('Invalid input')
                    break;
                case 'rn':
                    await renameFile(workingDir, line.slice(3))
                    break;
                case 'cp':
                    await copyFile(workingDir, line.slice(3))
                    break;
                case 'mv':
                    await removeFile(workingDir, line.slice(3))
                    break;
                case 'rm':
                    let deletingFile = line.slice(3)
                    await deleteFile(deletingFile)
                    break;
                case 'os':
                    let command = line.slice(3)
                    await getOsResponse(command).then((res) => console.log(res))
                    break;
                case 'ha':
                    if(line.includes('hash')) {
                        let pathFile = line.slice(5)
                        await calcHash(pathFile)
                    }
                    break;
                case 'co':
                    if(line.includes('compress')) {
                        let [PathFile, PathCompress] = line.slice(9).split(' ')
                        await compressFile(PathFile, PathCompress)
                    } else console.log('Invalid input')
                    break
                case 'de':
                    if(line.includes('decompress')) {
                        let [PathCompress, PathFile] = line.slice(11).split(' ')
                        await decompessFile(PathCompress, PathFile)
                    } else console.log('Invalid input')
                    break
                case '.e':
                    if(line.includes('.exit')) {
                        indexLine.write(`Thank you for using File Manager, ${user}, goodbye!`)
                        indexLine.close();
                    }
                    break;
                default:
                    console.log('Invalid input')
            }
            if(line !== '.exit') {
                process.stdout.write(`You are currently in ${workingDir}\n`)
            }
        })
        indexLine.on('SIGINT', () => {
            indexLine.write(`Thank you for using File Manager, ${user}, goodbye!`)
            indexLine.close()
        })
    } catch (error) {
        console.log(error)
    }
    // readline
}

await great()