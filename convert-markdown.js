const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Read markdown file
const markdownPath = path.join(__dirname, 'docs', 'TESTING_GUIDE.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf8');

// Convert to HTML
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testing Guide</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        code {
            background-color: rgba(27, 31, 35, 0.05);
            border-radius: 3px;
            font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
            padding: 0.2em 0.4em;
        }
        pre code {
            display: block;
            padding: 16px;
            overflow: auto;
            line-height: 1.45;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px 13px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    ${marked.parse(markdownContent)}
</body>
</html>
`;

// Write HTML file
const htmlPath = path.join(__dirname, 'docs', 'TESTING_GUIDE.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log('Conversion completed successfully!');
