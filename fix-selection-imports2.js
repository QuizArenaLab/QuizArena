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

      const target =
        "import { BaseField, useField } from '../../../shared/BaseField';\nimport { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from '../../../shared';";

      if (content.includes(target)) {
        content = content.replace(
          target,
          `import { BaseField, useField } from '../../shared/BaseField';\nimport { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from '../../shared';`
        );
        fs.writeFileSync(fullPath, content);
        console.log("Fixed back", fullPath);
      }

      const cbTarget = "import { FieldGroup } from '../../shared';";
      if (content.includes(cbTarget) && file === "CheckboxField.tsx") {
        content = content.replace(cbTarget, ""); // Remove unused FieldGroup
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, "src", "components", "forms", "fields", "selection"));
