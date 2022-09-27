import fs from "fs/promises";
import path from "path";
import chalk, { ChalkInstance } from "chalk";
import { dir } from "console";

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
    let dirs: string[] = [],
        fls: string[] = [];

    let padding = initColor(vLine) + space;
    let dirColor = colors[rand()];
    while (dirColor === color) {
        dirColor = colors[rand()];
    }
    const files = await fs.readdir(readFrom);

    for (let file of files) {
        let filePath = path.resolve(readFrom, file);
        const fileData = await fs.lstat(filePath);
        if (fileData.isDirectory()) {
            dirs.push(file);
            continue;
        }
        fls.push(file);
    }

    for (let file of fls) {
        process.stdout.write(padding);
        console.log(color(hLine) + " " + file);
    }
    for (let dir of dirs) {
        process.stdout.write(padding);
        let filePath = path.resolve(readFrom, dir);
        const fileData = await fs.lstat(filePath);
        if (fileData.isDirectory()) {
            console.log(color(hLine) + " " + dirColor("./" + dir));
            await readFilesInternal(
                filePath,
                dirColor,
                space + "  " + dirColor(vLine)
            );
        }
    }
};

export const readFiles = (readFrom: string) => {
    console.log(initColor(readFrom));
    readFilesInternal(readFrom);
};

const readFrom = "/home/dumbcache/Desktop";
readFiles(readFrom);
