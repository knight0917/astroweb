import fitz
import os
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

folder = r'D:\ASTROLOGY-BOOKS-DATABASE-master\trading'

def search_keywords(doc, keywords, max_matches=10):
    results = {}
    for kw in keywords:
        results[kw] = []
    
    for page_num in range(len(doc)):
        text = doc[page_num].get_text()
        for kw in keywords:
            if len(results[kw]) < max_matches:
                matches = list(re.finditer(re.escape(kw), text, re.IGNORECASE))
                for m in matches:
                    start = max(0, m.start() - 100)
                    end = min(len(text), m.end() + 200)
                    snippet = text[start:end].replace('\n', ' ')
                    results[kw].append((page_num + 1, snippet))
                    if len(results[kw]) >= max_matches:
                        break
    return results

print("Starting scan of books...")

# 1. Brihat Samhita
bs_path = os.path.join(folder, 'Full text of _Varahamihiras Brihat Samhita,vol.i-ii_.pdf')
if os.path.exists(bs_path):
    doc = fitz.open(bs_path)
    print(f"\n==================================================")
    print(f"BRIHAT SAMHITA - Total Pages: {len(doc)}")
    print(f"==================================================")
    bs_keywords = ["Argha", "price", "gold", "silver", "commodity", "metals", "merchants", "bullish", "scarcity", "fall of price", "rise in price"]
    res = search_keywords(doc, bs_keywords, max_matches=4)
    for kw, hits in res.items():
        if hits:
            print(f"\n--- Keyword: '{kw}' ({len(hits)} matches shown) ---")
            for page, snippet in hits:
                print(f"  [P. {page}] ...{snippet.strip()}...")

# 2. Vyapar Bhavishya
vb_path = os.path.join(folder, 'Full text of _Vyapar Bhavishya Vikrami 2024 Ka Hira Lal Dikshit_.pdf')
if os.path.exists(vb_path):
    doc = fitz.open(vb_path)
    print(f"\n==================================================")
    print(f"VYAPAR BHAVISHYA - Total Pages: {len(doc)}")
    print(f"==================================================")
    vb_keywords = ["सोना", "चांदी", "तेजी", "मंदी", "gold", "silver", "teji", "mandi", "रुपया", "अनाज", "व्यापार"]
    res = search_keywords(doc, vb_keywords, max_matches=4)
    for kw, hits in res.items():
        if hits:
            print(f"\n--- Keyword: '{kw}' ({len(hits)} matches shown) ---")
            for page, snippet in hits:
                print(f"  [P. {page}] ...{snippet.strip()}...")

# 3. Narpati Jaicharya Swaroday
np_path = os.path.join(folder, 'Full text of _Narpati Jaicharya Swaroday_.pdf')
if os.path.exists(np_path):
    doc = fitz.open(np_path)
    print(f"\n==================================================")
    print(f"NARPATI JAICHARYA SWARODAY - Total Pages: {len(doc)}")
    print(f"==================================================")
    np_keywords = ["सर्वतोभद्र", "sarvatobhadra", "वेध", "vedha", "तेजी", "मंदी", "अर्घ", "स्वर्ण", "gold", "चक्र"]
    res = search_keywords(doc, np_keywords, max_matches=4)
    for kw, hits in res.items():
        if hits:
            print(f"\n--- Keyword: '{kw}' ({len(hits)} matches shown) ---")
            for page, snippet in hits:
                print(f"  [P. {page}] ...{snippet.strip()}...")
