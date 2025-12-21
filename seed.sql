-- Seed data for shopping list app

-- Insert stores
INSERT IGNORE INTO stores (name, code, createdAt, updatedAt) VALUES
('Rewe', 'REWE', NOW(), NOW()),
('Aldi', 'ALDI', NOW(), NOW()),
('Lidl', 'LIDL', NOW(), NOW()),
('Penny', 'PENNY', NOW(), NOW()),
('DM', 'DM', NOW(), NOW()),
('Karadag', 'KARADAG', NOW(), NOW());

-- Insert categories
INSERT IGNORE INTO categories (name, createdAt, updatedAt) VALUES
('Dairy', NOW(), NOW()),
('Meat', NOW(), NOW()),
('Vegetables', NOW(), NOW()),
('Fruits', NOW(), NOW()),
('Household', NOW(), NOW()),
('Beverages', NOW(), NOW()),
('Bakery', NOW(), NOW()),
('Snacks', NOW(), NOW());
