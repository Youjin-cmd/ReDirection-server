const fs = require("fs");
const { ensureFolderExists } = require("../util/ensureFolderExists");

describe("ensureFolderExists", () => {
  const testFolderPath = "./test-folder";

  beforeAll(() => {
    ensureFolderExists(testFolderPath);
  });

  afterAll(() => {
    try {
      fs.rmSync(testFolderPath, { recursive: true });
    } catch (error) {
      console.error(`Error deleting folder: ${error.message}`);
    }
  });

  it("folder should be created", () => {
    const folderExists = fs.existsSync(testFolderPath);
    expect(folderExists).toBe(true);
  });

  it("should delete all files in the folder", () => {
    fs.writeFileSync(`${testFolderPath}/file1.txt`, "Test content 1");
    fs.writeFileSync(`${testFolderPath}/file2.txt`, "Test content 2");

    expect(fs.readdirSync(testFolderPath)).toHaveLength(2);

    ensureFolderExists(testFolderPath);

    expect(fs.readdirSync(testFolderPath)).toHaveLength(0);
  });
});
