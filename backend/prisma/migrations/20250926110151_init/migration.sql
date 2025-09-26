/*
  Warnings:

  - You are about to alter the column `status` on the `assignmentallocation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `department` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,assignment_id]` on the table `AssignmentAllocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[batch_name,semester,year,dept_id]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id,subject_code,semester_no]` on the table `Takes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deadline` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lateSubmission` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dept_id` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dept_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_sem` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dept_id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester_no` to the `Takes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Batch_batch_name_semester_year_department_key` ON `batch`;

-- AlterTable
ALTER TABLE `assignment` ADD COLUMN `deadline` DATETIME(3) NOT NULL,
    ADD COLUMN `lateSubmission` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `assignmentallocation` MODIFY `status` ENUM('ASSIGNED', 'SUBMITTED', 'LATE') NOT NULL;

-- AlterTable
ALTER TABLE `batch` DROP COLUMN `department`,
    ADD COLUMN `dept_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `course` DROP COLUMN `department`,
    ADD COLUMN `dept_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `current_sem` INTEGER NOT NULL,
    ADD COLUMN `dept_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `takes` ADD COLUMN `semester_no` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `SemesterCourse` (
    `sem_course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_id` INTEGER NOT NULL,
    `semester_no` INTEGER NOT NULL,
    `subject_code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SemesterCourse_dept_id_semester_no_subject_code_key`(`dept_id`, `semester_no`, `subject_code`),
    PRIMARY KEY (`sem_course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `dept_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_code` VARCHAR(191) NOT NULL,
    `dept_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Department_dept_code_key`(`dept_code`),
    PRIMARY KEY (`dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AssignmentAllocation_student_id_assignment_id_key` ON `AssignmentAllocation`(`student_id`, `assignment_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Batch_batch_name_semester_year_dept_id_key` ON `Batch`(`batch_name`, `semester`, `year`, `dept_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Takes_student_id_subject_code_semester_no_key` ON `Takes`(`student_id`, `subject_code`, `semester_no`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `Department`(`dept_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `Department`(`dept_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `Department`(`dept_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SemesterCourse` ADD CONSTRAINT `SemesterCourse_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `Department`(`dept_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SemesterCourse` ADD CONSTRAINT `SemesterCourse_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Course`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;
