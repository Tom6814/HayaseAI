#!/usr/bin/env python3
"""批量测试 SOCKS5 代理：连通性 + 出口 IP 信息（通过 ipinfo.io）"""
import subprocess, sys, json, concurrent.futures as cf, re

def load_proxies():
    proxies = set()
    for line in open('/tmp/socks5_proxyscrape.txt', encoding='utf-8', errors='ignore'):
        line = line.strip()
        if re.match(r'^\d+\.\d+\.\d+\.\d+:\d+$', line):
            proxies.add(('proxyscrape', line))
    html = open('/tmp/socks5_github.html', encoding='utf-8', errors='ignore').read()
    rows = re.findall(r'<tr[^>]*>\s*<td[^>]*>\s*(socks5)\s*</td>\s*<td[^>]*>\s*([0-9.]+)\s*</td>\s*<td[^>]*>\s*([0-9]+)\s*</td>\s*<td[^>]*>(.*?)</td>', html, re.S)
    for proto, ip, port, desc in rows:
        desc = re.sub(r'<[^>]+>', '', desc).strip()
        proxies.add(('github:' + desc, f'{ip}:{port}'))
    return sorted(proxies)

def test(entry):
    src, proxy = entry
    cmd = ['curl', '-s', '--connect-timeout', '6', '--max-time', '12',
           '-x', f'socks5h://{proxy}', 'https://ipinfo.io/json']
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        if r.returncode != 0:
            return None
        data = json.loads(r.stdout)
        return {
            'proxy': proxy,
            'src': src,
            'exit_ip': data.get('ip'),
            'city': data.get('city'),
            'region': data.get('region'),
            'country': data.get('country'),
            'org': data.get('org'),
            'asn': data.get('asn'),
        }
    except Exception:
        return None

def main():
    proxies = load_proxies()
    print(f'待测代理总数: {len(proxies)}', file=sys.stderr)
    results = []
    with cf.ThreadPoolExecutor(max_workers=24) as ex:
        for i, res in enumerate(ex.map(test, proxies)):
            if res:
                results.append(res)
                print(f'[OK] {res["proxy"]} -> {res["exit_ip"]} | {res["city"]},{res["country"]} | {res["org"]}', flush=True)
            if (i + 1) % 50 == 0:
                print(f'进度 {i+1}/{len(proxies)}', file=sys.stderr)
    print(f'\n可用代理: {len(results)}', file=sys.stderr)
    with open('/tmp/proxy_results.json', 'w') as f:
        json.dump(results, f, ensure_ascii=False, indent=1)

if __name__ == '__main__':
    main()
