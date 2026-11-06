import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProfileUrl,profilePageKey} from '../url-config.js';
test('unapproved local/placeholder/QR URLs cannot be publication targets',()=>{
 for(const url of ['', 'http://site.github.io/card/', 'https://localhost/card/', 'https://127.0.0.1/', 'https://192.168.1.2/', 'https://example.com/', 'https://preview.invalid/', 'https://site.github.io/card/#qr', 'https://site.github.io/card/?token=x', 'https://u:p@site.github.io/card/'])assert.throws(()=>validateProfileUrl(url));
});
test('profile directory and index.html identify the same subpath',()=>{
 assert.equal(profilePageKey('https://artist.github.io/card/#profile'),profilePageKey('https://artist.github.io/card/index.html'));
 assert.notEqual(profilePageKey('https://artist.github.io/card/'),profilePageKey('https://artist.github.io/other/'));
});
