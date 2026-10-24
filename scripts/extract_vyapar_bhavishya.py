import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

folder = r'D:\ASTROLOGY-BOOKS-DATABASE-master\trading'

# 1. Inspect Vyapar Bhavishya
vb_path = folder + r'\Full text of _Vyapar Bhavishya Vikrami 2024 Ka Hira Lal Dikshit_.pdf'
doc_vb = fitz.open(vb_path)

print(f"=== VYAPAR BHAVISHYA (Pages: {len(doc_vb)}) ===")
for p in range(min(15, len(doc_vb))):
    text = doc_vb[p].get_text()
    if text.strip():
        print(f"--- Page {p+1} ---")
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        print('\n'.join(lines[:15]))
        print('-'*30)
