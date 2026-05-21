const fs = require("fs")
const files = process.argv.slice(2)
for (const p of files) {
  let t = fs.readFileSync(p, "utf8")
  t = t.replace(/<\/motion>/g, "</motion>").replace(/<motion/g, "<motion")
  fs.writeFileSync(p, t)
}
