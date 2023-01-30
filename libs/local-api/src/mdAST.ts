import { Cell, CodeCell } from "./types";

export const generateId = () => {
  return Math.random().toString(36).substr(2, 5);
};


export function mdAST(input: string): Cell[] {
  let lexer = /(?:^``` *(.*?)\n([\s\S]*?)```$)|^(.*?)$/gm;

  const astObj = input.match(lexer)?.reduce((ast: Cell[], text: string) => {
    const isCode = text.startsWith('```');

    if (isCode) {
      const meta = text.match(/^```([a-zA-Z-_]+) *(.*?)$/m) as string[];
      const language = meta[1];
      const options = meta[2] && meta[2].split(' ').reduce((metaObj, part) => {
        const metaPart = part.split("=");
        const key = metaPart[0];
        if (metaPart.length > 1) {
          metaObj[key] = metaPart[1];
        } else if(metaPart[0]){
          metaObj[metaPart[0]] = true;
        }
        return metaObj;
      }, {} as any) as CodeCell['meta'];
      const content = text.replace(`${meta[0]}\n`, '').replace(/\n```/, '');
      const id = (options && options.id) || generateId()
      ast.push({
        type: "code",
        language: language,
        // @ts-ignore
        meta: {
          ...options,
          id
        },
        id,
        content: content,
      });
    } else {
      if (ast.length && ast[ast.length - 1].type === 'text') {
        ast[ast.length - 1].content += '\n' + text;
      } else {
        const idMatch = text.match(/^<!--(.*?)-->/)
        let id;
        if(idMatch){
          id = idMatch[1];
        }else{
          id = generateId()
          text = `<!--${id}-->\n${text}`
        }
        ast.push({
          type: 'text',
          content: text,
          id
        });
      }
    }
    return ast;
  }, []);
  return astObj || [];
}

export function astMD(cells: Cell[]) {
  return cells.map((cell) => {
    if (cell.type === 'text') {
      return cell.content;
    } else if (cell.type === 'code') {
      return "```" + `${cell.language} ${cell.meta ? Object.keys(cell.meta).map((m) => {
        // @ts-ignore
        const value = cell?.meta[m];
        if (typeof value === 'boolean') {
          if (value) {
            return m;
          } else {
            return '';
          }
        }
        return `${m}=${value}`;
      }).join(' ') : ''}\n${cell.content}\n` + "```";
    }
  }).join('\n');
}