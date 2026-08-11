#!/bin/bash
# Fetch CC-licensed images from Wikimedia Commons for each scene.
set -e
OUT=/workspace/sang-video/public/img
TMP=/tmp/commons
mkdir -p "$OUT" "$TMP"
UA="Mozilla/5.0 (X11; Linux x86_64) sang-video"

cat > "$TMP/queries.txt" <<'EOF'
s1-title|rainy night city street lights neon
s2-classroom|empty classroom window light dusk
s3-subway|crowded subway platform people commute
s4-office|office building night windows lit
s5-room|bedroom window moonlight night
s6-rooftop|city rooftop dusk silhouette person
s7-street|wet street reflection night rain lights
s8-dawn|foggy morning city street fog
s9-sky|grey overcast sky clouds moody
EOF

# 1) fetch API json for each query via curl (honors proxy env)
while IFS='|' read -r name q; do
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$q")
  url="https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${enc}&gsrlimit=14&gsrnamespace=6&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiurlwidth=1080&format=json"
  curl -sS -m 40 -A "$UA" "$url" -o "$TMP/$name.json"
done < "$TMP/queries.txt"

# 2) pick best per scene
python3 - "$TMP" <<'PYEOF'
import json, sys, os
TMP = sys.argv[1]

def score(info):
    w, h = info.get("width", 0), info.get("height", 0)
    if w <= 0 or h <= 0:
        return -1
    mime = info.get("mime", "")
    if mime not in ("image/jpeg", "image/png"):
        return -1
    if w < 900 or h < 700:
        return -1
    aspect = w / max(h, 1)
    if aspect > 2.3 or aspect < 0.45:
        return -1
    md = info.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "")
    license_ok = any(k in md for k in ["CC", "Public domain", "PD"])
    bonus = 300 if license_ok else 0
    return min(w, 2200) * 0.001 + bonus + (h - w) * 0.001  # slight portrait preference

picks = {}
for fn in sorted(os.listdir(TMP)):
    if not fn.endswith(".json"):
        continue
    name = fn[:-5]
    try:
        data = json.load(open(os.path.join(TMP, fn)))
    except Exception:
        continue
    pages = data.get("query", {}).get("pages", {})
    best, bestscore = None, -1
    for p in pages.values():
        for info in (p.get("imageinfo") or []):
            s = score(info)
            if s > bestscore:
                bestscore, best = s, info
    if best:
        picks[name] = best
        print(f"{name}\t{best.get('thumburl', best.get('url'))}\t{best.get('width')}x{best.get('height')}")
    else:
        print(f"NONE\t{name}", file=sys.stderr)

json.dump(picks, open(os.path.join(TMP, "picked.json"), "w"), ensure_ascii=False)
PYEOF

# 3) download picks via curl
python3 - "$TMP" <<'PYEOF'
import json, sys, os
TMP = sys.argv[1]
picks = json.load(open(os.path.join(TMP, "picked.json")))
for name, info in picks.items():
    url = info.get("thumburl") or info.get("url")
    print(f"{name}\t{url}")
PYEOF
