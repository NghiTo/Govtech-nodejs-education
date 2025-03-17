import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  const teachersData = [
    { id: uuidv4(), email: "teacher1@gmail.com" },
    { id: uuidv4(), email: "teacher2@gmail.com" },
    { id: uuidv4(), email: "teacher3@gmail.com" },
    { id: uuidv4(), email: "teacher4@gmail.com" },
    { id: uuidv4(), email: "teacher5@gmail.com" },
  ];

  const teachers = await prisma.teacher.createMany({
    data: teachersData,
  });

  const studentsData = [
    { id: uuidv4(), email: "student1@gmail.com", suspended: false },
    { id: uuidv4(), email: "student2@gmail.com", suspended: false },
    { id: uuidv4(), email: "student3@gmail.com", suspended: false },
    { id: uuidv4(), email: "student4@gmail.com", suspended: false },
    { id: uuidv4(), email: "student5@gmail.com", suspended: false },
  ];

  const students = await prisma.student.createMany({
    data: studentsData,
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
``;
