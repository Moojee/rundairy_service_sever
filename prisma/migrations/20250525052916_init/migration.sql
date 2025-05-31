-- CreateTable
CREATE TABLE `run_tb` (
    `runId` INTEGER NOT NULL AUTO_INCREMENT,
    `runLocation` VARCHAR(150) NOT NULL,
    `runDistance` FLOAT NOT NULL,
    `runTime` INTEGER NOT NULL,

    PRIMARY KEY (`runId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
