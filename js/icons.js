const ICON_DEFS = {
  check: `
    <polyline points="20 6 9 17 4 12"></polyline>
  `,
  close: `
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  `,
  externalLink: `
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  `,
  play: `
    <polygon points="8 5 19 12 8 19 8 5"></polygon>
  `,
  pause: `
    <rect x="6" y="5" width="4" height="14" rx="1"></rect>
    <rect x="14" y="5" width="4" height="14" rx="1"></rect>
  `,
  info: `
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  `,
  settings: `
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0 .33-1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  `,
  install: `
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  `,
  carousel: `
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
    <polygon points="10 7 15 10 10 13 10 7" fill="currentColor"></polygon>
  `,
  quiz: `
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  `,
  report: `
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  `,
  link: `
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  `,
  chevronLeft: `
    <polyline points="15 18 9 12 15 6"></polyline>
  `,
  chevronRight: `
    <polyline points="9 18 15 12 9 6"></polyline>
  `,
  arrowUp: `
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  `,
  arrowRight: `
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  `,
  share: `
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  `,
  print: `
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  `,
  wifi: `
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.94 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  `,
};

export function createIcon(name, options = {}) {
  const def = ICON_DEFS[name];
  if (!def) {
    return null;
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const classNames = ["icon", `icon-${name}`];
  if (options.className) classNames.push(options.className);

  svg.setAttribute("class", classNames.filter(Boolean).join(" "));
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", String(options.width ?? 16));
  svg.setAttribute("height", String(options.height ?? 16));
  svg.setAttribute("viewBox", options.viewBox ?? "0 0 24 24");
  svg.setAttribute("fill", options.fill ?? "none");
  svg.setAttribute("stroke", options.stroke ?? "currentColor");
  svg.setAttribute("stroke-width", String(options.strokeWidth ?? 2.2));
  svg.setAttribute("stroke-linecap", options.strokeLinecap ?? "round");
  svg.setAttribute("stroke-linejoin", options.strokeLinejoin ?? "round");

  if (options.title) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", options.title);
  }

  svg.innerHTML = def;
  return svg;
}

export function appendIcon(target, name, options = {}) {
  const icon = createIcon(name, options);
  if (!icon) return null;
  target.appendChild(icon);
  return icon;
}

export function renderIconSlot(target, name, options = {}) {
  if (!target) return null;
  const icon = createIcon(name, {
    width: 18,
    height: 18,
    ...options,
  });
  if (!icon) return null;
  target.replaceChildren(icon);
  return icon;
}

export function renderDataIcons(root = document) {
  if (!root || typeof root.querySelectorAll !== "function") return;
  const nodes = root.querySelectorAll("[data-icon]");
  nodes.forEach((node) => {
    const name = node.dataset.icon;
    if (!name) return;
    const svg = createIcon(name, {
      className: node.getAttribute("class") || undefined,
      width: Number(node.dataset.iconWidth || node.dataset.width || 18),
      height: Number(node.dataset.iconHeight || node.dataset.height || 18),
      strokeWidth: Number(node.dataset.iconStrokeWidth || 2.2),
      fill: node.dataset.iconFill || "none",
      stroke: node.dataset.iconStroke || "currentColor",
    });
    if (svg) {
      node.replaceWith(svg);
    }
  });
}
