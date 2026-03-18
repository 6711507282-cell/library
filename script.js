// นำเข้าฟังก์ชันของ Firebase V9 จาก CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ใส่ Config ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyBJJWKjpd8CajlLHyfPyS1840RI07J4Fdg",
  authDomain: "library-bab3f.firebaseapp.com",
  projectId: "library-bab3f",
  storageBucket: "library-bab3f.firebasestorage.app",
  messagingSenderId: "140830822754",
  appId: "1:140830822754:web:0612c01a61c2dc6e115c3b",
  measurementId: "G-QMMXHDVP67"
};

// เริ่มต้นการเชื่อมต่อ Firebase และ Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ดึง Elements จาก HTML มาใช้งาน
const loginSection = document.getElementById('login-section');
const librarySection = document.getElementById('library-section');
const loginForm = document.getElementById('login-form');
const userDisplay = document.getElementById('user-display');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const addMockBooksBtn = document.getElementById('add-mock-books');

// 1. ระบบบันทึกข้อมูลและเข้าสู่ระบบ
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    
    // เก็บข้อมูลที่กรอกลงในตัวแปร
    const userData = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        year: document.getElementById('year').value,
        major: document.getElementById('major').value,
        faculty: document.getElementById('faculty').value,
        loginTime: new Date()
    };

    try {
        // เปลี่ยนข้อความปุ่มระหว่างรอ
        const submitBtn = loginForm.querySelector('button');
        submitBtn.innerText = "กำลังเข้าสู่ระบบ...";

        // บันทึกข้อมูลลง Collection "users_log" ใน Firestore
        await addDoc(collection(db, "users_log"), userData);

        // เมื่อบันทึกเสร็จ ซ่อนหน้าล็อกอิน และโชว์หน้าห้องสมุด
        loginSection.classList.add('hidden');
        librarySection.classList.remove('hidden');
        
        // แสดงชื่อต้อนรับ
        userDisplay.innerText = `สวัสดีคุณ ${userData.fname} ${userData.lname} (ชั้นปี ${userData.year} สาขา${userData.major})`;
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่");
        submitBtn.innerText = "เข้าสู่ระบบ";
    }
});

// 2. ระบบค้นหาหนังสือ
searchBtn.addEventListener('click', async () => {
    const keyword = searchInput.value.trim().toLowerCase();
    
    if (keyword === "") {
        alert("กรุณาพิมพ์คำค้นหาก่อนครับ");
        return;
    }

    searchResults.innerHTML = "<p style='text-align:center;'>กำลังค้นหา...</p>";

    try {
        // ดึงข้อมูลหนังสือทั้งหมดจาก Collection "books"
        const querySnapshot = await getDocs(collection(db, "books"));
        const books = [];
        
        querySnapshot.forEach((doc) => {
            books.push(doc.data());
        });

        // ค้นหาคำที่ตรงกับชื่อหนังสือ หรือ หมวดหมู่
        const filteredBooks = books.filter(book => 
            (book.title && book.title.toLowerCase().includes(keyword)) ||
            (book.category && book.category.toLowerCase().includes(keyword))
        );

        displayResults(filteredBooks);
    } catch (error) {
        console.error("Error getting books: ", error);
        searchResults.innerHTML = "<p style='text-align:center; color:red;'>เกิดข้อผิดพลาดในการดึงข้อมูล</p>";
    }
});

// ฟังก์ชันแสดงผลลัพธ์การค้นหา
function displayResults(books) {
    searchResults.innerHTML = ""; // เคลียร์ผลลัพธ์เก่า

    if (books.length === 0) {
        searchResults.innerHTML = "<p style='text-align:center; color:#e74c3c;'>ไม่พบหนังสือที่คุณค้นหา ลองคำอื่นดูนะครับ</p>";
        return;
    }

    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        div.innerHTML = `
            <div class="book-title">📚 ${book.title}</div>
            <div class="book-detail">หมวดหมู่: ${book.category} | ผู้แต่ง: ${book.author} | รหัส: ${book.bookId}</div>
        `;
        searchResults.appendChild(div);
    });
}

// 3. ปุ่มตัวช่วย: เพิ่มข้อมูลหนังสือจำลอง (เพื่อใช้เทสต์ระบบ)
addMockBooksBtn.addEventListener('click', async () => {
    addMockBooksBtn.innerText = "กำลังเพิ่มข้อมูล...";
    
    // ข้อมูลหนังสือจำลอง
    const mockBooks = [
        { title: "หลักการใช้ภาษาไทยเบื้องต้น", category: "ภาษาไทย", author: "อ.สมมติ รักเรียน", bookId: "TH-001" },
        { title: "วรรณคดีไทยและการวิเคราะห์", category: "ภาษาไทย", author: "อ.ใจดี มีสุข", bookId: "TH-002" },
        { title: "พื้นฐานการเขียนเว็บ HTML CSS", category: "คอมพิวเตอร์", author: "อ.โค้ดดิ้ง เก่งกาจ", bookId: "CS-001" },
        { title: "ประวัติศาสตร์ศิลปะตะวันตก", category: "ศิลปกรรม", author: "อ.อาร์ต สวยงาม", bookId: "AR-001" }
    ];

    try {
        for (const book of mockBooks) {
            await addDoc(collection(db, "books"), book);
        }
        alert("เพิ่มข้อมูลหนังสือเรียบร้อย! ตอนนี้ลองพิมพ์คำว่า 'ภาษาไทย' ในช่องค้นหาดูครับ");
        addMockBooksBtn.style.display = 'none'; // ซ่อนปุ่มเมื่อกดเพิ่มข้อมูลสำเร็จแล้ว
    } catch (error) {
        console.error("Error adding mock books: ", error);
        alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
});
