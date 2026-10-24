import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

folder = r'D:\ASTROLOGY-BOOKS-DATABASE-master\trading'
vb_path = folder + r'\Full text of _Vyapar Bhavishya Vikrami 2024 Ka Hira Lal Dikshit_.pdf'
doc = fitz.open(vb_path)

print("Scanning Vyapar Bhavishya for commodity chapters...")
chapters = []
for p in range(len(doc)):
    text = doc[p].get_text()
    for line in text.splitlines():
        line_clean = line.strip()
        if re.search(r'(सोना|चांदी|स्वर्ण|चांदी|तेजी\s*मंदी|अथ\s*सोना|अथ\s*चांदी|रुपया|तांबा|पीतल|कपास|अलसी|गुड़|गेहूं|शेयर|बाजार)', line_clean):
            if len(line_clean) < 50 and ('विचार' in line_clean or 'फल' in line_clean or 'तेजी' in line_clean or 'मंदी' in line_clean or 'अथ' in line_clean):
                chapters.append((p+1, line_clean))

for page, ch in chapters[:30]:
    print(f"[Page {page}] {ch}")
