import fetch from 'node-fetch';
import { Message } from 'discord.js';
import { parse } from 'parse5';
import { Command } from '.';

export default class CaseCommand implements Command {
  async handler(message: Message, caseId: number) {
    const html = await this.getContent(caseId);

    this.parseTitle(html);
  }

  help() {
    return ``;
  }

  private async getContent(caseId: number) {
    const request = await fetch('http://mail.secullum.com.br/bugtracker/edit_bug.aspx?id=' + caseId);

    return await request.text();
  }

  private parseTitle(html: string) {
    const document = parse(html, { scriptingEnabled: false });

    // const body = this.element(document.childNodes[1], 1);
  }

  private element(child: ChildNode, index: number) {
    return child.childNodes[index] as Element;
  }
}
