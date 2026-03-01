const brandOptions: { label: string; count: number; checked?: boolean }[] = [
  { label: "Apple", count: 181 },
  { label: "Samsung", count: 178 },
  { label: "Google", count: 123 },
  { label: "Nothing", count: 15 },
  { label: "OPPO", count: 97 },
  { label: "Xiamo", count: 73 },
  { label: "Huawei", count: 34 },
  { label: "Poco", count: 87 },
  { label: "Sony", count: 41 },
];

const ramOptions: { label: string; count: number; checked?: boolean }[] = [
  { label: "4 GB", count: 89 },
  { label: "6 GB", count: 156 },
  { label: "8 GB", count: 234 },
  { label: "12 GB", count: 198 },
  { label: "16 GB", count: 127 },
  { label: "18 GB", count: 45 },
  { label: "24 GB", count: 12 },
];

const storageOptions: { label: string; count: number; checked?: boolean }[] = [
  { label: "64 GB", count: 67 },
  { label: "128 GB", count: 203 },
  { label: "256 GB", count: 289 },
  { label: "512 GB", count: 176 },
  { label: "1 TB", count: 98 },
  { label: "2 TB", count: 23 },
];

const batteryOptions: { label: string; count: number; checked?: boolean }[] = [
  { label: "3000-3999 mAh", count: 54 },
  { label: "4000-4499 mAh", count: 143 },
  { label: "4500-4999 mAh", count: 187 },
  { label: "5000-5499 mAh", count: 234 },
  { label: "5500-5999 mAh", count: 89 },
  { label: "6000+ mAh", count: 32 },
];

const cpuOptions: { label: string; count: number; checked?: boolean }[] = [
  { label: "Snapdragon 8 Gen 3", count: 78 },
  { label: "Snapdragon 8 Gen 2", count: 112 },
  { label: "Apple A17 Pro", count: 45 },
  { label: "Apple A16 Bionic", count: 67 },
  { label: "MediaTek Dimensity 9300", count: 56 },
  { label: "Google Tensor G3", count: 34 },
  { label: "Exynos 2400", count: 43 },
  { label: "Snapdragon 7 Gen 3", count: 89 },
];

const filterItems = [
  { value: "brands", trigger: "Brands", options: brandOptions },
  { value: "ram", trigger: "RAM", options: ramOptions },
  { value: "storage", trigger: "Storage size", options: storageOptions },
  { value: "battery", trigger: "Battery capacity", options: batteryOptions },
  { value: "cpu", trigger: "CPU", options: cpuOptions },
];

export { filterItems, cpuOptions, storageOptions, batteryOptions, brandOptions, ramOptions };
