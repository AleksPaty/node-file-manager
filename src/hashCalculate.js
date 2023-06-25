import crypto from 'crypto';
import fs from 'fs/promises';

export const calcHash = async(file) => {
    let content = await fs.readFile(file, 'utf8')
    const hash = crypto.createHash('sha256')
    hash.update(content)
    let result = hash.digest('hex')
    console.log(result)
}