const mp3Duration = require('mp3-duration');
const fs = require('fs');

const folder = './media/german/';

const promises = [];
const results = [];

fs.readdir(folder, (err, files) => {
    if (err) {
        return console.log(err.message);
    }

    for (let file of files) {
        promises.push(new Promise((resolve, reject) => {
            mp3Duration(folder + file, (err, duration) => {
                if (err) {
                    reject(err.message);
                }

                results.push(file + ' is ' + duration + ' seconds long');

                resolve();
            });
        }));
    }

    Promise.all(promises).then(() => {
        console.log(results.sort());
    }).catch((err) => {
        console.log('error:', err);
    });
});

