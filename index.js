const fs = require('fs');
const sharp = require('sharp');
const argv = require('minimist')(process.argv.slice(2));

let { input, output, width, height, quality } = argv;

const banner = "\n\n [USAGE:] \n\n" +
    "node index.js " +
    "--input (image input dir) " +
    "--output (image output dir) " +
    "--width (new width image)" +
    " --height (new height imag)" +
    " --quality (new quality imag)";

const compressImg = (image, output, width, height, quality) => isDir =>

    fs.readFile(image, (err, buffer) => {
        if (err) return console.log(`error ao abrir a imagem ${image}`);

        const img_file = image.split("/").pop().split('.')[0] + ".webp";

        const dirSave = !isDir(output + img_file) ? `${output}/${img_file}` : output + img_file

        sharp(buffer)
            .resize(width, height)
            .toFormat('webp')
            .webp({ quality })
            .toFile(dirSave, (err, info) => {
                err
                    ? console.log(`${img_file} ==> error`)
                    : console.log(`${img_file} ==> ok`)
            });
    })

const getImages = dir => {
    const allowed = ['jpg', 'jpeg', 'png', 'webp'];

    try {
        const files = fs.readdirSync(dir);
        return files.filter((file) => file &&
            allowed.includes(file.split('.')[1]))

    } catch (err) {
        return console.log('dir not found');
    }
}


const existDirectory = dir => {
    try {
        fs.accessSync(dir);
        return true;
    } catch (err) {
        return false
    }
}


const init = (input, output, height, width, quality) => images => compress => isDir =>
    images(input)
        .map(image => {
            const img = !isDir(input + image) ? `${input}/${image}` : `${input}${image}`
            compress(img, output, height, width, quality)(isDir);
        });



!input || !output || !width || !height || !quality
    ? console.log(banner)
    : !existDirectory(input) || !existDirectory(output)
        ? console.log("directory no found")
        : init(input, output, width, height, quality)
            (getImages)(compressImg)(existDirectory);