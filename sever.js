const express = require('express'); // ใช้สร้าง web sever เพื่อสร้าง API
//const cros = require('cors'); // ใช้จัดการการเรียก API ข้ามโดเมน
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); //ใช้จัดการฐานข้อมูลผ่าน Prisma

// สร้าว web sever
const app = express();

// กำหนดพอร์ต web sever ที่จำทำงาน
const PORT = 5050;

//ใข้ middleware จัดการ
app.use(cors());
app.use(express.json());

//ทดสอบการใช้งาน websever xx
app.get(`/`, (req, res) => {
    res.status(200).json({
        message: 'sever ใช้งานได้ OK จ้า'
    });
});

// -----------------------------------------------// 
// -------------- สร้าง API ----------------------//

//สร้างตัวแปร prisma เพื่อใช้ในการทำงานกับฐานข้อมูล
const prisma = new PrismaClient();

app.post("/api/run", async (request, response) => {
    try {
        //เอาข้อมูลที่ส่งมาซี่งจะอยู่ใน request.body มาเก็บในตัวแปร
        const { runLocation, runDistance, runTime } = request.body;

        //เอาข้อมูลที่อยู่ในตัวแปรส่งให้กับ Prisma เพื่อเอาไปบันทึก (create) ลงตาราง
        const result = await prisma.run_tb.create({
            data: {
                runLocation: runLocation,
                runDistance: runDistance,
                runTime: runTime
            }
        })

        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(201).json({ message: "create complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

//API ดึงข้อมูลทั้งหมดจากตาราง run_tb (Endpoint: /api/run)
app.get("/api/run", async (request, response) => {
    try {
        //ให้ Prisma ไปดึงข้อมูลทั้งหมดจากตาราง
        const result = await prisma.run_tb.findMany();

        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(200).json({ message: "get complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

//API แก้ไข
app.put("/api/run/:runId", async (request, response) => {
    try {
        //เอาข้อมูลที่ส่งมาซี่งจะอยู่ใน request.body มาเก็บในตัวแปร
        const { runLocation, runDistance, runTime } = request.body;

        //เอาข้อมูลที่อยู่ในตัวแปรกับที่ส่งมาเป็น request params ส่งให้กับ Prisma เพื่อเอาไปบันทึกแก้ไข (update) ลงตาราง
        const result = await prisma.run_tb.update({
            data: {
                runLocation: runLocation,
                runDistance: runDistance,
                runTime: runTime
            },
            where: {
                runId: parseInt(request.params.runId)
            }
        })

        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(200).json({ message: "update complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

//API ลบ
app.delete("/api/run/:runId", async (request, response) => {
    try {
        //เอาข้อมูลที่ส่งกับ request params ส่งให้กับ Prisma เพื่อเอาไปเป็นเงื่อนไขในการลบ
        const result = await prisma.run_tb.delete({
            where: {
                runId: parseInt(request.params.runId)
            }
        })

        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(200).json({ message: "delete complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})


// เปิดให้บริการ websever ตามที่สร้างไว้ผ่าน port
app.listen(PORT, () => {
    console.log(`sever is running on port ${PORT}`);
});
