/*
 Navicat Premium Dump SQL

 Source Server         : account_senoirproject
 Source Server Type    : MySQL
 Source Server Version : 101110 (10.11.10-MariaDB)
 Source Host           : 153.92.15.30:3306
 Source Schema         : u713302023_accounting

 Target Server Type    : MySQL
 Target Server Version : 101110 (10.11.10-MariaDB)
 File Encoding         : 65001

 Date: 26/01/2025 15:53:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account_category
-- ----------------------------
DROP TABLE IF EXISTS `account_category`;
CREATE TABLE `account_category`  (
  `account_category_id` int NOT NULL AUTO_INCREMENT,
  `account_category_section` int NULL DEFAULT NULL COMMENT 'หมวด',
  `account_category_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ชื่อหมวด',
  `account_category_base` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'การลงบัญชี',
  PRIMARY KEY (`account_category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_category
-- ----------------------------
INSERT INTO `account_category` VALUES (1, 1, 'สินทรัพย์', 'DR');
INSERT INTO `account_category` VALUES (2, 2, 'หนี้สิน', 'CR');
INSERT INTO `account_category` VALUES (3, 3, 'ส่วนของเจ้าของ', 'CR');
INSERT INTO `account_category` VALUES (4, 4, 'รายได้', 'CR');
INSERT INTO `account_category` VALUES (5, 5, 'ค่าใช้จ่าย', 'DR');
INSERT INTO `account_category` VALUES (6, NULL, NULL, 'DR');

-- ----------------------------
-- Table structure for account_group
-- ----------------------------
DROP TABLE IF EXISTS `account_group`;
CREATE TABLE `account_group`  (
  `account_group_id` int NOT NULL AUTO_INCREMENT,
  `account_group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ชื่อกลุ่ม',
  `account_group_sort` int NULL DEFAULT NULL COMMENT 'เรียงลำดับ',
  `account_category_id` int NULL DEFAULT NULL COMMENT 'อยู่ในหมวด',
  PRIMARY KEY (`account_group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 47 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_group
-- ----------------------------
INSERT INTO `account_group` VALUES (1, 'เงินคงมือ', NULL, 1);
INSERT INTO `account_group` VALUES (2, 'ธนาคาร', NULL, 1);
INSERT INTO `account_group` VALUES (3, 'ลูกหนี้', NULL, 1);
INSERT INTO `account_group` VALUES (4, 'สินทรัพย์ระยะยาว', NULL, 1);
INSERT INTO `account_group` VALUES (5, 'อุปกรณ์', NULL, 1);
INSERT INTO `account_group` VALUES (8, 'เจ้าหนี้ทั่วไป', NULL, 2);
INSERT INTO `account_group` VALUES (9, 'เจ้าหนี้สัญญา', NULL, 2);
INSERT INTO `account_group` VALUES (10, 'เจ้าหนี้ผ่อน', NULL, 2);
INSERT INTO `account_group` VALUES (11, 'เจ้าหนี้อื่น ๆ', NULL, 2);
INSERT INTO `account_group` VALUES (12, 'ส่วนของเจ้าของ', NULL, 3);
INSERT INTO `account_group` VALUES (13, 'รายได้หลัก', NULL, 4);
INSERT INTO `account_group` VALUES (14, 'รายได้เสริม', NULL, 4);
INSERT INTO `account_group` VALUES (15, 'รายได้เบ็ตเล็ด', NULL, 4);
INSERT INTO `account_group` VALUES (16, 'ค่าอาหาร', NULL, 5);
INSERT INTO `account_group` VALUES (17, 'ค่าเดินทาง', NULL, 5);
INSERT INTO `account_group` VALUES (18, 'ค่าพาหนะ', NULL, 5);
INSERT INTO `account_group` VALUES (19, 'ค่าความรู้และการศึกษา', NULL, 5);
INSERT INTO `account_group` VALUES (20, 'ค่าความบันเทิง', NULL, 5);
INSERT INTO `account_group` VALUES (21, 'ค่าเลี้ยงรับรอง', NULL, 5);
INSERT INTO `account_group` VALUES (22, 'ค่าสาธารณูประโภค', NULL, 5);
INSERT INTO `account_group` VALUES (23, 'ค่าของใช้ส่วนตัว', NULL, 5);
INSERT INTO `account_group` VALUES (24, 'ค่าจัดการส่วนตัว', NULL, 5);
INSERT INTO `account_group` VALUES (25, 'ค่าอื่น ๆ', NULL, 5);
INSERT INTO `account_group` VALUES (45, 'รักนัก', NULL, 4);
INSERT INTO `account_group` VALUES (46, 'ที่รัก', NULL, 4);

-- ----------------------------
-- Table structure for account_icon
-- ----------------------------
DROP TABLE IF EXISTS `account_icon`;
CREATE TABLE `account_icon`  (
  `account_icon_id` int NOT NULL,
  `account_icon_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`account_icon_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_icon
-- ----------------------------

-- ----------------------------
-- Table structure for account_transition
-- ----------------------------
DROP TABLE IF EXISTS `account_transition`;
CREATE TABLE `account_transition`  (
  `account_transition_id` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสการดำเนินการ',
  `account_type_id` int NULL DEFAULT NULL COMMENT 'รหัสประเภท',
  `account_category_id` int NULL DEFAULT NULL COMMENT 'ประเภทอ้างอิง',
  `account_transition_value` decimal(10, 2) NULL DEFAULT NULL COMMENT 'จำนวนเงิน',
  `account_transition_datetime` datetime NULL DEFAULT NULL COMMENT 'วันที่บันทึก',
  `account_transition_start` int NULL DEFAULT NULL COMMENT 'เริ่มเปิดบัญชีไหม',
  `account_transition_submit` int NULL DEFAULT NULL COMMENT 'ยืนยันแล้ว',
  `account_type_from_id` int NULL DEFAULT NULL COMMENT 'รายการบัญชีอ้างอิง',
  `account_category_from_id` int NULL DEFAULT NULL COMMENT 'รายการอ้างอินประเภท',
  `account_type_dr_id` int NULL DEFAULT NULL COMMENT 'DR',
  `account_type_cr_id` int NULL DEFAULT NULL COMMENT 'CR',
  PRIMARY KEY (`account_transition_id`) USING BTREE,
  UNIQUE INDEX `acccount_check`(`account_type_id` ASC, `account_transition_start` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1045 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_transition
-- ----------------------------

-- ----------------------------
-- Table structure for account_type
-- ----------------------------
DROP TABLE IF EXISTS `account_type`;
CREATE TABLE `account_type`  (
  `account_type_id` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสประเภท',
  `account_type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ชื่อประเภท',
  `account_type_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ค่าเริ่มต้น',
  `account_type_description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'รายละเอียด',
  `account_type_from_id` int NULL DEFAULT NULL COMMENT 'ค่าเชื่อมโยงประเภท',
  `account_type_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ไอคอน',
  `account_type_important` int NOT NULL COMMENT 'ความสำคัญ',
  `account_type_sum` decimal(10, 2) NOT NULL COMMENT 'ยอดรวมเงิน',
  `account_group_id` int NULL DEFAULT NULL COMMENT 'รหัสกลุ่ม',
  `account_category_id` int NULL DEFAULT NULL COMMENT 'รหัสหมวด',
  `account_type_total` decimal(10, 2) NOT NULL COMMENT 'ยอดคงเหลือ',
  PRIMARY KEY (`account_type_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_type
-- ----------------------------
INSERT INTO `account_type` VALUES (1, 'เงินสด', NULL, '', NULL, 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png', 1, 2700.00, 1, 1, 200.00);
INSERT INTO `account_type` VALUES (2, 'เงินสด (ตามที่ต่าง ๆ)', NULL, 'เงินเดือน', 5, 'https://cdn-icons-png.freepik.com/512/8992/8992633.png', 1, 3500.00, 1, 1, 3500.00);
INSERT INTO `account_type` VALUES (3, 'ออมสิน', NULL, NULL, NULL, 'https://cdn.icon-icons.com/icons2/516/PNG/512/coin_money_icon-icons.com_51091.png', 1, 0.00, 2, 1, 0.00);
INSERT INTO `account_type` VALUES (4, 'กรุงไทย', NULL, NULL, NULL, 'https://e7.pngegg.com/pngimages/591/354/png-clipart-krung-thai-bank-money-credit-kasikornbank-bank-blue-text-thumbnail.png', 1, 0.00, 2, 1, 0.00);
INSERT INTO `account_type` VALUES (5, 'กรุงศรี - พร้อมเพย์', NULL, 'พร้อมเพย์', NULL, 'https://play-lh.googleusercontent.com/ovSLL4E--Mo_nJg4XHE8k_9KYCpAbn6FB0FLMgzl6lyNubIJoJxdvWyEnM7sN02DD5I', 1, 0.00, 2, 1, 0.00);
INSERT INTO `account_type` VALUES (6, 'สหกรณ์ - ครู', NULL, NULL, NULL, 'https://nswtsco.com/coop/FileManager/uploads/images/Utils/cooplogo.jpg', 1, 0.00, 4, 1, 0.00);
INSERT INTO `account_type` VALUES (7, 'สหกรณ์ - มรถ.บร.', NULL, NULL, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7mcXJAj-_nSauvRyX15CNf1hZFHfVnouINQ&s', 1, 0.00, 4, 1, 0.00);
INSERT INTO `account_type` VALUES (8, 'รถมอไซต์', NULL, NULL, NULL, 'https://cdn.icon-icons.com/icons2/1368/PNG/512/-motorcycle_89748.png', 0, 0.00, 5, 1, 0.00);
INSERT INTO `account_type` VALUES (9, 'เงินเดือน', NULL, 'เอาน่า', 4, 'https://png.pngtree.com/element_our/png_detail/20181114/salary-icon-png_239779.jpg', 0, 0.00, 13, 4, 0.00);
INSERT INTO `account_type` VALUES (10, 'Giffarine', NULL, NULL, 1, 'https://pbs.twimg.com/profile_images/1547417089119363072/YEdgLvQI_400x400.jpg', 0, 0.00, 13, 4, 0.00);
INSERT INTO `account_type` VALUES (11, 'งานวิจัย', NULL, NULL, 1, 'https://kris.kmitl.ac.th/wp-content/uploads/2020/04/ethic-icon-3.png', 0, 0.00, 14, 4, 0.00);
INSERT INTO `account_type` VALUES (12, 'ขายของเก่า', NULL, NULL, NULL, 'https://png.pngtree.com/png-vector/20221106/ourmid/pngtree-garage-sale-rgb-color-icon-cheap-icon-vintage-vector-png-image_40254378.jpg', 0, 0.00, 15, 4, 0.00);
INSERT INTO `account_type` VALUES (13, 'เก็บเงินได้', NULL, NULL, NULL, 'https://png.pngtree.com/png-clipart/20191027/ourlarge/pngtree-saving-money-hand-png-image_1842638.jpg', 0, 0.00, 15, 4, 0.00);
INSERT INTO `account_type` VALUES (14, 'ขายของเบ็ตเล็ด', NULL, NULL, NULL, 'https://img.lovepik.com/free-png/20210924/lovepik-a-flat-convenience-store-cartoon-icon-ui-png-image_401358657_wh1200.png', 0, 0.00, 15, 4, 0.00);
INSERT INTO `account_type` VALUES (15, 'อาหาร - โรงอาหาร', NULL, NULL, 4, 'https://cdn-icons-png.flaticon.com/512/5235/5235253.png', 0, 0.00, 16, 5, 0.00);
INSERT INTO `account_type` VALUES (16, 'เครื่องดื่ม', NULL, NULL, 5, 'https://cdn-icons-png.flaticon.com/256/2405/2405451.png', 0, 0.00, 16, 5, 0.00);
INSERT INTO `account_type` VALUES (17, 'Amazon - ชาเขียว', NULL, NULL, 5, 'https://img.wongnai.com/p/256x256/2022/10/01/8e97d954288144b69cdb71377c1e44ab.jpg', 0, 0.00, 16, 5, 0.00);
INSERT INTO `account_type` VALUES (18, 'ค่าน้ำมัน', NULL, NULL, NULL, 'https://cdn.icon-icons.com/icons2/865/PNG/512/Citycons_fuel_icon-icons.com_67929.png', 0, 0.00, 17, 5, 0.00);
INSERT INTO `account_type` VALUES (19, 'ค่าโทรศัพท์', NULL, NULL, NULL, 'https://cdn.icon-icons.com/icons2/1099/PNG/512/1485482192-phone_78665.png', 0, 0.00, 17, 5, 0.00);
INSERT INTO `account_type` VALUES (20, 'ค่าอินเทอร์เน็ต', NULL, NULL, NULL, 'https://png.pngtree.com/png-vector/20190419/ourmid/pngtree-vector-globe-internet-web-online-monitor-icon-png-image_958362.jpg', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (21, 'ค่าน้ำ', NULL, NULL, NULL, 'https://png.pngtree.com/png-vector/20190711/ourmid/pngtree-water-tap-icon-for-your-project-png-image_1541492.jpg', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (22, 'ค่าไฟ', NULL, NULL, NULL, 'https://png.pngtree.com/png-clipart/20230923/original/pngtree-lightbulb-house-electricity-bill-icon-with-yellow-glowing-lighting-utilities-vector-png-image_12578915.png', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (23, 'ที่บ้าน', NULL, NULL, NULL, 'https://cdn.icon-icons.com/icons2/2104/PNG/512/house_icon_129523.png', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (24, 'นักศึกษา - ทศ', NULL, NULL, NULL, 'https://i.pinimg.com/564x/b0/6d/80/b06d80c5216d4ab434a001648b9a33be.jpg', 0, 0.00, 11, 2, 0.00);
INSERT INTO `account_type` VALUES (25, 'นักศึกษา - เจ', NULL, NULL, NULL, 'https://cdn.icon-icons.com/icons2/1670/PNG/512/10212womanstudent_110649.png', 0, 0.00, 11, 2, 0.00);
INSERT INTO `account_type` VALUES (26, 'นักศึกษา - เนม', NULL, NULL, NULL, 'https://cdn.icon-icons.com/icons2/1465/PNG/512/129manstudent1_100298.png', 0, 0.00, 10, 2, 0.00);
INSERT INTO `account_type` VALUES (27, 'นักศึกษา - ต้า', NULL, '', NULL, 'https://lh3.googleusercontent.com/proxy/ax76Z5SnD-30R45_IK39aRGkvCuLCqunaVGoOg80dzx0DE1LgZaoKKpln1lzAVOk5AlN7HgRdxIC-KtBakBvPTrcBZ79mirZyfHoHkz21ZEdXPXuJ3Ym2PY', 0, 500.00, 11, 2, 500.00);
INSERT INTO `account_type` VALUES (57, 'ทุน - เบนซ์ ', NULL, NULL, NULL, NULL, 0, 6200.00, 12, 3, 200.00);

-- ----------------------------
-- Table structure for account_user
-- ----------------------------
DROP TABLE IF EXISTS `account_user`;
CREATE TABLE `account_user`  (
  `account_user_id` int NOT NULL AUTO_INCREMENT,
  `account_user_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `account_user_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `account_user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`account_user_id` DESC) USING BTREE,
  UNIQUE INDEX `account_user_username`(`account_user_username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_user
-- ----------------------------
INSERT INTO `account_user` VALUES (11, 'banz@gmail.com', '$2a$12$Gyf8cLLw0nVt0KsZq.jXj.kyosEniBKabTuvkBwXfO8Elcd2pQihm', NULL);
INSERT INTO `account_user` VALUES (9, 'accout@gmail.com', '$2a$12$.sWGS.KAS66WzrLI96DhBOXSpWh3nP/ywZ.z/NshbXNNA9lG7gdTy', 'admin_');

SET FOREIGN_KEY_CHECKS = 1;
