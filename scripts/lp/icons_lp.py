# Graphics House LP icon set: 12 thin gold line icons, 24x24, stroke=currentColor.
ICONS = {
  # outputs
  "film":      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/><path d="M10.5 10v4l3-2z"/>',
  "reels":     '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 9.5v5l4-2.5z"/><path d="M10.5 18.5h3"/>',
  "view3d":    '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  "aerial":    '<circle cx="12" cy="12" r="8.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M9 9h6v6H9z"/>',
  "bilingual": '<path d="M3.5 5h9M8 3v2M5.5 5c.6 3 2.6 5.5 5 6.5M10.5 5c-.6 3-3 6-6.5 7"/><path d="M13 21l4-9 4 9M14.5 18h5"/>',
  "maquette":  '<path d="M2.5 17l9.5 4 9.5-4-9.5-4z"/><path d="M8 15.3V9l3-1.5v7.4M13 13.6V6l3 1.5v7"/>',
  # steps
  "consult":   '<path d="M4 4.5h10.5a2 2 0 012 2V11a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V6.5a2 2 0 012-2z"/><path d="M18.5 8.5h1.5a2 2 0 012 2V15a2 2 0 01-2 2h-1v3l-4-3h-3"/>',
  "script":    '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 15h6M9 18h4"/>',
  "produce":   '<rect x="2.5" y="8" width="13" height="10" rx="2"/><path d="M15.5 11.5l6-3v9l-6-3"/><circle cx="6.5" cy="5" r="2"/><circle cx="11.5" cy="5" r="2"/>',
  "deliver":   '<path d="M12 3v11M7.5 9.5L12 14l4.5-4.5"/><path d="M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4"/>',
  # trust
  "reply24":   '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  "approved":  '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V4M9 13l2 2 4-4"/>',
}
def sprite():
    syms = "".join(f'<symbol id="ic-{k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{v}</symbol>' for k, v in ICONS.items())
    return f'<svg width="0" height="0" style="position:absolute" aria-hidden="true">{syms}</svg>\n'
def ic(name, cls="ic"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#ic-{name}"/></svg>'
def write_files(dirpath):
    import os
    os.makedirs(dirpath, exist_ok=True)
    for k, v in ICONS.items():
        open(os.path.join(dirpath, f"{k}.svg"), "w").write(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{v}</svg>\n')
