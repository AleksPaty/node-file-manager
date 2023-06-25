import os from 'os';

export const getOsResponse = async(command) => {
    switch(command) {
        case '--EOL':
            return os.EOL
        case '--cpus':
            return os.cpus()
        case '--homedir':
            return os.homedir()
        case '--username':
            return os.hostname()
        case '--architecture':
            return os.platform()
        default:
            console.log('Invalid input')
    }
}