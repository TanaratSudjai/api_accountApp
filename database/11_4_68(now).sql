/*
 Navicat Premium Dump SQL

 Source Server         : FinalProject
 Source Server Type    : MySQL
 Source Server Version : 80100 (8.1.0)
 Source Host           : localhost:3366
 Source Schema         : accounting

 Target Server Type    : MySQL
 Target Server Version : 80100 (8.1.0)
 File Encoding         : 65001

 Date: 11/04/2025 12:32:23
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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_category
-- ----------------------------
INSERT INTO `account_category` VALUES (1, 1, 'สินทรัพย์', 'DR');
INSERT INTO `account_category` VALUES (2, 2, 'หนี้สิน', 'CR');
INSERT INTO `account_category` VALUES (3, 3, 'ส่วนของเจ้าของ', 'CR');
INSERT INTO `account_category` VALUES (4, 4, 'รายได้', 'CR');
INSERT INTO `account_category` VALUES (5, 5, 'ค่าใช้จ่าย', 'DR');
INSERT INTO `account_category` VALUES (6, 6, 'ลูกหนี้', 'DR');
INSERT INTO `account_category` VALUES (7, 7, 'ธนาคาร', 'DR');

-- ----------------------------
-- Table structure for account_group
-- ----------------------------
DROP TABLE IF EXISTS `account_group`;
CREATE TABLE `account_group`  (
  `account_group_id` int NOT NULL AUTO_INCREMENT,
  `account_group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ชื่อกลุ่ม',
  `account_group_sort` int NULL DEFAULT NULL COMMENT 'เรียงลำดับ',
  `account_category_id` int NULL DEFAULT NULL COMMENT 'อยู่ในหมวด',
  `account_user_id` int NULL DEFAULT NULL COMMENT 'รหัสของผู้ใช้',
  PRIMARY KEY (`account_group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 63 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_group
-- ----------------------------
INSERT INTO `account_group` VALUES (1, 'เงินคงมือ', NULL, 1, 11);
INSERT INTO `account_group` VALUES (2, 'ธนาคาร', NULL, 1, 11);
INSERT INTO `account_group` VALUES (3, 'ลูกหนี้', NULL, 1, 11);
INSERT INTO `account_group` VALUES (4, 'สินทรัพย์ระยะยาว', NULL, 1, 11);
INSERT INTO `account_group` VALUES (5, 'อุปกรณ์', NULL, 1, 11);
INSERT INTO `account_group` VALUES (8, 'เจ้าหนี้ทั่วไป', NULL, 2, 11);
INSERT INTO `account_group` VALUES (9, 'เจ้าหนี้สัญญา', NULL, 2, 11);
INSERT INTO `account_group` VALUES (10, 'เจ้าหนี้ผ่อน', NULL, 2, 11);
INSERT INTO `account_group` VALUES (11, 'เจ้าหนี้อื่น ๆ', NULL, 2, 11);
INSERT INTO `account_group` VALUES (12, 'ส่วนของเจ้าของ', NULL, 3, 11);
INSERT INTO `account_group` VALUES (13, 'รายได้หลัก', NULL, 4, 11);
INSERT INTO `account_group` VALUES (14, 'รายได้เสริม', NULL, 4, 11);
INSERT INTO `account_group` VALUES (15, 'รายได้เบ็ตเล็ด', NULL, 4, 11);
INSERT INTO `account_group` VALUES (16, 'ค่าอาหาร', NULL, 5, 11);
INSERT INTO `account_group` VALUES (17, 'ค่าเดินทาง', NULL, 5, 11);
INSERT INTO `account_group` VALUES (18, 'ค่าพาหนะ', NULL, 5, 11);
INSERT INTO `account_group` VALUES (19, 'ค่าความรู้และการศึกษา', NULL, 5, 11);
INSERT INTO `account_group` VALUES (20, 'ค่าความบันเทิง', NULL, 5, 11);
INSERT INTO `account_group` VALUES (21, 'ค่าเลี้ยงรับรอง', NULL, 5, 11);
INSERT INTO `account_group` VALUES (22, 'ค่าสาธารณูประโภค', NULL, 5, 11);
INSERT INTO `account_group` VALUES (23, 'ค่าของใช้ส่วนตัว', NULL, 5, 11);
INSERT INTO `account_group` VALUES (24, 'ค่าจัดการส่วนตัว', NULL, 5, 11);
INSERT INTO `account_group` VALUES (25, 'ค่าอื่น ๆ', NULL, 5, 11);
INSERT INTO `account_group` VALUES (45, 'รักนัก', NULL, 4, 11);
INSERT INTO `account_group` VALUES (46, 'ที่รัก', NULL, 4, 11);
INSERT INTO `account_group` VALUES (47, 'เงินคงมือ', NULL, 1, 12);
INSERT INTO `account_group` VALUES (48, 'หนี้รายเดือน', NULL, 2, 12);
INSERT INTO `account_group` VALUES (49, 'ลูกหนี้ทั่วไป', NULL, 6, 12);
INSERT INTO `account_group` VALUES (50, 'รายได้รายเดือน', NULL, 4, 12);
INSERT INTO `account_group` VALUES (51, 'รายได้รายสัปดาห์', NULL, 4, 12);
INSERT INTO `account_group` VALUES (52, 'ค่าใช้จ่ายรายเดือน', NULL, 5, 12);
INSERT INTO `account_group` VALUES (53, 'ค่่าใช้จ่ายประจำวัน', NULL, 5, 12);
INSERT INTO `account_group` VALUES (54, 'ธนาคารทั่่วไป', NULL, 7, 12);
INSERT INTO `account_group` VALUES (55, 'ส่วนของเจ้าของ', NULL, 3, 13);
INSERT INTO `account_group` VALUES (56, 'เงินคงมือ', NULL, 1, 13);
INSERT INTO `account_group` VALUES (57, 'หนี้รายเดือน', NULL, 2, 13);
INSERT INTO `account_group` VALUES (58, 'รายได้รายเดือน', NULL, 4, 13);
INSERT INTO `account_group` VALUES (59, 'ค่าใช้จ่ายรายเดือน', NULL, 5, 13);
INSERT INTO `account_group` VALUES (60, 'ค่่าใช้จ่ายประจำวัน', NULL, 5, 13);
INSERT INTO `account_group` VALUES (61, 'ลูกหนี้ทั่วไป', NULL, 6, 13);
INSERT INTO `account_group` VALUES (62, 'ธนาคารทั่วไป', NULL, 7, 13);

-- ----------------------------
-- Table structure for account_icon
-- ----------------------------
DROP TABLE IF EXISTS `account_icon`;
CREATE TABLE `account_icon`  (
  `account_icon_id` int NOT NULL,
  `account_icon_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_icon_category` int NULL DEFAULT NULL,
  PRIMARY KEY (`account_icon_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_icon
-- ----------------------------
INSERT INTO `account_icon` VALUES (1, '1738697574598.png', 5);
INSERT INTO `account_icon` VALUES (2, '1738697400316.png', 5);
INSERT INTO `account_icon` VALUES (3, '1738697395707.png', 5);
INSERT INTO `account_icon` VALUES (4, '1738697388747.png', 5);
INSERT INTO `account_icon` VALUES (5, '1738661939639.png', 2);
INSERT INTO `account_icon` VALUES (6, '1738661933643.png', 2);
INSERT INTO `account_icon` VALUES (7, '1738661927854.png', 2);
INSERT INTO `account_icon` VALUES (8, '1738661921515.png', 2);
INSERT INTO `account_icon` VALUES (9, '1738661916449.png', 2);
INSERT INTO `account_icon` VALUES (10, '1738661911239.png', 2);
INSERT INTO `account_icon` VALUES (11, '1738661906637.png', 2);
INSERT INTO `account_icon` VALUES (12, '1738661901939.png', 2);
INSERT INTO `account_icon` VALUES (13, '1738661897275.png', 2);
INSERT INTO `account_icon` VALUES (14, '1738661891753.png', 2);
INSERT INTO `account_icon` VALUES (15, '1738661881718.png', 4);
INSERT INTO `account_icon` VALUES (16, '1738661875575.png', 4);
INSERT INTO `account_icon` VALUES (17, '1738661869351.png', 4);
INSERT INTO `account_icon` VALUES (18, '1738661864488.png', 1);
INSERT INTO `account_icon` VALUES (19, '1738661858457.png', 4);
INSERT INTO `account_icon` VALUES (20, '1738661852932.png', 5);
INSERT INTO `account_icon` VALUES (21, '1738661845971.png', 5);
INSERT INTO `account_icon` VALUES (22, '1738661840804.png', 5);
INSERT INTO `account_icon` VALUES (23, '1738661829820.png', 7);
INSERT INTO `account_icon` VALUES (24, '1738661823154.png', 7);
INSERT INTO `account_icon` VALUES (25, '1738661816352.png', 7);
INSERT INTO `account_icon` VALUES (26, '1738661809085.png', 7);
INSERT INTO `account_icon` VALUES (27, '1738661801861.png', 7);
INSERT INTO `account_icon` VALUES (28, '1738661792290.png', 7);
INSERT INTO `account_icon` VALUES (29, '1738661785863.png', 7);
INSERT INTO `account_icon` VALUES (30, '1738661778577.png', 7);
INSERT INTO `account_icon` VALUES (31, '1738661769893.png', 7);
INSERT INTO `account_icon` VALUES (32, '1738661762446.png', 7);
INSERT INTO `account_icon` VALUES (33, '1738661755097.png', 7);
INSERT INTO `account_icon` VALUES (34, '1738661746289.png', 7);
INSERT INTO `account_icon` VALUES (35, '1738661737430.png', 7);
INSERT INTO `account_icon` VALUES (36, '1738661728391.png', 7);
INSERT INTO `account_icon` VALUES (37, '1738661713820.png', 7);
INSERT INTO `account_icon` VALUES (38, '1738661708178.png', 7);
INSERT INTO `account_icon` VALUES (39, '1738661702835.png', 7);
INSERT INTO `account_icon` VALUES (40, '1738661697078.png', 7);
INSERT INTO `account_icon` VALUES (41, '1738661691697.png', 7);
INSERT INTO `account_icon` VALUES (42, '1738661685845.png', 7);
INSERT INTO `account_icon` VALUES (43, '1738661679769.png', 7);
INSERT INTO `account_icon` VALUES (44, '1738661671837.png', 1);
INSERT INTO `account_icon` VALUES (45, '1738661666457.png', 1);
INSERT INTO `account_icon` VALUES (46, '1738661422907.png', 3);
INSERT INTO `account_icon` VALUES (47, '1738660914049.png', 3);

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
  PRIMARY KEY (`account_transition_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1111 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_transition
-- ----------------------------
INSERT INTO `account_transition` VALUES (1106, 77, NULL, 5000.00, '2025-04-11 05:25:52', 1, 1, NULL, NULL, 77, 77);
INSERT INTO `account_transition` VALUES (1107, 76, NULL, 5000.00, '2025-04-11 05:25:55', 2, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `account_transition` VALUES (1108, 77, 1, 1000.00, '2025-04-11 05:26:56', 2, NULL, 87, 1, 87, 77);
INSERT INTO `account_transition` VALUES (1109, 79, 4, 10000.00, '2025-04-11 05:28:33', 2, NULL, 88, 1, 88, 79);
INSERT INTO `account_transition` VALUES (1110, 80, 5, 80.00, '2025-04-11 05:28:58', 2, NULL, 77, 1, 80, 77);

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
) ENGINE = InnoDB AUTO_INCREMENT = 89 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_type
-- ----------------------------
INSERT INTO `account_type` VALUES (1, 'เงินสด', NULL, '', NULL, '1', 1, 0.00, 1, 1, 0.00);
INSERT INTO `account_type` VALUES (2, 'เงินสด (ตามที่ต่าง ๆ)', NULL, 'เงินเดือน', 5, '1', 1, 0.00, 1, 1, 0.00);
INSERT INTO `account_type` VALUES (3, 'ออมสิน', NULL, NULL, NULL, '1', 1, 0.00, 2, 1, 0.00);
INSERT INTO `account_type` VALUES (4, 'กรุงไทย', NULL, NULL, NULL, '1', 1, 0.00, 2, 1, 0.00);
INSERT INTO `account_type` VALUES (5, 'กรุงศรี - พร้อมเพย์', NULL, 'พร้อมเพย์', NULL, '1', 1, 0.00, 2, 1, 0.00);
INSERT INTO `account_type` VALUES (6, 'สหกรณ์ - ครู', NULL, NULL, NULL, '1', 1, 0.00, 4, 1, 0.00);
INSERT INTO `account_type` VALUES (7, 'สหกรณ์ - มรถ.บร.', NULL, NULL, NULL, '1', 1, 0.00, 4, 1, 0.00);
INSERT INTO `account_type` VALUES (8, 'รถมอไซต์', NULL, NULL, NULL, '1', 0, 0.00, 5, 1, 0.00);
INSERT INTO `account_type` VALUES (9, 'เงินเดือน', NULL, 'เอาน่า', 4, '1', 0, 0.00, 13, 4, 0.00);
INSERT INTO `account_type` VALUES (10, 'Giffarine', NULL, NULL, 1, '1', 0, 0.00, 13, 4, 0.00);
INSERT INTO `account_type` VALUES (11, 'งานวิจัย', NULL, NULL, 1, '1', 0, 0.00, 14, 4, 0.00);
INSERT INTO `account_type` VALUES (12, 'ขายของเก่า', NULL, NULL, NULL, '1', 0, 0.00, 15, 4, 0.00);
INSERT INTO `account_type` VALUES (13, 'เก็บเงินได้', NULL, NULL, NULL, '1', 0, 0.00, 15, 4, 0.00);
INSERT INTO `account_type` VALUES (14, 'ขายของเบ็ตเล็ด', NULL, NULL, NULL, '1', 0, 0.00, 15, 4, 0.00);
INSERT INTO `account_type` VALUES (15, 'อาหาร - โรงอาหาร', NULL, NULL, 4, '1', 0, 0.00, 16, 5, 0.00);
INSERT INTO `account_type` VALUES (16, 'เครื่องดื่ม', NULL, NULL, 5, '1', 0, 0.00, 16, 5, 0.00);
INSERT INTO `account_type` VALUES (17, 'Amazon - ชาเขียว', NULL, NULL, 5, '1', 0, 0.00, 16, 5, 0.00);
INSERT INTO `account_type` VALUES (18, 'ค่าน้ำมัน', NULL, NULL, NULL, '1', 0, 0.00, 17, 5, 0.00);
INSERT INTO `account_type` VALUES (19, 'ค่าโทรศัพท์', NULL, NULL, NULL, '1', 0, 0.00, 17, 5, 0.00);
INSERT INTO `account_type` VALUES (20, 'ค่าอินเทอร์เน็ต', NULL, NULL, NULL, '1', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (21, 'ค่าน้ำ', NULL, NULL, NULL, '1', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (22, 'ค่าไฟ', NULL, NULL, NULL, '1', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (23, 'ที่บ้าน', NULL, NULL, NULL, '1', 0, 0.00, 22, 5, 0.00);
INSERT INTO `account_type` VALUES (24, 'นักศึกษา - ทศ', NULL, NULL, NULL, '1', 0, 0.00, 11, 2, 0.00);
INSERT INTO `account_type` VALUES (25, 'นักศึกษา - เจ', NULL, NULL, NULL, '1', 0, 0.00, 11, 2, 0.00);
INSERT INTO `account_type` VALUES (26, 'นักศึกษา - เนม', NULL, NULL, NULL, '1', 0, 0.00, 10, 2, 0.00);
INSERT INTO `account_type` VALUES (27, 'นักศึกษา - ต้า', NULL, '', NULL, '1', 0, 0.00, 11, 2, 0.00);
INSERT INTO `account_type` VALUES (57, 'ทุน - เบนซ์ ', NULL, NULL, NULL, '1', 0, 0.00, 12, 3, 0.00);
INSERT INTO `account_type` VALUES (61, 'เงินสด', '2000', 'เงินไว้จ่าย', 73, '13', 0, 0.00, 47, 1, 0.00);
INSERT INTO `account_type` VALUES (62, 'จอคอม', '1333', 'จ่ายทุกเดือน', NULL, '19', 0, 0.00, 48, 2, 0.00);
INSERT INTO `account_type` VALUES (63, 'ลูกหนี้มิก', '6250', 'จ่ายยยย', NULL, '8', 0, 0.00, 49, 6, 0.00);
INSERT INTO `account_type` VALUES (64, 'เงินเดือน', '10000', 'พ่อแม่ให้', NULL, '17', 0, 0.00, 50, 4, 0.00);
INSERT INTO `account_type` VALUES (65, 'รายได้จากการสอน', '1000', 'สอนเด็กโว้นยยยยยย', NULL, '16', 0, 0.00, 51, 4, 0.00);
INSERT INTO `account_type` VALUES (66, 'ค่าน้ำ', '80', 'รายเดือน', NULL, '2', 0, 0.00, 52, 5, 0.00);
INSERT INTO `account_type` VALUES (67, 'ค่าไฟ', '350', 'รายเดือน', NULL, '3', 0, 0.00, 52, 5, 0.00);
INSERT INTO `account_type` VALUES (68, 'ค่าบ้าน', '1400', 'รายเดือน', NULL, '4', 0, 0.00, 52, 5, 0.00);
INSERT INTO `account_type` VALUES (69, 'ค่าอาหารเช้า', '30', 'ข้าวเช้า', NULL, '21', 0, 0.00, 53, 5, 0.00);
INSERT INTO `account_type` VALUES (70, 'มะพร้าวปั่นนนน', '35', 'เพิ่มน้ำตาลในเลือด', NULL, '21', 0, 0.00, 53, 5, 0.00);
INSERT INTO `account_type` VALUES (71, 'อาหารกลางวัน', '50', 'ข้าวเที่ยงง', NULL, '22', 0, 0.00, 53, 5, 0.00);
INSERT INTO `account_type` VALUES (72, 'อาหารเย็น', '50', 'อาจจะกินบ้างไม่่กินบ้าง', NULL, '20', 0, 0.00, 53, 5, 0.00);
INSERT INTO `account_type` VALUES (73, 'บัวหลวง', '21000', 'บัญชีหลัก', NULL, '41', 0, 0.00, 54, 7, 0.00);
INSERT INTO `account_type` VALUES (74, 'true money', '5', 'ไว้ใช้สมัครเน็ต', NULL, '25', 0, 0.00, 54, 7, 0.00);
INSERT INTO `account_type` VALUES (75, 'กรุงไทย', '500', 'ธนาคารของมหาลัย', NULL, '31', 0, 0.00, 54, 7, 0.00);
INSERT INTO `account_type` VALUES (76, 'ทุน nem', NULL, NULL, NULL, '1', 0, 5000.00, 55, 3, 5000.00);
INSERT INTO `account_type` VALUES (77, 'เงินสด', '0', NULL, NULL, '44', 0, 5000.00, 56, 1, 3920.00);
INSERT INTO `account_type` VALUES (78, 'เจ้าหนี้สมศรี', '0', NULL, NULL, '8', 0, 0.00, 57, 2, 0.00);
INSERT INTO `account_type` VALUES (79, 'เงินเดือน', '0', NULL, NULL, '17', 0, 0.00, 58, 4, 10000.00);
INSERT INTO `account_type` VALUES (80, 'ค่าน้ำ', '0', NULL, NULL, '2', 0, 0.00, 59, 5, 80.00);
INSERT INTO `account_type` VALUES (81, 'ค่าไฟ', '0', NULL, NULL, '3', 0, 0.00, 59, 5, 0.00);
INSERT INTO `account_type` VALUES (82, 'ค่าบ้าน', '0', NULL, NULL, '4', 0, 0.00, 59, 5, 0.00);
INSERT INTO `account_type` VALUES (83, 'ค่าอาหารเช้า', '0', NULL, NULL, '21', 0, 0.00, 60, 5, 0.00);
INSERT INTO `account_type` VALUES (84, 'อาหารกลางวัน', '0', NULL, NULL, '22', 0, 0.00, 60, 5, 0.00);
INSERT INTO `account_type` VALUES (85, 'อาหารเย็น', '0', NULL, NULL, '20', 0, 0.00, 60, 5, 0.00);
INSERT INTO `account_type` VALUES (87, 'กรุงไทย', '0', NULL, NULL, '31', 0, 0.00, 62, 7, 1000.00);
INSERT INTO `account_type` VALUES (88, 'กรุงเทพ', '0', NULL, NULL, '41', 0, 0.00, 62, 7, 10000.00);

-- ----------------------------
-- Table structure for account_user
-- ----------------------------
DROP TABLE IF EXISTS `account_user`;
CREATE TABLE `account_user`  (
  `account_user_id` int NOT NULL AUTO_INCREMENT,
  `account_user_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `account_user_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `account_user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`account_user_id`) USING BTREE,
  UNIQUE INDEX `account_user_username`(`account_user_username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_user
-- ----------------------------
INSERT INTO `account_user` VALUES (9, 'accout@gmail.com', '$2a$12$.sWGS.KAS66WzrLI96DhBOXSpWh3nP/ywZ.z/NshbXNNA9lG7gdTy', 'admin_');
INSERT INTO `account_user` VALUES (11, 'banz@gmail.com', '$2a$12$Gyf8cLLw0nVt0KsZq.jXj.kyosEniBKabTuvkBwXfO8Elcd2pQihm', 'อจ.บ');
INSERT INTO `account_user` VALUES (12, 'thod@gmail.com', '$2a$12$RK/VliUBegwsv0yxCMrSKeNdaIfyhnJ2v7I8KHQDULKHE.RmXWQ8C', 'ทศนะ');
INSERT INTO `account_user` VALUES (13, 'nem@gmail.com', '$2a$12$6g2qjH2.OMtHag9uzPYRYOnHo.2IsMfrXtHN5I7Qjes3csq6Nem0S', 'nem');

SET FOREIGN_KEY_CHECKS = 1;
