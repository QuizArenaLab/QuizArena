const fs = require("fs");
const path = require("path");

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf8");

      const target = "from '../../shared/SelectionModels'";
      if (content.includes(target)) {
        content = content.replace(
          /from '\.\.\/\.\.\/shared\/SelectionModels'/g,
          "from '../shared/SelectionModels'"
        );
        fs.writeFileSync(fullPath, content);
        console.log("Fixed models import", fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, "src", "components", "forms", "fields", "selection"));
