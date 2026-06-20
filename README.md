# VALO STORE — Valorant Account Shop

เว็บขายบัญชี Valorant โทนสีส้ม minimalist พร้อมระบบหลังบ้าน

## Stack

- **Next.js 15.3.9** (App Router, ปลอดภัยจาก CVE-2025-66478)
- **TypeScript**
- **Tailwind CSS**
- **Redis** (Upstash ผ่าน Vercel Marketplace) — เก็บข้อมูลถาวรบน production
- ใช้ in-memory fallback อัตโนมัติตอน dev บนเครื่อง (ไม่ต้องตั้งค่าอะไรเพิ่ม)

---

## วิธีติดตั้งและรันบนเครื่อง (Local Development)

```bash
npm install
cp .env.example .env.local
npm run dev
```

เปิด http://localhost:3000 — ตอน dev บนเครื่อง **ไม่จำเป็นต้องตั้งค่า Redis** ระบบจะใช้
หน่วยความจำชั่วคราวแทนให้อัตโนมัติ (ข้อมูลจะหายเมื่อ restart dev server เป็นเรื่องปกติ)

---

## ⚠️ สำคัญมาก: ต้องตั้งค่า Redis ก่อน Deploy จริงบน Vercel

Vercel เป็น serverless — เขียนไฟล์ลง disk แบบถาวรไม่ได้ ระบบนี้จึงใช้ **Redis**
(ผ่าน Vercel Marketplace, ขับเคลื่อนโดย Upstash) เก็บข้อมูลแทน ต้องตั้งค่าก่อนใช้งานจริง
ไม่งั้นกด "บันทึก" ในหน้า Admin จะ error ทุกครั้ง

### ขั้นตอนเชื่อม Redis เข้ากับโปรเจกต์ (ทำครั้งเดียว ฟรี)

1. เข้า [Vercel Dashboard](https://vercel.com/dashboard) → เลือกโปรเจกต์ของคุณ
2. ไปแท็บ **Storage** → **Marketplace Database Providers**
3. หา **Redis** (by Upstash) → กด **Create** หรือ **Install**
4. เลือก region ใกล้ผู้ใช้งาน (เช่น Singapore) → เลือกแผนฟรี → **Continue** → **Create**
5. หลังสร้างเสร็จ ระบบจะถาม "Connect to Project" → เลือกโปรเจกต์ของคุณ → กด Connect
6. Vercel จะ inject environment variables ให้อัตโนมัติ (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
7. ไปที่ **Deployments** → กด **Redeploy** (สำคัญ! ต้อง redeploy ให้ env var มีผล)

หลังจากนี้หน้า Admin จะบันทึกข้อมูลได้ถาวรแล้ว ✅

---

## โครงสร้างหน้าเว็บ

| หน้า | URL | คำอธิบาย |
|------|-----|-----------|
| หน้าหลัก | `/` | แสดงบัญชีทั้งหมดแบบ grid |
| รายละเอียด | `/account/[id]` | รูปซ้าย ข้อมูลขวา |
| Admin | `/admin` | หลังบ้านจัดการข้อมูล |

### เข้า Admin
คลิกปุ่ม `admin` มุมขวาบนของเว็บ (ไม่เด้งอัตโนมัติ ต้องคลิกเอง) แล้วกรอกรหัสผ่าน

**รหัส default:** `admin123`
**เปลี่ยนได้ที่:** Vercel → Settings → Environment Variables → `ADMIN_PASSWORD`
(ต้อง Redeploy ทุกครั้งที่เปลี่ยนค่า)

---

## ฟีเจอร์ Admin

### บัญชี
- เพิ่ม/แก้ไข/ลบบัญชี
- กำหนดแรงค์จาก Valorant ทุกแรงค์ (Iron–Radiant)
- กำหนดราคา, รายละเอียด, URL รูปภาพ
- ทำเครื่องหมาย Sold

### การตั้งค่า
- เปลี่ยนชื่อเว็บ/โลโก้
- แก้ไขข้อความ Hero Section
- กำหนด LINE ID และ Discord

### แรงค์
- เปลี่ยน URL รูปภาพของแต่ละแรงค์ได้
- รองรับ URL ภายนอกหรือไฟล์ใน `/public/ranks/`

---

## Deploy ขึ้น GitHub + Vercel (จากศูนย์)

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/valorant-shop.git
git push -u origin main
```

จากนั้นใน Vercel:
1. New Project → Import จาก GitHub repo
2. ตั้งค่า Environment Variables:
   ```
   ADMIN_PASSWORD = รหัสผ่านที่ต้องการ
   ```
3. Deploy
4. **ทำตามขั้นตอน "ตั้งค่า Redis" ด้านบนให้ครบ** ก่อนใช้งานจริง

---

## Troubleshooting

**"เกิดข้อผิดพลาด" เวลาบันทึกข้อมูลใน Admin**
→ ยังไม่ได้เชื่อม Redis หรือยังไม่ได้ Redeploy หลังเชื่อม ทำตามขั้นตอนด้านบน

**ข้อมูลหายหลัง deploy ใหม่ทุกครั้ง**
→ แปลว่ายังไม่ได้ตั้งค่า Redis เว็บกำลังใช้ fallback ชั่วคราวอยู่

**ลืมรหัส Admin**
→ ไปที่ Vercel → Settings → Environment Variables → แก้ `ADMIN_PASSWORD` → Redeploy
