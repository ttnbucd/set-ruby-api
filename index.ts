import { execSync } from 'child_process';
import * as http from 'http';

// ポート番号
const port = 8080;

function parseJapanese(text: string): string[][] {
  const command = `echo ${text} | mecab -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd`;
  const output = execSync(command, { encoding: 'utf-8' });
  const result = output
    .trim()
    .split('\n')
    .map((line) => line.split('\t'));
  return result;
}

// httpサーバーを構築
const server = http.createServer((request, response) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });
  request.on('end', () => {
    const inputText = JSON.parse(body).text;
    const parsedTexts = parseJapanese(inputText);

    let outputText = '';

    parsedTexts.forEach((parsedText) => {
      if (parsedText.length > 1) {
        outputText += parsedText[1].split(',')[8];
      }
    });

    const result = {
      inputText,
      outputText,
    };

    response.write(JSON.stringify(result));
    response.end();
  });
});
// サーバーを起動してリクエストを待ち受け状態にする
server.listen(port);
