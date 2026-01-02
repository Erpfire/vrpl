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
    'sub', 'sup', 'font'
  ],
  allowedAttributes: {
    '*': ['class', 'id', 'style'],
    'a': ['href', 'target', 'rel', 'title'],
    'img': ['src', 'alt', 'width', 'height', 'loading', 'style'],
    'td': ['colspan', 'rowspan', 'align'],
    'th': ['colspan', 'rowspan', 'align'],
    'font': ['color', 'face', 'size']
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
      'text-align': [/^left|center|right|justify$/],
      'font-size': [/^[\d.]+(px|em|rem|%)$/],
      'font-weight': [/^normal|bold|100|200|300|400|500|600|700|800|900$/],
      'font-style': [/^normal|italic$/],
      'text-decoration': [/^none|underline|line-through$/],
      'line-height': [/^[\d.]+$/],
      'margin': [/^[\d.]+(px|em|rem|%|\s)*$/],
      'padding': [/^[\d.]+(px|em|rem|%|\s)*$/],
      'width': [/^[\d.]+(px|em|rem|%|auto)$/],
      'height': [/^[\d.]+(px|em|rem|%|auto)$/],
      'float': [/^left|right|none$/],
      'display': [/^block|inline-block|inline|flex|none$/]
    }
  },
  selfClosing: ['img', 'br', 'hr'],
  allowedSchemes: ['http', 'https', 'data'],
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  allowProtocolRelative: true
};

function sanitizeHtmlContent(html) {
  return sanitizeHtml(html, sanitizeConfig);
}

function escapeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

module.exports = {
  sanitizeHtmlContent,
  escapeInput,
  sanitizeConfig
};
