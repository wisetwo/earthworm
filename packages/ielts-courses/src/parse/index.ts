import fs from "fs";
import path from "path";

import { inquire } from "./inquire";
import { parse } from "./parser";

const targetPath = path.resolve(__dirname, "../../data/text");
const outputPath = path.resolve(__dirname, "../../data/courses");

(async function () {
  const fileNameMap = createFileNameMap();
  const textPaths = await inquire(targetPath);

  for (const textPath of textPaths) {
    let dataBuffer = fs.readFileSync(textPath);
    const result = parse(dataBuffer.toString());
    const fileName = fileNameMap[textPath];
    save(JSON.stringify(result), fileName);
  }
})();

function save(content: string, fileName: string) {
  const filePath = path.resolve(outputPath, `${fileName}.json`);
  fs.writeFileSync(filePath, content);
}

function createFileNameMap(): Record<string, string> {
  const fileNameMap: Record<string, string> = {};
  let files = fs.readdirSync(targetPath);
  // 筛选出以 .txt 结尾的文件
  files = files.filter((file) => file.endsWith(".txt"));
  files.sort((a, b) => {
    // 文件名数字靠前（两位），说明靠后
    const aNum = parseInt(a.split("-")[0], 10);
    const bNum = parseInt(b.split("-")[0], 10);
    return aNum - bNum;
  });

  files.forEach((file, index) => {
    const key = path.resolve(targetPath, file);
    // const nameIndex = index + 1;
    // fileNameMap[key] = nameIndex < 10 ? `0${nameIndex}` : `${nameIndex}`;
    fileNameMap[key] = path.basename(key).split(".")[0];
  });

  return fileNameMap;
}
