// Shared by runtime and publication checks. Never infer an official public URL.
export function validateProfileUrl(value) {
  if (!value) throw new Error('正式プロフィールURLが未設定です');
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search)
    throw new Error('認証情報・クエリ・独自ポートを含まないHTTPS URLが必要です');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') ||
      host.endsWith('.invalid') || host === 'example.com' || host.endsWith('.example.com') ||
      host === 'example.org' || host === 'example.net' || !host.includes('.') ||
      /^[\d.]+$/.test(host) || host.includes(':') || host.startsWith('['))
    throw new Error('localhost・仮ドメイン・IPアドレスは公開URLに使えません');
  if (url.hash && url.hash !== '#profile') throw new Error('QRの遷移先はPROFILEにしてください');
  if (!url.pathname.endsWith('/') && !url.pathname.endsWith('/index.html'))
    throw new Error('プロフィールのディレクトリURLまたはindex.htmlが必要です');
  return url;
}
export function profilePageKey(value) {
  const url = validateProfileUrl(value);
  return url.origin + url.pathname.replace(/index\.html$/, '');
}
