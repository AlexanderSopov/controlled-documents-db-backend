import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1749294374040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Table: doctype
            CREATE TABLE doctype (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL, -- Semantic unique key (e.g., 101, 1100)
                name VARCHAR(100) NOT NULL,       -- Name of the document type
                description TEXT                  -- Optional description
            )
        `);
        await queryRunner.query(`
            -- Table: intendedfor
            CREATE TABLE intendedfor (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL, -- Semantic unique key (e.g., PD500, ABC0010)
                name VARCHAR(100) NOT NULL,       -- Name of the product/project
                type ENUM('Project', 'Product', 'Miscellaneous') NOT NULL, -- Enum for type
                description TEXT,                  -- Optional description (TEXT for longer strings)
                url VARCHAR(255)                  -- Optional URL
            )
        `);
        await queryRunner.query(`
            -- Table: doctype_intendedfor (Junction table for many-to-many relationship)
            CREATE TABLE doctype_intendedfor (
                id INT AUTO_INCREMENT PRIMARY KEY,
                intendedfor INT NOT NULL, -- Foreign key to intendedfor
                doctype INT NOT NULL,     -- Foreign key to doctype
                FOREIGN KEY (intendedfor) REFERENCES intendedfor(id) ON DELETE CASCADE,
                FOREIGN KEY (doctype) REFERENCES doctype(id) ON DELETE CASCADE,
                CONSTRAINT unique_doctype_intendedfor UNIQUE (intendedfor, doctype) -- Ensure unique pairs
            )
        `);
        await queryRunner.query(`
            -- Table: controlled_document
            CREATE TABLE controlled_document (
                id INT AUTO_INCREMENT PRIMARY KEY,
                serial_number VARCHAR(4) NOT NULL,
                doctype_intendedfor INT NOT NULL,
                page_id VARCHAR(50),
                active_cd_meta_data INT,
                cd_type ENUM('Regular', 'JCD') NOT NULL,
                issue_type VARCHAR(50),
                FOREIGN KEY (doctype_intendedfor) REFERENCES doctype_intendedfor(id) ON DELETE RESTRICT,
                -- FOREIGN KEY (active_cd_meta_data) REFERENCES cd_meta_data(id) ON DELETE SET NULL,
                CONSTRAINT chk_serial_number CHECK (LENGTH(serial_number) BETWEEN 3 AND 4)
            )
        `);
        await queryRunner.query(`
            -- Table: cd_meta_data
            CREATE TABLE cd_meta_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                document INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                prepared_by VARCHAR(100) NOT NULL,
                security VARCHAR(50),
                date DATE,
                page_version INT,
                FOREIGN KEY (document) REFERENCES controlled_document(id) ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`
            -- Table: document_release
            CREATE TABLE document_release (
                id INT AUTO_INCREMENT PRIMARY KEY,
                document INT NOT NULL,
                release_letter CHAR(4) NOT NULL,
                is_pre_release BOOLEAN NOT NULL,
                page_version INT,
                comment TEXT,
                user VARCHAR(100),
                pdf_url VARCHAR(255),
                date DATE,
                FOREIGN KEY (document) REFERENCES controlled_document(id) ON DELETE CASCADE,
                CONSTRAINT chk_release_letter CHECK (LENGTH(release_letter) = 4)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE document_release
        `);
        await queryRunner.query(`
            DROP TABLE cd_meta_data
        `);
        await queryRunner.query(`
            DROP TABLE controlled_document
        `);
        await queryRunner.query(`
            DROP TABLE doctype_intendedfor
        `);
        await queryRunner.query(`
            DROP TABLE doctype
        `);
        await queryRunner.query(`
            DROP TABLE intendedfor
        `);
    }

}
