import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'الدليل القانوني',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Arial', // خط بسيط
      ),
      home: const Directionality(
        textDirection: TextDirection.rtl, // باش العربية تبدا من اليمين
        child: HomePage(),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5FA), // لون الخلفية الرمادي الفاتح
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Icon(Icons.menu, color: Colors.black), // زر القائمة
            const Column(
              children: [
                Text(
                  "القانون",
                  style: TextStyle(
                      color: Color(0xFF1E3A8A), fontWeight: FontWeight.bold),
                ),
                Text(
                  "البوابة القانونية المغربية",
                  style: TextStyle(color: Colors.grey, fontSize: 10),
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF1E3A8A),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.gavel, color: Colors.white), // أيقونة المطرقة
            ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // === Search Bar (البحث) ===
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      spreadRadius: 1,
                      blurRadius: 5)
                ],
              ),
              child: const TextField(
                decoration: InputDecoration(
                  hintText: "ابحث عن القوانين، الأكواد...",
                  prefixIcon: Icon(Icons.search),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.all(15),
                ),
              ),
            ),
            const SizedBox(height: 20),
            
            // === العنوان ===
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("الدليل القانوني",
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text("عرض الكل",
                    style: TextStyle(
                        color: Color(0xFF1E3A8A), fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 15),

            // === البطاقات (Cards) ===
            Expanded(
              child: ListView(
                children: const [
                  LawCard(
                    title: "القانون المدني",
                    subtitle: "القواعد الأساسية للعلاقات...",
                    codeType: "CODE CIVIL",
                    icon: Icons.home,
                    color: Colors.blue,
                  ),
                  LawCard(
                    title: "القانون الجنائي",
                    subtitle: "النصوص المحددة للجرائم...",
                    codeType: "CODE PENAL",
                    icon: Icons.security,
                    color: Colors.red,
                  ),
                  LawCard(
                    title: "مدونة الأسرة",
                    subtitle: "الأحكام المتعلقة بالزواج والطلاق...",
                    codeType: "MOUDAWANA",
                    icon: Icons.family_restroom,
                    color: Colors.green,
                  ),
                  LawCard(
                    title: "القانون التجاري",
                    subtitle: "القوانين المنظمة للمعاملات...",
                    codeType: "CODE COMMERCE",
                    icon: Icons.store,
                    color: Colors.orange,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      // === البارة التحتانية (Bottom Bar) ===
      bottomNavigationBar: BottomNavigationBar(
        selectedItemColor: const Color(0xFF1E3A8A),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.book), label: "المكتبة"),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: "بحث"),
          BottomNavigationBarItem(icon: Icon(Icons.bookmark), label: "المحفوظات"),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "الحساب"),
        ],
      ),
    );
  }
}

// === Widget ديال البطاقة باش ما نعاودوش الكود بزاف ===
class LawCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String codeType;
  final IconData icon;
  final MaterialColor color;

  const LawCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.codeType,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(color: Colors.grey.withOpacity(0.1), spreadRadius: 1, blurRadius: 5)
        ],
      ),
      child: Row(
        children: [
          // الأيقونة
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 30),
          ),
          const SizedBox(width: 15),
          // النصوص
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(codeType, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}