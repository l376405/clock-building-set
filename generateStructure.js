const dirTree = require("directory-tree");
const fs = require("fs");
const path = require("path");

const tree = dirTree("./src", {
    exclude: /node_modules|\.git/,
    extensions: /\.(js|vue|css|md|json|html|svg|png|jpg|jpeg|gif)$/
});

function readComment(dir) {
    const commentPath = path.join(dir, ".comment");
    if (fs.existsSync(commentPath)) {
        return fs.readFileSync(commentPath, "utf-8").trim();
    }
    return null;
}

function getIcon(node) {
    if (node.children) {
        return "📂"; // 目錄
    }
    const ext = path.extname(node.name).toLowerCase();
    switch (ext) {
        case '.js':
            return "🟨"; // JavaScript 文件
        case '.vue':
            return "🟩"; // Vue 文件
        case '.css':
            return "🟦"; // CSS 文件
        case '.md':
            return "📝"; // Markdown 文件
        case '.json':
            return "🔧"; // JSON 文件
        case '.html':
            return "🌐"; // HTML 文件
        case '.svg':
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
            return "🖼️"; // 圖片文件
        default:
            return "📄"; // 其他文件
    }
}

function getFileInfo(node) {
    if (node.children) {
        return `包含 ${node.children.length} 個項目`;
    }
    const stats = fs.statSync(node.path);
    const lastModified = stats.mtime.toISOString().split('T')[0];
    return `最後修改: ${lastModified}`;
}

function generateMarkdown(node, depth = 0) {
    let md = "";
    const indent = "  ".repeat(depth);
    const icon = getIcon(node);
    md += `${indent}- ${icon} ${node.name}`;

    const comment = readComment(node.path);
    const fileInfo = getFileInfo(node);
    
    if (comment) {
        md += ` *# ${comment}*`;
        if (node.children) {
            md += ` (${fileInfo})`;
        }
    } else {
        md += ` *# ${fileInfo}*`;
    }
    md += "\n";

    if (node.children) {
        // 分離文件和目錄
        const files = node.children.filter(child => !child.children);
        const directories = node.children.filter(child => child.children);

        // 先處理文件
        files.forEach(file => {
            md += generateMarkdown(file, depth + 1);
        });

        // 再處理目錄
        directories.forEach(directory => {
            md += generateMarkdown(directory, depth + 1);
        });
    }

    return md;
}

const markdown = "# 專案結構\n\n" + generateMarkdown(tree);
fs.writeFileSync("CONSTRUCT.md", markdown);

console.log("CONSTRUCT.md has been generated successfully.");
console.log("Generated markdown content:");