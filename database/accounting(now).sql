/*
 Navicat Premium Dump SQL

 Source Server         : Final
 Source Server Type    : MySQL
 Source Server Version : 80100 (8.1.0)
 Source Host           : localhost:3366
 Source Schema         : accounting

 Target Server Type    : MySQL
 Target Server Version : 80100 (8.1.0)
 File Encoding         : 65001

 Date: 16/07/2025 22:59:37
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
-- Table structure for account_closing
-- ----------------------------
DROP TABLE IF EXISTS `account_closing`;
CREATE TABLE `account_closing`  (
  `account_closing_id` int NOT NULL AUTO_INCREMENT,
  `account_user_id` int NULL DEFAULT NULL,
  `account_closing_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `account_closing_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `account_closing_income` float NULL DEFAULT NULL,
  `account_closing_expence` float NULL DEFAULT NULL,
  PRIMARY KEY (`account_closing_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_closing
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 134 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_group
-- ----------------------------
INSERT INTO `account_group` VALUES (63, 'ส่วนของเจ้าของ', NULL, 3, 14);
INSERT INTO `account_group` VALUES (64, 'เงินคงมือ', NULL, 1, 14);
INSERT INTO `account_group` VALUES (65, 'หนี้รายเดือน', NULL, 2, 14);
INSERT INTO `account_group` VALUES (66, 'รายได้รายเดือน', NULL, 4, 14);
INSERT INTO `account_group` VALUES (67, 'ค่าใช้จ่ายรายเดือน', NULL, 5, 14);
INSERT INTO `account_group` VALUES (68, 'ค่่าใช้จ่ายประจำวัน', NULL, 5, 14);
INSERT INTO `account_group` VALUES (69, 'ลูกหนี้ทั่วไป', NULL, 6, 14);
INSERT INTO `account_group` VALUES (70, 'ธนาคารทั่วไป', NULL, 7, 14);
INSERT INTO `account_group` VALUES (71, 'ค่่าใช้จ่ายประจำปี', NULL, 5, 14);
INSERT INTO `account_group` VALUES (96, 'ค่าใช้จ่ายแบบสุ่ม', NULL, 5, 14);
INSERT INTO `account_group` VALUES (97, 'ส่วนของเจ้าของ', NULL, 3, 18);
INSERT INTO `account_group` VALUES (98, 'เงินคงมือ', NULL, 1, 18);
INSERT INTO `account_group` VALUES (99, 'หนี้รายเดือน', NULL, 2, 18);
INSERT INTO `account_group` VALUES (100, 'รายได้รายเดือน', NULL, 4, 18);
INSERT INTO `account_group` VALUES (101, 'ค่าใช้จ่ายรายเดือน', NULL, 5, 18);
INSERT INTO `account_group` VALUES (102, 'ค่่าใช้จ่ายประจำวัน', NULL, 5, 18);
INSERT INTO `account_group` VALUES (103, 'ลูกหนี้ทั่วไป', NULL, 6, 18);
INSERT INTO `account_group` VALUES (104, 'ธนาคารทั่วไป', NULL, 7, 18);
INSERT INTO `account_group` VALUES (105, 'สุ่ม', NULL, 4, 14);
INSERT INTO `account_group` VALUES (106, 'เงินในกระปุก', NULL, 1, 14);
INSERT INTO `account_group` VALUES (107, 'ส่วนของเจ้าของ', NULL, 3, 19);
INSERT INTO `account_group` VALUES (108, 'เงินคงมือ', NULL, 1, 19);
INSERT INTO `account_group` VALUES (109, 'หนี้รายเดือน', NULL, 2, 19);
INSERT INTO `account_group` VALUES (110, 'รายได้รายเดือน', NULL, 4, 19);
INSERT INTO `account_group` VALUES (111, 'ค่าใช้จ่ายรายเดือน', NULL, 5, 19);
INSERT INTO `account_group` VALUES (112, 'ค่่าใช้จ่ายประจำวัน', NULL, 5, 19);
INSERT INTO `account_group` VALUES (113, 'ลูกหนี้ทั่วไป', NULL, 6, 19);
INSERT INTO `account_group` VALUES (114, 'ธนาคารทั่วไป', NULL, 7, 19);
INSERT INTO `account_group` VALUES (115, 'ส่วนของเจ้าของ', NULL, 3, 20);
INSERT INTO `account_group` VALUES (116, 'เงินคงมือ', NULL, 1, 20);
INSERT INTO `account_group` VALUES (118, 'หลัก', NULL, 4, 20);
INSERT INTO `account_group` VALUES (121, 'ลูกหนี้ทั่วไป', NULL, 6, 20);
INSERT INTO `account_group` VALUES (122, 'ธนาคารทั่วไป', NULL, 7, 20);
INSERT INTO `account_group` VALUES (124, 'ระยะยาว', NULL, 1, 20);
INSERT INTO `account_group` VALUES (125, 'สินค้า', NULL, 1, 20);
INSERT INTO `account_group` VALUES (126, 'เจ้าหนี้', NULL, 2, 20);
INSERT INTO `account_group` VALUES (127, 'เสริม', NULL, 4, 20);
INSERT INTO `account_group` VALUES (128, 'อาหาร', NULL, 5, 20);
INSERT INTO `account_group` VALUES (129, 'มอไซต์', NULL, 5, 20);
INSERT INTO `account_group` VALUES (130, 'ค่ารับรอง', NULL, 5, 20);
INSERT INTO `account_group` VALUES (131, 'บันเทิง', NULL, 5, 20);
INSERT INTO `account_group` VALUES (132, 'Giffarine', NULL, 5, 20);
INSERT INTO `account_group` VALUES (133, 'อื่นๆ', NULL, 5, 20);

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
INSERT INTO `account_icon` VALUES (48, '1738661921515.png', 6);

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
) ENGINE = InnoDB AUTO_INCREMENT = 2336 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_transition
-- ----------------------------
INSERT INTO `account_transition` VALUES (2213, 184, NULL, 3440.00, '2025-06-02 15:56:01', 1, 1, NULL, NULL, 184, NULL);
INSERT INTO `account_transition` VALUES (2214, 196, NULL, 770.00, '2025-06-02 15:56:13', 1, 1, NULL, NULL, 196, NULL);
INSERT INTO `account_transition` VALUES (2215, 197, NULL, 968.00, '2025-06-02 15:56:22', 1, 1, NULL, NULL, 197, NULL);
INSERT INTO `account_transition` VALUES (2216, 198, NULL, 13813.00, '2025-06-02 15:56:30', 1, 1, NULL, NULL, 198, NULL);
INSERT INTO `account_transition` VALUES (2217, 200, NULL, 786.00, '2025-06-02 15:56:41', 1, 1, NULL, NULL, 200, NULL);
INSERT INTO `account_transition` VALUES (2218, 223, NULL, 36577.00, '2025-06-02 15:57:02', 1, 1, NULL, NULL, 223, NULL);
INSERT INTO `account_transition` VALUES (2219, 205, NULL, 500.00, '2025-06-02 15:57:17', 1, 1, NULL, NULL, NULL, 205);
INSERT INTO `account_transition` VALUES (2220, 202, NULL, 600000.00, '2025-06-02 15:57:42', 1, 1, NULL, NULL, 202, NULL);
INSERT INTO `account_transition` VALUES (2221, 183, NULL, 655854.00, '2025-06-02 15:58:38', 1, 1, NULL, NULL, NULL, 183);
INSERT INTO `account_transition` VALUES (2222, 218, 5, 440.00, '2025-01-01 15:59:13', 2, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2223, 218, 5, 50.00, '2025-01-03 16:00:09', 3, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2224, 219, 5, 10.00, '2025-01-03 16:00:17', 3, 1, 184, 1, 219, 184);
INSERT INTO `account_transition` VALUES (2225, 224, 5, 40.00, '2025-01-03 16:00:34', 3, 1, 184, 1, 224, 184);
INSERT INTO `account_transition` VALUES (2226, 218, 5, 20.00, '2025-01-04 16:03:05', 4, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2228, 184, 1, 3000.00, '2025-01-05 16:05:19', 5, 1, 203, 6, 203, 184);
INSERT INTO `account_transition` VALUES (2229, 218, 5, 70.00, '2025-01-05 16:05:54', 5, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2230, 224, 5, 30.00, '2025-01-05 16:06:09', 5, 1, 184, 1, 224, 184);
INSERT INTO `account_transition` VALUES (2231, 223, 6, 500.00, '2025-01-06 16:08:16', 6, 1, 184, 1, 184, 223);
INSERT INTO `account_transition` VALUES (2233, 218, 5, 75.00, '2025-01-06 16:09:23', 6, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2234, 224, 5, 100.00, '2025-01-06 16:10:03', 6, 1, 184, 1, 224, 184);
INSERT INTO `account_transition` VALUES (2235, 225, 5, 2423.00, '2025-01-06 16:10:36', 6, 1, 184, 1, 225, 184);
INSERT INTO `account_transition` VALUES (2236, 234, 5, 180.00, '2025-01-06 16:11:17', 6, 1, 184, 1, 234, 184);
INSERT INTO `account_transition` VALUES (2237, 203, 6, 3000.00, '2025-01-07 16:18:35', 7, 1, 184, 1, 184, 203);
INSERT INTO `account_transition` VALUES (2238, 218, 5, 30.00, '2025-01-07 16:19:26', 7, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2239, 221, 5, 100.00, '2025-01-07 16:19:45', 7, 1, 184, 1, 221, 184);
INSERT INTO `account_transition` VALUES (2240, 224, 5, 200.00, '2025-01-07 16:20:40', 7, 1, 184, 1, 224, 184);
INSERT INTO `account_transition` VALUES (2241, 225, 5, 200.00, '2025-01-07 16:20:54', 7, 1, 184, 1, 225, 184);
INSERT INTO `account_transition` VALUES (2242, 223, 6, 2000.00, '2025-06-02 16:25:59', 8, 1, 184, 1, 184, 223);
INSERT INTO `account_transition` VALUES (2243, 218, 5, 160.00, '2025-06-02 16:32:31', 8, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2244, 226, 5, 10.00, '2025-06-02 16:32:38', 8, 1, 184, 1, 226, 184);
INSERT INTO `account_transition` VALUES (2245, 227, 5, 135.00, '2025-06-02 16:33:01', 8, 1, 184, 1, 227, 184);
INSERT INTO `account_transition` VALUES (2246, 228, 5, 85.00, '2025-06-02 16:33:15', 8, 1, 184, 1, 228, 184);
INSERT INTO `account_transition` VALUES (2247, 224, 5, 40.00, '2025-06-02 16:33:23', 8, 1, 184, 1, 224, 184);
INSERT INTO `account_transition` VALUES (2248, 234, 5, 5.00, '2025-06-02 16:33:39', 8, 1, 184, 1, 234, 184);
INSERT INTO `account_transition` VALUES (2250, 208, 4, 1500.00, '2025-06-26 20:59:03', 9, 1, 197, 1, 197, 208);
INSERT INTO `account_transition` VALUES (2251, 210, 4, 15000.00, '2025-06-26 20:59:57', 9, 1, 184, 1, 184, 210);
INSERT INTO `account_transition` VALUES (2252, 212, 4, 5000.00, '2025-06-26 21:00:04', 9, 1, 184, 1, 184, 212);
INSERT INTO `account_transition` VALUES (2253, 218, 5, 120.00, '2025-06-26 21:04:04', 9, 1, 184, 1, 218, 184);
INSERT INTO `account_transition` VALUES (2254, 219, 5, 10.00, '2025-06-26 21:04:07', 9, 1, 184, 1, 219, 184);
INSERT INTO `account_transition` VALUES (2255, 220, 5, 30.00, '2025-06-26 21:04:09', 9, 1, 184, 1, 220, 184);
INSERT INTO `account_transition` VALUES (2258, 222, 5, 2400.00, '2025-06-27 09:11:13', 9, 1, 197, 1, 222, 197);
INSERT INTO `account_transition` VALUES (2259, 209, 4, 120.00, '2025-07-08 21:58:49', 9, 1, 184, 1, 184, 209);
INSERT INTO `account_transition` VALUES (2313, 196, 7, 770.00, '2025-07-11 19:44:58', 10, 1, 184, 1, 184, 196);
INSERT INTO `account_transition` VALUES (2314, 101, NULL, 25731.93, '2025-07-12 15:07:09', 11, 1, NULL, NULL, 101, NULL);
INSERT INTO `account_transition` VALUES (2315, 105, NULL, 15913.39, '2025-07-12 15:08:36', 11, 1, NULL, NULL, 105, NULL);
INSERT INTO `account_transition` VALUES (2316, 106, NULL, 6504.99, '2025-07-12 15:08:46', 11, 1, NULL, NULL, 106, NULL);
INSERT INTO `account_transition` VALUES (2317, 99, NULL, 4260.00, '2025-07-12 15:08:58', 11, 1, NULL, NULL, 99, NULL);
INSERT INTO `account_transition` VALUES (2318, 102, NULL, 20000.00, '2025-07-12 15:09:00', 11, 1, NULL, NULL, 102, NULL);
INSERT INTO `account_transition` VALUES (2319, 103, NULL, 3400.00, '2025-07-12 15:09:02', 11, 1, NULL, NULL, 103, NULL);
INSERT INTO `account_transition` VALUES (2320, 109, NULL, 1000.00, '2025-07-12 15:09:04', 11, 1, NULL, NULL, 109, NULL);
INSERT INTO `account_transition` VALUES (2321, 108, NULL, 4358.75, '2025-07-12 15:09:40', 11, 1, NULL, NULL, NULL, 108);
INSERT INTO `account_transition` VALUES (2322, 89, NULL, 72451.56, '2025-07-12 15:09:45', 11, 1, NULL, NULL, NULL, 89);
INSERT INTO `account_transition` VALUES (2323, 95, 5, 1750.00, '2025-07-12 15:11:17', 12, 1, 101, 1, 95, 101);
INSERT INTO `account_transition` VALUES (2324, 92, 4, 10000.00, '2025-07-12 15:11:44', 13, 1, 101, 1, 101, 92);
INSERT INTO `account_transition` VALUES (2327, 93, 5, 1000.93, '2025-07-12 15:12:41', 14, 1, 101, 1, 93, 101);
INSERT INTO `account_transition` VALUES (2330, 97, 5, 60.00, '2025-07-12 15:23:17', 15, 1, 101, 1, 97, 101);
INSERT INTO `account_transition` VALUES (2331, 104, 4, 6000.00, '2025-07-12 15:23:50', 16, 1, 101, 1, 101, 104);
INSERT INTO `account_transition` VALUES (2332, 101, 1, 1000.50, '2025-07-12 15:27:53', 17, 1, 109, 6, 109, 101);
INSERT INTO `account_transition` VALUES (2334, 93, 5, 20000.00, '2025-07-12 15:30:47', 18, 1, 101, 1, 93, 101);

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
) ENGINE = InnoDB AUTO_INCREMENT = 235 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_type
-- ----------------------------
INSERT INTO `account_type` VALUES (89, 'ทุน nem', NULL, NULL, NULL, '1', 0, 72451.56, 63, 3, 72451.56);
INSERT INTO `account_type` VALUES (90, 'เงินสด', '1000', 'เงินสด', NULL, '44', 0, 0.00, 64, 1, 0.00);
INSERT INTO `account_type` VALUES (92, 'เงินเดือน', '10000', 'เงินเดือน', 101, '17', 0, 10000.00, 66, 4, 10000.00);
INSERT INTO `account_type` VALUES (93, 'ค่าน้ำ', '0', NULL, NULL, '2', 0, 21000.93, 67, 5, 21000.93);
INSERT INTO `account_type` VALUES (94, 'ค่าไฟ', '0', NULL, NULL, '3', 0, 0.00, 67, 5, 0.00);
INSERT INTO `account_type` VALUES (95, 'ค่าบ้าน', '0', NULL, NULL, '4', 0, 1750.00, 67, 5, 1750.00);
INSERT INTO `account_type` VALUES (96, 'ค่าอาหารเช้า', '0', NULL, NULL, '21', 0, 0.00, 68, 5, 0.00);
INSERT INTO `account_type` VALUES (97, 'อาหารกลางวัน', '0', NULL, NULL, '22', 0, 60.00, 68, 5, 60.00);
INSERT INTO `account_type` VALUES (98, 'อาหารเย็น', '0', NULL, NULL, '20', 0, 0.00, 68, 5, 0.00);
INSERT INTO `account_type` VALUES (99, 'ลูกหนี้มิก', '4260', 'ต้องคืน', 101, '8', 0, 4260.00, 69, 6, 4260.00);
INSERT INTO `account_type` VALUES (100, 'กรุงไทย', '0', NULL, NULL, '31', 0, 0.00, 70, 7, 0.00);
INSERT INTO `account_type` VALUES (101, 'กรุงเทพ', '14563', 'บช หลัก', NULL, '41', 0, 17920.50, 70, 7, 17920.50);
INSERT INTO `account_type` VALUES (102, 'ลูกหนี้แม่', '20000', 'อยากได้มาก', 90, '48', 0, 20000.00, 69, 6, 20000.00);
INSERT INTO `account_type` VALUES (103, 'ลูกหนี้พี่ชาย', '3400', 'อยากได้มาก', 101, '48', 0, 3400.00, 69, 6, 3400.00);
INSERT INTO `account_type` VALUES (104, 'รายได้จากการเขียนโปรแกรม', '1000', 'รายได่เสริม', 101, '19', 0, 6000.00, 66, 4, 6000.00);
INSERT INTO `account_type` VALUES (105, 'Dime', '2000', 'เงินลงทุน', NULL, '32', 0, 15913.39, 70, 7, 15913.39);
INSERT INTO `account_type` VALUES (106, 'B-innotech', '6000', 'เงินลงทุน', NULL, '41', 0, 6504.99, 70, 7, 6504.99);
INSERT INTO `account_type` VALUES (107, 'บัตรบัวหลวง', '599', 'ค่าบัตร', 101, '3', 0, 0.00, 71, 5, 0.00);
INSERT INTO `account_type` VALUES (108, 'S-paylater', '8323', 'ผ่อนโทรศัพท์', 101, '13', 0, 4358.75, 65, 2, 4358.75);
INSERT INTO `account_type` VALUES (109, 'ลูกหนี้ตูน', '1000', 'ยืมมม', 101, '48', 0, 2000.50, 69, 6, 2000.50);
INSERT INTO `account_type` VALUES (123, 'ค่าเน็ต', '110', 'จ่ายค่าเน็ตทุกเดือน', 101, '1', 0, 0.00, 67, 5, 0.00);
INSERT INTO `account_type` VALUES (150, 'true money', '100', 'ไว้ใช้สมัครเน็ต', NULL, '25', 0, 0.00, 70, 7, 0.00);
INSERT INTO `account_type` VALUES (151, 'เน็ต 9 บาท 1 วัน', '9', 'เน็ต 1 วัน', 150, '1', 0, 0.00, 68, 5, 0.00);
INSERT INTO `account_type` VALUES (152, 'ค่าไฟบ้านแม่', '0', 'จ่ายแม่ทุกเดือน', 150, '3', 0, 0.00, 67, 5, 0.00);
INSERT INTO `account_type` VALUES (153, 'ค่าไฟบ้านป้า', '0', 'จ่ายทุกเดือน', 150, '3', 0, 0.00, 67, 5, 0.00);
INSERT INTO `account_type` VALUES (154, 'ค่าน้ำมัน', '200', 'ปกติก็เติมประมาณนี้', 101, '2', 0, 0.00, 96, 5, 0.00);
INSERT INTO `account_type` VALUES (155, 'ทุน thod', NULL, NULL, NULL, '1', 0, 0.00, 97, 3, 0.00);
INSERT INTO `account_type` VALUES (156, 'เงินสด', '0', NULL, NULL, '44', 0, 0.00, 98, 1, 0.00);
INSERT INTO `account_type` VALUES (157, 'เจ้าหนี้สมศรี', '0', NULL, NULL, '8', 0, 0.00, 99, 2, 0.00);
INSERT INTO `account_type` VALUES (158, 'เงินเดือน', '0', NULL, NULL, '17', 0, 0.00, 100, 4, 0.00);
INSERT INTO `account_type` VALUES (159, 'ค่าน้ำ', '0', NULL, NULL, '2', 0, 0.00, 101, 5, 0.00);
INSERT INTO `account_type` VALUES (160, 'ค่าไฟ', '0', NULL, NULL, '3', 0, 0.00, 101, 5, 0.00);
INSERT INTO `account_type` VALUES (161, 'ค่าบ้าน', '0', NULL, NULL, '4', 0, 0.00, 101, 5, 0.00);
INSERT INTO `account_type` VALUES (162, 'ค่าอาหารเช้า', '0', NULL, NULL, '21', 0, 0.00, 102, 5, 0.00);
INSERT INTO `account_type` VALUES (163, 'อาหารกลางวัน', '0', NULL, NULL, '22', 0, 0.00, 102, 5, 0.00);
INSERT INTO `account_type` VALUES (164, 'อาหารเย็น', '0', NULL, NULL, '20', 0, 0.00, 102, 5, 0.00);
INSERT INTO `account_type` VALUES (165, 'ลูกหนี้สมชาย', '0', NULL, NULL, '8', 0, 0.00, 103, 6, 0.00);
INSERT INTO `account_type` VALUES (166, 'กรุงไทย', '0', NULL, NULL, '31', 0, 0.00, 104, 7, 0.00);
INSERT INTO `account_type` VALUES (167, 'กรุงเทพ', '0', NULL, NULL, '41', 0, 0.00, 104, 7, 0.00);
INSERT INTO `account_type` VALUES (168, 'เพื่อนโอนค่าแอร์', '10', 'ค่าแอร์', 100, '19', 0, 0.00, 105, 4, 0.00);
INSERT INTO `account_type` VALUES (169, 'น้ำเปล่า', '14', 'น้ำ', NULL, '21', 0, 0.00, 68, 5, 0.00);
INSERT INTO `account_type` VALUES (170, 'ทุน Jin', NULL, NULL, NULL, '1', 0, 0.00, 107, 3, 0.00);
INSERT INTO `account_type` VALUES (171, 'เงินสด', '0', NULL, NULL, '44', 0, 0.00, 108, 1, 0.00);
INSERT INTO `account_type` VALUES (172, 'เจ้าหนี้สมศรี', '0', NULL, NULL, '8', 0, 0.00, 109, 2, 0.00);
INSERT INTO `account_type` VALUES (173, 'เงินเดือน', '0', NULL, NULL, '17', 0, 0.00, 110, 4, 0.00);
INSERT INTO `account_type` VALUES (174, 'ค่าน้ำ', '0', NULL, NULL, '2', 0, 0.00, 111, 5, 0.00);
INSERT INTO `account_type` VALUES (175, 'ค่าไฟ', '0', NULL, NULL, '3', 0, 0.00, 111, 5, 0.00);
INSERT INTO `account_type` VALUES (176, 'ค่าบ้าน', '0', NULL, NULL, '4', 0, 0.00, 111, 5, 0.00);
INSERT INTO `account_type` VALUES (177, 'ค่าอาหารเช้า', '0', NULL, NULL, '21', 0, 0.00, 112, 5, 0.00);
INSERT INTO `account_type` VALUES (178, 'อาหารกลางวัน', '0', NULL, NULL, '22', 0, 0.00, 112, 5, 0.00);
INSERT INTO `account_type` VALUES (179, 'อาหารเย็น', '0', NULL, NULL, '20', 0, 0.00, 112, 5, 0.00);
INSERT INTO `account_type` VALUES (180, 'ลูกหนี้สมชาย', '0', NULL, NULL, '8', 0, 0.00, 113, 6, 0.00);
INSERT INTO `account_type` VALUES (181, 'กรุงไทย', '0', NULL, NULL, '31', 0, 0.00, 114, 7, 0.00);
INSERT INTO `account_type` VALUES (182, 'กรุงเทพ', '0', NULL, NULL, '41', 0, 0.00, 114, 7, 0.00);
INSERT INTO `account_type` VALUES (183, 'ทุน benz', NULL, NULL, NULL, '1', 0, 655854.00, 115, 3, 655854.00);
INSERT INTO `account_type` VALUES (184, 'เงินสด', '0', NULL, NULL, '44', 0, 22267.00, 116, 1, 22267.00);
INSERT INTO `account_type` VALUES (193, 'แม่', '0', NULL, NULL, '8', 0, 0.00, 121, 6, 0.00);
INSERT INTO `account_type` VALUES (196, 'ส่วนตัว', '3440', 'บัญชีหลัก', NULL, '25', 0, 0.00, 122, 7, 0.00);
INSERT INTO `account_type` VALUES (197, 'กรุงไทย', '968', 'บช.กรุงไทย', NULL, '31', 0, 68.00, 122, 7, 68.00);
INSERT INTO `account_type` VALUES (198, 'กรุงศรี', '13813', 'บช.กรุงศรี', NULL, '42', 0, 13813.00, 122, 7, 13813.00);
INSERT INTO `account_type` VALUES (199, 'ชมรม BRU', '0', 'เงินในชมรม', NULL, '26', 0, 0.00, 122, 7, 0.00);
INSERT INTO `account_type` VALUES (200, 'สหกรณ์', '786', 'เงินสหกรณ์', NULL, '38', 0, 786.00, 122, 7, 786.00);
INSERT INTO `account_type` VALUES (202, 'หุ้น', '600000', 'หุ้น', NULL, '18', 0, 600000.00, 124, 1, 600000.00);
INSERT INTO `account_type` VALUES (203, 'ไอ้ข้าว', '0', 'gif', NULL, '48', 0, 0.00, 121, 6, 0.00);
INSERT INTO `account_type` VALUES (204, 'ลูกหนี้ศูนย์', '36577', 'ยอดยกมา', NULL, '48', 0, 0.00, 121, 6, 0.00);
INSERT INTO `account_type` VALUES (205, 'แม่', '0', 'ติดแม่', NULL, '13', 0, 500.00, 126, 2, 500.00);
INSERT INTO `account_type` VALUES (206, 'ชมรม', '0', 'ชมรม Bru', NULL, '10', 0, 0.00, 126, 2, 0.00);
INSERT INTO `account_type` VALUES (207, 'สาขา', '0', 'หนี้สาขา', NULL, '6', 0, 0.00, 126, 2, 0.00);
INSERT INTO `account_type` VALUES (208, 'giffarine', '0', 'เงิน giffarine', NULL, '17', 0, 1500.00, 118, 4, 1500.00);
INSERT INTO `account_type` VALUES (209, 'work', '0', 'work', NULL, '17', 0, 120.00, 118, 4, 120.00);
INSERT INTO `account_type` VALUES (210, 'Home', '0', 'Home', NULL, '19', 0, 15000.00, 127, 4, 15000.00);
INSERT INTO `account_type` VALUES (211, 'Freelance', '0', 'Freelance', NULL, '16', 0, 0.00, 127, 4, 0.00);
INSERT INTO `account_type` VALUES (212, 'Sale', '0', 'Sale', NULL, '15', 0, 5000.00, 127, 4, 5000.00);
INSERT INTO `account_type` VALUES (213, 'รับรอง', '0', 'รับรอง', NULL, '17', 0, 0.00, 127, 4, 0.00);
INSERT INTO `account_type` VALUES (214, 'สินค้า', '0', 'สินค้า', NULL, '19', 0, 0.00, 127, 4, 0.00);
INSERT INTO `account_type` VALUES (215, 'ส่วนลดรับ', '0', 'ส่วนลดรับ', NULL, '16', 0, 0.00, 127, 4, 0.00);
INSERT INTO `account_type` VALUES (216, 'หายได้รับคืน', '0', 'หายได้รับคืน', NULL, '17', 0, 0.00, 127, 4, 0.00);
INSERT INTO `account_type` VALUES (217, 'etc.', '0', 'etc.', NULL, '16', 0, 0.00, 127, 4, 0.00);
INSERT INTO `account_type` VALUES (218, 'กิน', '120', 'ข้าว', 184, '22', 0, 965.00, 128, 5, 965.00);
INSERT INTO `account_type` VALUES (219, 'ดื่ม', '10', 'น้ำ', NULL, '2', 0, 20.00, 128, 5, 20.00);
INSERT INTO `account_type` VALUES (220, 'เล่น', '30', 'ไว้ใช้เล่น', 184, '21', 0, 30.00, 128, 5, 30.00);
INSERT INTO `account_type` VALUES (221, 'น้ำมัน', '100', 'ค่าน้ำมัน', NULL, '2', 0, 100.00, 129, 5, 100.00);
INSERT INTO `account_type` VALUES (222, 'ซ่อม', '', 'ซ่อมมอไซต์', NULL, '3', 0, 2400.00, 129, 5, 2400.00);
INSERT INTO `account_type` VALUES (223, 'ยกยอดมา', '36577', 'ยกยอดมา', NULL, '48', 0, 34077.00, 121, 6, 34077.00);
INSERT INTO `account_type` VALUES (224, 'นักศึกษา', '40', 'เลี้ยงนักศึกษา', 184, '22', 0, 410.00, 130, 5, 410.00);
INSERT INTO `account_type` VALUES (225, 'อื่นๆ', '2123', 'อย่างอื่น', 184, '3', 0, 2623.00, 130, 5, 2623.00);
INSERT INTO `account_type` VALUES (226, 'cartoon', '10', 'ค่าดูการ์ตูน', 184, '3', 0, 10.00, 131, 5, 10.00);
INSERT INTO `account_type` VALUES (227, 'ทั่วไป', '135', 'ค่ากิฟฟารีน', 184, '3', 0, 135.00, 132, 5, 135.00);
INSERT INTO `account_type` VALUES (228, 'ครอบครัว', '85', 'ครอบครัว', 184, '4', 0, 85.00, 130, 5, 85.00);
INSERT INTO `account_type` VALUES (229, 'หาย', '', 'เงินหาย', 184, '3', 0, 0.00, 133, 5, 0.00);
INSERT INTO `account_type` VALUES (230, 'ธุรกิจ', '96', 'รับรองธุรกิจ', 184, '4', 0, 0.00, 130, 5, 0.00);
INSERT INTO `account_type` VALUES (231, 'สำอาง', '2079', 'สำอาง', 184, '2', 0, 0.00, 132, 5, 0.00);
INSERT INTO `account_type` VALUES (232, 'เสริม', '420', 'เสริมมม', 184, '3', 0, 0.00, 132, 5, 0.00);
INSERT INTO `account_type` VALUES (233, 'ทั่วไป', '75', 'giffarine ทั่วไป', 184, '3', 0, 0.00, 132, 5, 0.00);
INSERT INTO `account_type` VALUES (234, 'อื่นๆ ของ อื่นๆ', '180', 'อื่นๆ', 184, '3', 0, 185.00, 133, 5, 185.00);

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
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_user
-- ----------------------------
INSERT INTO `account_user` VALUES (9, 'accout@gmail.com', '$2a$12$.sWGS.KAS66WzrLI96DhBOXSpWh3nP/ywZ.z/NshbXNNA9lG7gdTy', 'admin_');
INSERT INTO `account_user` VALUES (14, 'nem@gmail.com', '$2a$12$IATDD68l635ZzW2o8mPKv.aIZDRx3IJvwNqrIqZvAIg9lSo7JkYZW', 'nem');
INSERT INTO `account_user` VALUES (18, 'thod@gmail.com', '$2a$12$tY4.62tRsfJAOe6Ym6yaMOJSMRnUZuUfj/c44z6ajITIWTAITcmjm', 'thod');
INSERT INTO `account_user` VALUES (19, 'jin@gmail.com', '$2a$12$YugW4mRrq58iL9MeCP5QSO6aLUffKEX5dh0I5IMQz6na0l6T7wywy', 'Jin');
INSERT INTO `account_user` VALUES (20, 'benz@gmail.com', '$2a$12$lO51aXTot6l2YvjYVmXBsO/TMjUWClRQEcR9RqSSORu7owmh2r3yK', 'benz');

SET FOREIGN_KEY_CHECKS = 1;
