import { MigrationInterface, QueryRunner } from "typeorm";
import data from "../seed/cd.json";

interface CDJson {
    title: string;
    preparedBy: string;
    security: string;
    date: string;
    intendedFor: string;
    docType: string;
    editedHeaders: {
        entry: {
            "int": string;
            "com.qamcom.confluence.plugins.controlled__documents.model.DocuHeader": {
                title: string
                security: string
                date: string
                preparedBy: string
            }
        }
    }
    releases: {
        entry: {
            "string": string;
            "com.qamcom.confluence.plugins.controlled__documents.model.Release": {
                release: string
                comment: string
                pageVersion: string
                user: string
                pdfUrl: string
                date: string
            }
        }
    }
}

export class SeedTablesWithData1749344057759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const cdData = data as any;
        const cdDataArray = cdData['com.qamcom.confluence.plugins.controlled__documents.model.RegularReleasedDocuments'];
        const jcdDataArray = cdData['com.qamcom.confluence.plugins.controlled__documents.model.JCDReleasedDocuments'];
        for (let i = 0; i < cdDataArray.length; i++) {
            const document: CDJson = cdDataArray[0]
            // const metadatas = document.editedHeaders.entry;
            // const releases = document.releases.entry;
            // const metadataLatest = {
            //     title: document.title,
            //     preparedBy: document.preparedBy,
            //     security: document.security,
            //     date: document.date,
            //     pageVersion: -1
            // }
            const intendedFor = await queryRunner.query(`
                SELECT id FROM intendedfor WHERE code = '${document.intendedFor}'
            `);
            const doctype = await queryRunner.query(`
                SELECT id FROM doctype WHERE code = '${document.docType}'
            `);
            console.log("results",intendedFor, doctype);
            if (intendedFor.length === 0) {
                const createdIntendedFor = await queryRunner.query(`
                    INSERT INTO intendedfor (code, name, type, description, url)
                    VALUES ('${document.intendedFor}', '${document.intendedFor}', 'Project', '', '')
                `);
                console.log("createdIntendedFor",createdIntendedFor);
            }
            if (doctype.length === 0) {
                const createdDoctype = await queryRunner.query(`
                    INSERT INTO doctype (code, name, description)
                    VALUES ('${document.docType}', '${document.docType}', '')
                `);
                console.log("createdDoctype",createdDoctype);
            }
            // const cdEntity = new ControlledDocument();

            // cdEntity.serialNumber = document.serialNumber;
            // cdEntity.doctypeIntendedfor = document.doctypeIntendedfor;
            // cdEntity.pageId = document.pageId;
            // cdEntity.activeCdmetaData = cd.activeCdmetaData;
        }
        throw new Error("test");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM intendedfor
        `);
        await queryRunner.query(`
            DELETE FROM doctype
        `);
    }

}
