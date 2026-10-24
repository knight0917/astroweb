import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

folder = r'D:\ASTROLOGY-BOOKS-DATABASE-master\trading'
bs_path = folder + r'\Full text of _Varahamihiras Brihat Samhita,vol.i-ii_.pdf'
doc = fitz.open(bs_path)

# Find Adhyaya XLII (42) Argha Kanda / Price Fluctuations
for page_num in range(len(doc)):
    text = doc[page_num].get_text()
    if 'Adhyaya XLII' in text or 'Adhyaya XLI' in text or 'Fluctuation of Prices' in text:
        print(f"=== Page {page_num + 1} ===")
        print(text[:1500])
        print("\n" + "="*50 + "\n")
