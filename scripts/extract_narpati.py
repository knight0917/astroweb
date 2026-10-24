import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

folder = r'D:\ASTROLOGY-BOOKS-DATABASE-master\trading'
np_path = folder + r'\Full text of _Narpati Jaicharya Swaroday_.pdf'
doc_np = fitz.open(np_path)

print(f"=== NARPATI JAICHARYA SWARODAY (Pages: {len(doc_np)}) ===")

# Search for Sarvatobhadra Chakra pages
sbc_pages = []
for p in range(len(doc_np)):
    text = doc_np[p].get_text()
    if re.search(r'सर्वतोभद्र|sarvatobhadra|सप्तशलाका|वेध|अर्घ', text, re.I):
        sbc_pages.append(p+1)

print(f"Pages with Sarvatobhadra / Vedha / Argha: {sbc_pages[:20]}")

# Sample key pages around page 58-75 (which was listed in TOC as Sarvatobhadra Chakra)
for p in [57, 58, 59, 60, 61, 70, 71]:
    if p < len(doc_np):
        print(f"\n--- PAGE {p+1} ---")
        lines = [l.strip() for l in doc_np[p].get_text().splitlines() if l.strip()]
        print('\n'.join(lines[:25]))
