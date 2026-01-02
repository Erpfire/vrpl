const sanitizeHtml = require('sanitize-html');

const sanitizeConfig = {
    allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span', 'div', 'br', 'hr',
        'ul', 'ol', 'li',
        'strong', 'b', 'em', 'i', 'u', 's',
        'blockquote', 'code', 'pre',
        'a', 'img', 'figure', 'figcaption',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'sub', 'sup'
    ],
    allowedAttributes: {
        '*': ['class', 'id', 'style'],
        'a': ['href', 'target', 'rel', 'title'],
        'img': ['src', 'alt', 'width', 'height', 'loading', 'style'],
        'td': ['colspan', 'rowspan', 'align'],
        'th': ['colspan', 'rowspan', 'align']
    },
    allowedStyles: {
        '*': {
            'color': [
                /^#[0-9a-f]{3,6}$/i,
                /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
                /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i,
                /^[a-z]+$/i
            ],
            'background-color': [
                /^#[0-9a-f]{3,6}$/i,
                /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
                /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i,
                /^[a-z]+$/i
            ],
            // ... assume others are same
        }
    },
    selfClosing: ['img', 'br', 'hr'],
    allowedSchemes: ['http', 'https', 'data'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowProtocolRelative: true
};

const testStrings = [
    '<span style="color: red;">Red Text</span>',
    '<span style="background-color: yellow;">Highlighted Text</span>',
    '<span style="color: rgb(255, 0, 0);">RGB Red</span>',
    '<span style="background-color: rgba(255, 255, 0, 0.5);">RGBA Yellow</span>',
    '<span style="color: #ff0000;">Hex Red</span>'
];

testStrings.forEach(str => {
    console.log(`Input:  ${str}`);
    console.log(`Output: ${sanitizeHtml(str, sanitizeConfig)}`);
    console.log('---');
});
