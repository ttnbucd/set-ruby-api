import { execSync } from 'child_process';
import express, { Application, Request, Response } from 'express';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req: Request, res: Response) => {
  console.log(req.body);
  const inputText = req.body.text ?? null;
  if (inputText) {
    const parsedTexts = parseJapanese(inputText);
    let outputText = '';
    parsedTexts.forEach((parsedText) => {
      if (parsedText.length > 1) {
        outputText += parsedText[1].split(',')[8];
      }
    });
    return res.status(200).send({
      status: 'success',
      data: { inputText, outputText },
    });
  } else {
    res.status(500).send({
      status: 'error',
      data: { message: 'No Input Data' },
    });
  }
});

const port = process.env.PORT || 8080;

try {
  app.listen(port, () => {
    console.log(`Running at Port ${port}...`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}

function parseJapanese(text: string): string[][] {
  const command = `echo ${text} | mecab -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd`;
  const output = execSync(command, { encoding: 'utf-8' });
  const result = output
    .trim()
    .split('\n')
    .map((line) => line.split('\t'));
  return result;
}
