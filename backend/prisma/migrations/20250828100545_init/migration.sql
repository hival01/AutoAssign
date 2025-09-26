-- CreateTable
CREATE TABLE `Faculty` (
    `faculty_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Faculty_email_key`(`email`),
    PRIMARY KEY (`faculty_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `student_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `dob` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `batch_id` INTEGER NOT NULL,

    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Batch` (
    `batch_id` INTEGER NOT NULL AUTO_INCREMENT,
    `batch_name` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `department` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Batch_batch_name_semester_year_department_key`(`batch_name`, `semester`, `year`, `department`),
    PRIMARY KEY (`batch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `subject_code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`subject_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teaches` (
    `teaches_id` INTEGER NOT NULL AUTO_INCREMENT,
    `faculty_id` INTEGER NOT NULL,
    `subject_code` VARCHAR(191) NOT NULL,
    `batch_id` INTEGER NOT NULL,

    PRIMARY KEY (`teaches_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Takes` (
    `takes_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` VARCHAR(191) NOT NULL,
    `subject_code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`takes_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `source` ENUM('TOPIC', 'PDF') NULL,
    `topic` VARCHAR(191) NULL,
    `subject_code` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `assignment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `created_on` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subject_code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`assignment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssignmentQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignment_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssignmentAllocation` (
    `allocation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` VARCHAR(191) NOT NULL,
    `assignment_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NULL,
    `submitted_on` DATETIME(3) NULL,

    PRIMARY KEY (`allocation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teaches` ADD CONSTRAINT `Teaches_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`faculty_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teaches` ADD CONSTRAINT `Teaches_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Course`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teaches` ADD CONSTRAINT `Teaches_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Takes` ADD CONSTRAINT `Takes_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Takes` ADD CONSTRAINT `Takes_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Course`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Course`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Faculty`(`faculty_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Course`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentQuestion` ADD CONSTRAINT `AssignmentQuestion_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment`(`assignment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentQuestion` ADD CONSTRAINT `AssignmentQuestion_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentAllocation` ADD CONSTRAINT `AssignmentAllocation_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentAllocation` ADD CONSTRAINT `AssignmentAllocation_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment`(`assignment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
