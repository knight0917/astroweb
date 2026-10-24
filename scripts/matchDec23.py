with open(r'C:\Users\singh\Downloads\GOLD.pro_H1_202512230000_202512232200.csv', 'r') as f:
    lines = [l.strip() for l in f.readlines() if l.strip()]

bars = []
for line in lines[1:]:
    p = line.split('\t')
    time = p[1]
    o = float(p[2])
    h = float(p[3])
    l = float(p[4])
    c = float(p[5])
    change = c - o
    bars.append({'time': time, 'o': o, 'h': h, 'l': l, 'c': c, 'change': change})

max_h = max(b['h'] for b in bars)
min_l = min(b['l'] for b in bars)

hod_times = [b['time'] for b in bars if b['h'] == max_h]
lod_times = [b['time'] for b in bars if b['l'] == min_l]

print(f"Total H1 Bars: {len(bars)}")
print(f"Daily Open: {bars[0]['o']}")
print(f"Daily Close: {bars[-1]['c']}")
print(f"Net Daily Change: {bars[-1]['c'] - bars[0]['o']:+.2f} points (+{(bars[-1]['c'] - bars[0]['o'])*10:.1f} pips)")
print(f"Daily Range: {max_h - min_l:.2f} points (High: {max_h} / Low: {min_l})")
print(f"Absolute High (HOD): {max_h} at {hod_times}")
print(f"Absolute Low (LOD): {min_l} at {lod_times}")

print("\n--- HOURLY CANDLE BREAKDOWN ---")
for b in bars:
    dir_str = "BULL [+]" if b['change'] > 0 else "BEAR [-]" if b['change'] < 0 else "FLAT [0]"
    print(f"{b['time']} | O: {b['o']:7.2f} | H: {b['h']:7.2f} | L: {b['l']:7.2f} | C: {b['c']:7.2f} | Net: {dir_str:8} {b['change']:+6.2f} pts | Range: {b['h']-b['l']:5.2f}")
