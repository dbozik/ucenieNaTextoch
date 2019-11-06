import { ipcEvents } from '../../web/shared/ipc-events.enum';
import * as DA from '../DA';
import { GetRequestHandler, SendRequestHandler } from '../Handlers';
import { Text } from '../Objects';

export class ArchivedTextService {
    private textsArchivedDA = new DA.TextsArchived();
    private textsDA = new DA.Texts();


    public init(): void {
        this.processGetArchivedTexts();
        this.processArchiveText();
        this.processUnarchiveText();
    }


    private processGetArchivedTexts(): void {
        const getArchivedTextsChain = new GetRequestHandler(ipcEvents.GET_ARCHIVED_TEXTS,
            () => this.textsArchivedDA.getList());
        getArchivedTextsChain.run({});
    }


    private processArchiveText(): void {
        const archiveTextChain = new GetRequestHandler(ipcEvents.ARCHIVE_TEXT, (textId: string) => this.textsDA.get(textId));
        archiveTextChain
            .next(
                new SendRequestHandler((text: Text) => this.textsArchivedDA.addText(text))
            )
            .next(
                new SendRequestHandler((text: Text) => this.textsDA.delete(text._id))
            );

        archiveTextChain.run({});
    }


    private processUnarchiveText(): void {
        let archivedTextId: string = '';
        const unarchiveTextChain = new GetRequestHandler(ipcEvents.UNARCHIVE_TEXT, (textId: string) => {
            archivedTextId = textId;
            return this.textsArchivedDA.get(textId);
        });
        unarchiveTextChain
            .next(
                new SendRequestHandler((text: Text) => this.textsDA.addText(text.text, text.title))
            )
            .next(
                new SendRequestHandler((text: Text) => this.textsArchivedDA.delete(archivedTextId))
            );

        unarchiveTextChain.run({});
    }

}
