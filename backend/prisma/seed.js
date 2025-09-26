// // prisma/seed.js
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//   console.log("Starting seed...")

//   // --- Courses ---
//   const cs101 = await prisma.courses.create({
//     data: { CourseID: "CS101", Title: "Data Structures", Department: "Computer Science" }
//   })

//   const cs102 = await prisma.courses.create({
//     data: { CourseID: "CS102", Title: "Database Management", Department: "Computer Science" }
//   })

//   const ma101 = await prisma.courses.create({
//     data: { CourseID: "MA101", Title: "Calculus", Department: "Mathematics" }
//   })

//   // --- Faculties ---
//   const faculty1 = await prisma.facultyinfo.create({
//     data: {
//       FacultyName: "Dr. Mehta",
//       Department: "Computer Science",
//       Email: "mehta@univ.edu",
//       Password: "password123"
//     }
//   })

//   const faculty2 = await prisma.facultyinfo.create({
//     data: {
//       FacultyName: "Prof. Shah",
//       Department: "Mathematics",
//       Email: "shah@univ.edu",
//       Password: "secure456"
//     }
//   })

//   // --- Students ---
//   const student1 = await prisma.studentinfo.create({
//     data: {
//       StudentId: "S001",
//       StudentName: "Amit Patel",
//       Department: "Computer Science",
//       Email: "amit@univ.edu",
//       DOB: new Date("2003-05-10"),
//       Batch: "2025",
//       Password: "amitpass"
//     }
//   })

//   const student2 = await prisma.studentinfo.create({
//     data: {
//       StudentId: "S002",
//       StudentName: "Riya Sharma",
//       Department: "Computer Science",
//       Email: "riya@univ.edu",
//       DOB: new Date("2003-09-15"),
//       Batch: "2025",
//       Password: "riya123"
//     }
//   })

//   const student3 = await prisma.studentinfo.create({
//     data: {
//       StudentId: "S003",
//       StudentName: "Karan Joshi",
//       Department: "Mathematics",
//       Email: "karan@univ.edu",
//       DOB: new Date("2002-12-01"),
//       Batch: "2024",
//       Password: "karanpass"
//     }
//   })

//   // --- Teaches ---
//   await prisma.teaches.create({
//     data: { FacultyID: faculty1.FacultyID, CourseID: cs101.CourseID, Batch: "2025", Semester: 4 }
//   })

//   await prisma.teaches.create({
//     data: { FacultyID: faculty1.FacultyID, CourseID: cs102.CourseID, Batch: "2025", Semester: 4 }
//   })

//   await prisma.teaches.create({
//     data: { FacultyID: faculty2.FacultyID, CourseID: ma101.CourseID, Batch: "2024", Semester: 2 }
//   })

//   // --- Takes ---
//   await prisma.takes.create({
//     data: { StudentId: student1.StudentId, CourseID: cs101.CourseID, Semester: 4, Batch: "2025" }
//   })

//   await prisma.takes.create({
//     data: { StudentId: student2.StudentId, CourseID: cs101.CourseID, Semester: 4, Batch: "2025" }
//   })

//   await prisma.takes.create({
//     data: { StudentId: student3.StudentId, CourseID: ma101.CourseID, Semester: 2, Batch: "2024" }
//   })

//   console.log("✅ Seed completed successfully")
// }

// main()
//   .catch(e => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
