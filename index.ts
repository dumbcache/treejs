import fs from "fs/promises";
import path from "path";
import chalk, { ChalkInstance } from "chalk";

const hLine = "\u2500";
const vLine = "\u2502";
const colors = [
    chalk.red,
    chalk.green,
    chalk.blue,
    chalk.yellow,
    chalk.cyan,
    chalk.magenta,
];
const rand = () => Math.round(Math.random() * (colors.length - 1));
const initColor = colors[rand()];

const readFilesInternal = async (
    readFrom: string,
    color: ChalkInstance = initColor,
    space: string = ""
) => {
    let padding = initColor(vLine) + space;
    let dirColor = colors[rand()];
    while (dirColor === color) {
        dirColor = colors[rand()];
    }
    const files = await fs.readdir(readFrom);
    for (let file of files) {
        process.stdout.write(padding);
        let filePath = path.resolve(readFrom, file);
        const fileData = await fs.lstat(filePath);
        if (fileData.isDirectory()) {
            console.log(color(hLine) + " " + dirColor("./" + file));
            await readFilesInternal(
                filePath,
                dirColor,
                space + "  " + dirColor(vLine)
            );
        } else {
            console.log(color(hLine) + " " + file);
        }
    }
};

export const readFiles = (readFrom: string) => {
    console.log(initColor(readFrom));
    readFilesInternal(readFrom);
};

const readFrom = "/home/dumbcache/Desktop";
readFiles(readFrom);
