let fs = require('fs').promises
let path = require('path')


let directoryList = function(dir) {
    let promises = []
    return fs.readdir(dir, { withFileTypes: true }).then(function(dirents) {
            for(let dirent of dirents) {
                let path = `${dir}/${dirent.name}`
                if (dirent.isDirectory()) {
                    let p = directoryList(path).then((dirents) => {
                        let o = {
                            type: 'directory',
                            path: path,
                            name: dirent.name,
                            dirents: dirents
                        }
                        return o
                    })
                    promises.push(p)
                } else if (dirent.isFile()) {
                    let o = {
                        type: 'file',
                        path: path,
                        name: dirent.name,
                    }
                    promises.push(Promise.resolve(o))
                } else {
                    //
                }
            }
            return Promise.all(promises)
        })
}

let __main = function() {
    directoryList('./englishpod').then((dirs) => {
        let json = JSON.stringify(dirs, null, 4)
        let code = `let englishpodData = ${json}`
        fs.writeFile('./englishpod_data.js', code)
    })
}

__main()


