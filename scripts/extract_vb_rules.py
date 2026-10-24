import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

folder = r'D:\ASTROLOGY-DATABASE-MASTER\trading' if False else r'D:\ASTROLOGY-BOOKS-DATABASE-master\trading'
vb_path = folder + r'\Full text of _Vyapar Bhavishya Vikrami 2024 Ka Hira Lal Dikshit_.pdf'
doc_vb = fitz.open(vb_path)

print("Printing pages 198 to 211 of Vyapar Bhavishya...")
for p in range(197, len(doc_vb)):
    print(f"\n==================== PAGE {p+1} ====================")
    print(doc_vb[p].get_text())
