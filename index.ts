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

export const readFiles = async (readFrom: string): Promise<string[][]> => {
    const files = await fs.readdir(readFrom);
    const dirs: string[] = [],
        fls: string[] = [];
    for (let file of files) {
        let filePath = path.resolve(readFrom, file);
        const fileData = await fs.lstat(filePath);
        if (fileData.isDirectory()) {
            dirs.push(file);
            continue;
        } else {
            fls.push(file);
        }
    }
    return [fls, dirs];
};

const logFiles = (files: string[], padding: string, color: ChalkInstance) => {
    for (let file of files) {
        process.stdout.write(padding);
        console.log(color(hLine) + " " + file);
    }
};

const logDirs = async (
    dirs: string[],
    readFrom: string,
    padding: string,
    space: string,
    color: ChalkInstance,
    dirColor: ChalkInstance
) => {
    for (let dir of dirs) {
        process.stdout.write(padding);
        let filePath = path.resolve(readFrom, dir);
        const fileData = await fs.lstat(filePath);
        if (fileData.isDirectory()) {
            console.log(color(hLine) + " " + dirColor("./" + dir));
            await readFilesInternal(
                filePath,
                space + "  " + dirColor(vLine),
                dirColor
            );
        }
    }
};

const readFilesInternal = async (
    readFrom: string,
    space: string = "",
    color: ChalkInstance = initColor
) => {
    let padding = initColor(vLine) + space;
    let dirColor = colors[rand()];
    while (dirColor === color) {
        dirColor = colors[rand()];
    }

    const [files, dirs] = await readFiles(readFrom);
    logFiles(files, padding, color);
    await logDirs(dirs, readFrom, padding, space, color, dirColor);
};

export const fileTree = (readFrom: string) => {
    console.log(initColor(readFrom));
    readFilesInternal(readFrom);
};

const readFrom = "/home/dumbcache/Desktop";
fileTree(readFrom);
readFiles(readFrom);
