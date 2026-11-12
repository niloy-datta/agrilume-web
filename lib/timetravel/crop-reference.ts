export type CropCategory = "rice" | "rabi" | "vegetable" | "flower" | "fruit" | "cash";

interface CropPhoto {
  src: string;
  source: string;
  artist: string;
  license: string;
}

const photos = {
  rice: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Rice_Field_Crop.jpg/960px-Rice_Field_Crop.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Rice_Field_Crop.jpg",
    artist: "HANUMAN JATAV",
    license: "CC BY-SA 4.0",
  },
  wheat: {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Wheat_Field_with_Barley_Inclusions._-_geograph.org.uk_-_427891.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Wheat_Field_with_Barley_Inclusions._-_geograph.org.uk_-_427891.jpg",
    artist: "Bob Embleton",
    license: "CC BY-SA 2.0",
  },
  maize: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Field%2C_corn%2C_Liechtenstein%2C_Mountains%2C_Alps%2C_Vaduz%2C_sky%2C_clouds%2C_landscape.jpg/960px-Field%2C_corn%2C_Liechtenstein%2C_Mountains%2C_Alps%2C_Vaduz%2C_sky%2C_clouds%2C_landscape.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Field,_corn,_Liechtenstein,_Mountains,_Alps,_Vaduz,_sky,_clouds,_landscape.jpg",
    artist: "Paranoid",
    license: "Public domain",
  },
  potato: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Preparing_field_to_plant_potato_crop_-_geograph.org.uk_-_3417048.jpg/960px-Preparing_field_to_plant_potato_crop_-_geograph.org.uk_-_3417048.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Preparing_field_to_plant_potato_crop_-_geograph.org.uk_-_3417048.jpg",
    artist: "Roger Marris",
    license: "CC BY-SA 2.0",
  },
  sweetPotato: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Sweet_Potato_Ready_for_Harvest.jpg/960px-Sweet_Potato_Ready_for_Harvest.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Sweet_Potato_Ready_for_Harvest.jpg",
    artist: "Nabunje Leticia",
    license: "CC BY-SA 4.0",
  },
  mustard: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/%E0%AE%95%E0%AE%9F%E0%AF%81%E0%AE%95%E0%AF%81%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AF%86%E0%AE%9F%E0%AE%BF_1%28Brassica_juncea%29.jpg/960px-%E0%AE%95%E0%AE%9F%E0%AF%81%E0%AE%95%E0%AF%81%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AF%86%E0%AE%9F%E0%AE%BF_1%28Brassica_juncea%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:%E0%AE%95%E0%AE%9F%E0%AF%81%E0%AE%95%E0%AF%81%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AF%86%E0%AE%9F%E0%AE%BF_1(Brassica_juncea).jpg",
    artist: "Dr.S.Soundarapandian",
    license: "Public domain",
  },
  lentil: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Lens_culinaris_sl13.jpg/960px-Lens_culinaris_sl13.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Lens_culinaris_sl13.jpg",
    artist: "Stefan.lefnaer",
    license: "CC BY-SA 4.0",
  },
  khesari: {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Lathyrus_sativus.png",
    source: "https://commons.wikimedia.org/wiki/File:Lathyrus_sativus.png",
    artist: "William Curtis",
    license: "Public domain",
  },
  chilli: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Plant_Habitat-04_experiment_%28ISS066-E-006170%29_%28cropped%29.jpg/960px-Plant_Habitat-04_experiment_%28ISS066-E-006170%29_%28cropped%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Plant_Habitat-04_experiment_(ISS066-E-006170)_(cropped).jpg",
    artist: "NASA/Megan McArthur",
    license: "Public domain",
  },
  onion: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Allium_cepa_viviparum_003.JPG/960px-Allium_cepa_viviparum_003.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Allium_cepa_viviparum_003.JPG",
    artist: "H. Zell",
    license: "CC BY 3.0",
  },
  bitterGourd: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Bitter_gourd_%28Momordica_charantia%29.jpg/960px-Bitter_gourd_%28Momordica_charantia%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Bitter_gourd_(Momordica_charantia).jpg",
    artist: "Salil Kumar Mukherjee",
    license: "CC BY-SA 4.0",
  },
  okra: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/A_garden_with_okra_plants.jpg/960px-A_garden_with_okra_plants.jpg",
    source: "https://commons.wikimedia.org/wiki/File:A_garden_with_okra_plants.jpg",
    artist: "Kenogenic",
    license: "CC BY-SA 4.0",
  },
  pointedGourd: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Pointed_gourd_%28Trichosanthes_dioica%29_seeds.jpg/960px-Pointed_gourd_%28Trichosanthes_dioica%29_seeds.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Pointed_gourd_(Trichosanthes_dioica)_seeds.jpg",
    artist: "Salil Kumar Mukherjee",
    license: "CC BY-SA 4.0",
  },
  pumpkin: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Field_pumpkin_plant_leaf.jpg/960px-Field_pumpkin_plant_leaf.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Field_pumpkin_plant_leaf.jpg",
    artist: "V. Thamaraiselvi",
    license: "CC BY-SA 4.0",
  },
  bottleGourd: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/%E0%A6%B2%E0%A6%BE%E0%A6%89%E0%A6%B6%E0%A6%BE%E0%A6%95%E0%A7%87%E0%A6%B0_%E0%A6%AA%E0%A7%8B%E0%A6%B8%E0%A7%8D%E0%A6%A4%2C_%E0%A6%95%E0%A6%B2%E0%A6%95%E0%A6%BE%E0%A6%A4%E0%A6%BE.jpg/960px-%E0%A6%B2%E0%A6%BE%E0%A6%89%E0%A6%B6%E0%A6%BE%E0%A6%95%E0%A7%87%E0%A6%B0_%E0%A6%AA%E0%A7%8B%E0%A6%B8%E0%A7%8D%E0%A6%A4%2C_%E0%A6%95%E0%A6%B2%E0%A6%95%E0%A6%BE%E0%A6%A4%E0%A6%BE.jpg",
    source: "https://commons.wikimedia.org/wiki/File:%E0%A6%B2%E0%A6%BE%E0%A6%89%E0%A6%B6%E0%A6%BE%E0%A6%95%E0%A7%87%E0%A6%B0_%E0%A6%AA%E0%A7%8B%E0%A6%B8%E0%A7%8D%E0%A6%A4,%20%E0%A6%95%E0%A6%B2%E0%A6%95%E0%A6%BE%E0%A6%A4%E0%A6%BE.jpg",
    artist: "TenderBlues",
    license: "CC BY-SA 4.0",
  },
  redAmaranth: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Vegetables_amaranth.jpg/960px-Vegetables_amaranth.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Vegetables_amaranth.jpg",
    artist: "Senator BNB",
    license: "CC BY-SA 4.0",
  },
  yardlongBean: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Yard_Long_Bean_Flowers.jpg/960px-Yard_Long_Bean_Flowers.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Yard_Long_Bean_Flowers.jpg",
    artist: "Sanu N",
    license: "CC BY-SA 4.0",
  },
  cabbage: {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Cabbage_and_Sandy_Soil_-_geograph.org.uk_-_216358.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Cabbage_and_Sandy_Soil_-_geograph.org.uk_-_216358.jpg",
    artist: "Tony Atkin",
    license: "CC BY-SA 2.0",
  },
  cauliflower: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Brassica_oleracea_var._botrytis_%28Coliflor%29.jpg/960px-Brassica_oleracea_var._botrytis_%28Coliflor%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Brassica_oleracea_var._botrytis_(Coliflor).jpg",
    artist: "Rjcastillo",
    license: "CC BY-SA 4.0",
  },
  tomato: {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Bountiful_tomato_crop_2_-_geograph.org.uk_-_1531376.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Bountiful_tomato_crop_2_-_geograph.org.uk_-_1531376.jpg",
    artist: "Jonathan Billinger",
    license: "CC BY-SA 2.0",
  },
  radish: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Radish_3371103037_4ab07db0bf_o.jpg/960px-Radish_3371103037_4ab07db0bf_o.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Radish_3371103037_4ab07db0bf_o.jpg",
    artist: "Jengod",
    license: "Public domain",
  },
  carrot: {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Field_of_carrots_-_geograph.org.uk_-_407772.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Field_of_carrots_-_geograph.org.uk_-_407772.jpg",
    artist: "Nigel Jones",
    license: "CC BY-SA 2.0",
  },
  spinach: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Liat_Portal_for_Foodie_Disorder_-_Fresh_spinach_leaves.jpg/960px-Liat_Portal_for_Foodie_Disorder_-_Fresh_spinach_leaves.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Fresh_spinach_leaves.jpg",
    artist: "HaJunkiyada",
    license: "CC BY-SA 4.0",
  },
  peas: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Pea_pod.jpg/960px-Pea_pod.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Pea_pod.jpg",
    artist: "Zmu'az4Z",
    license: "CC BY-SA 4.0",
  },
  hyacinthBean: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Hyacinth_bean_%28Lablab_purpureus%29_flower_and_pods_in_Bangladesh.jpg/960px-Hyacinth_bean_%28Lablab_purpureus%29_flower_and_pods_in_Bangladesh.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Hyacinth_bean_(Lablab_purpureus)_flower_and_pods_in_Bangladesh.jpg",
    artist: "Md. Mahian",
    license: "CC BY-SA 4.0",
  },
  gladiolus: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Gladiolus_dalenii_flower_Ooty_Jul25_A7CR_06187-224_zsp.jpg/960px-Gladiolus_dalenii_flower_Ooty_Jul25_A7CR_06187-224_zsp.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Gladiolus_dalenii_flower_Ooty_Jul25_A7CR_06187-224_zsp.jpg",
    artist: "Timothy A. Gonsalves",
    license: "CC BY-SA 4.0",
  },
  tuberose: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Tuberose_flower.jpg/960px-Tuberose_flower.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Tuberose_flower.jpg",
    artist: "SKsiddhartthan",
    license: "CC BY-SA 4.0",
  },
  rose: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Englische_Rose_-The_Squire-_Raureif-20201107-RM-091853.jpg/960px-Englische_Rose_-The_Squire-_Raureif-20201107-RM-091853.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Englische_Rose_-The_Squire-_Raureif-20201107-RM-091853.jpg",
    artist: "Ermell",
    license: "CC BY-SA 4.0",
  },
  marigold: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Yellow_butterfly_on_Tagetes_lucida.jpg/960px-Yellow_butterfly_on_Tagetes_lucida.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Yellow_butterfly_on_Tagetes_lucida.jpg",
    artist: "Basile Morin",
    license: "CC BY-SA 4.0",
  },
  gerbera: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Gerbera_Daisy_flower_from_North_Macedonia.jpg/960px-Gerbera_Daisy_flower_from_North_Macedonia.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Gerbera_Daisy_flower_from_North_Macedonia.jpg",
    artist: "Делфина",
    license: "CC0",
  },
  chrysanthemum: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Chrysantheme_rot_tautropfen_-20191024-RM-102058.jpg/960px-Chrysantheme_rot_tautropfen_-20191024-RM-102058.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Chrysantheme_rot_tautropfen_-20191024-RM-102058.jpg",
    artist: "Ermell",
    license: "CC BY-SA 4.0",
  },
  calendula: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Zaaddoos_van_een_goudsbloem_%28Calendula_officinalis%29_11-09-2020_%28d.j.b.%29.jpg/960px-Zaaddoos_van_een_goudsbloem_%28Calendula_officinalis%29_11-09-2020_%28d.j.b.%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Zaaddoos_van_een_goudsbloem_(Calendula_officinalis)_11-09-2020_(d.j.b.).jpg",
    artist: "Dominicus Johannes Bergsma",
    license: "CC BY-SA 4.0",
  },
  sunflower: {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/13/Sunflower_crop_-_geograph.org.uk_-_77333.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Sunflower_crop_-_geograph.org.uk_-_77333.jpg",
    artist: "Katy Walters",
    license: "CC BY-SA 2.0",
  },
  mango: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Mangos_-_single_and_halved.jpg/960px-Mangos_-_single_and_halved.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Mangos_-_single_and_halved.jpg",
    artist: "Ivar Leidus",
    license: "CC BY-SA 4.0",
  },
  litchi: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Lychee_Fruit.jpg/960px-Lychee_Fruit.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Lychee_Fruit.jpg",
    artist: "Sanjay Acharya",
    license: "CC BY-SA 4.0",
  },
  jackfruit: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Jackfruit_Flesh.jpg/960px-Jackfruit_Flesh.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Jackfruit_Flesh.jpg",
    artist: "Mullookkaaran",
    license: "CC BY-SA 3.0",
  },
  pineapple: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Pineapple_plant_1.jpg/960px-Pineapple_plant_1.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Pineapple_plant_1.jpg",
    artist: "Chidex02",
    license: "CC BY-SA 4.0",
  },
  watermelon: {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Watermelon_with_raccoon_damage._-_DPLA_-_0df094fd155d2c5b1277c5ce72410f6f.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Watermelon_with_raccoon_damage._-_DPLA_-_0df094fd155d2c5b1277c5ce72410f6f.jpg",
    artist: "Maestrelli, John R",
    license: "Public domain",
  },
  banana: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Fresh_Banana_and_Coconut_Fruit_Stall.jpg/960px-Fresh_Banana_and_Coconut_Fruit_Stall.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Fresh_Banana_and_Coconut_Fruit_Stall.jpg",
    artist: "PAULIX04",
    license: "CC BY-SA 4.0",
  },
  guava: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Guava_tree_with_fruits.jpg/960px-Guava_tree_with_fruits.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Guava_tree_with_fruits.jpg",
    artist: "Medhi jyoti",
    license: "CC BY-SA 4.0",
  },
  papaya: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Carica_papaya_14_7_2012.jpg/960px-Carica_papaya_14_7_2012.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Carica_papaya_14_7_2012.jpg",
    artist: "Joydeep",
    license: "CC BY-SA 3.0",
  },
  jujube: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Ber_%28Hindi-_%E0%A4%AC%E0%A5%87%E0%A4%B0%29_%28433673773%29.jpg/960px-Ber_%28Hindi-_%E0%A4%AC%E0%A5%87%E0%A%B0%29_%28433673773%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Ber_(Hindi-_%E0%A4%AC%E0%A5%87%E0%A4%B0)_(433673773).jpg",
    artist: "Dinesh Valke",
    license: "CC BY-SA 2.0",
  },
  citrus: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Lemon.jpg/960px-Lemon.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Lemon.jpg",
    artist: "André Karwath",
    license: "CC BY-SA 2.5",
  },
  jute: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Jute_Field_Bangladesh_%287749587518%29.jpg/960px-Jute_Field_Bangladesh_%287749587518%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Jute_Field_Bangladesh_(7749587518).jpg",
    artist: "Malcolm Manners",
    license: "CC BY 2.0",
  },
  sugarcane: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Sugarcane_field_of_Kachirapalayam.jpg/960px-Sugarcane_field_of_Kachirapalayam.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Sugarcane_field_of_Kachirapalayam.jpg",
    artist: "Thamizhpparithi Maari",
    license: "CC BY-SA 4.0",
  },
  tea: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Tea_garden_at_Nagri_in_the_Kangra_Valley_of_Himachal_Pradesh%2C_India.jpg/960px-Tea_garden_at_Nagri_in_the_Kangra_Valley_of_Himachal_Pradesh%2C_India.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Tea_garden_at_Nagri_in_the_Kangra_Valley_of_Himachal_Pradesh,_India.jpg",
    artist: "UnpetitproleX",
    license: "CC BY-SA 4.0",
  },
  betelLeaf: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Betel_leaf.jpg/960px-Betel_leaf.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Betel_leaf.jpg",
    artist: "ANBARASU THIRAVIYAM",
    license: "CC BY-SA 4.0",
  },
  mulberry: {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Mulberry_fruit_and_leaves_at_Fulham_Palace_-_geograph.org.uk_-_835697.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Mulberry_fruit_and_leaves_at_Fulham_Palace_-_geograph.org.uk_-_835697.jpg",
    artist: "David Hawgood",
    license: "CC BY-SA 2.0",
  },
  brinjal: {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Solanum.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Solanum.jpg",
    artist: "Yesodhasekar",
    license: "CC BY-SA 4.0",
  },
} satisfies Record<string, CropPhoto>;

export type CropReference = {
  id: string;
  nameEn: string;
  nameBn: string;
  category: CropCategory;
  seasonEn: string;
  seasonBn: string;
  areasEn: string;
  areasBn: string;
  photo: keyof typeof photos;
  photoNoteEn?: string;
  photoNoteBn?: string;
};

export const CROP_REFERENCE_PHOTOS = photos;

export const CROP_REFERENCE: CropReference[] = [
  { id: "aus", nameEn: "Aus rice", nameBn: "আউশ ধান", category: "rice", seasonEn: "Kharif-1 · sow Mar–May; harvest Jul–Aug", seasonBn: "খরিফ-১ · বপন মার্চ–মে; কাটা জুলাই–আগস্ট", areasEn: "Rainfed upland areas across most districts", areasBn: "বেশিরভাগ জেলার বৃষ্টিনির্ভর উঁচু জমি", photo: "rice" },
  { id: "aman", nameEn: "Transplanted Aman rice", nameBn: "রোপা আমন ধান", category: "rice", seasonEn: "Kharif-2 · transplant Jun–Aug; harvest Nov–Dec", seasonBn: "খরিফ-২ · রোপণ জুন–আগস্ট; কাটা নভেম্বর–ডিসেম্বর", areasEn: "Widespread; led by Dinajpur, Naogaon, Bogura and Sherpur", areasBn: "সারাদেশে; দিনাজপুর, নওগাঁ, বগুড়া ও শেরপুরে বেশি", photo: "rice" },
  { id: "boro", nameEn: "Boro rice", nameBn: "বোরো ধান", category: "rice", seasonEn: "Rabi–Kharif-1 · sow Dec–Feb; harvest Apr–May", seasonBn: "রবি–খরিফ-১ · বপন ডিসেম্বর–ফেব্রুয়ারি; কাটা এপ্রিল–মে", areasEn: "Mymensingh, Sunamganj, Naogaon, Netrokona, Bogura, Jashore and Dinajpur", areasBn: "ময়মনসিংহ, সুনামগঞ্জ, নওগাঁ, নেত্রকোণা, বগুড়া, যশোর ও দিনাজপুর", photo: "rice" },
  { id: "wheat", nameEn: "Wheat", nameBn: "গম", category: "rabi", seasonEn: "Rabi · sow Nov; harvest Feb–Mar", seasonBn: "রবি · বপন নভেম্বর; কাটা ফেব্রুয়ারি–মার্চ", areasEn: "Thakurgaon, Panchagarh, Dinajpur, Naogaon, Natore, Rajshahi, Chapainawabganj, Pabna and Faridpur", areasBn: "ঠাকুরগাঁও, পঞ্চগড়, দিনাজপুর, নওগাঁ, নাটোর, রাজশাহী, চাঁপাইনবাবগঞ্জ, পাবনা ও ফরিদপুর", photo: "wheat" },
  { id: "maize", nameEn: "Maize", nameBn: "ভুট্টা", category: "rabi", seasonEn: "Rabi · sow Nov–Dec; harvest Apr–May", seasonBn: "রবি · বপন নভেম্বর–ডিসেম্বর; কাটা এপ্রিল–মে", areasEn: "Rangpur region: Rangpur, Gaibandha, Lalmonirhat, Nilphamari and Kurigram", areasBn: "রংপুর অঞ্চল: রংপুর, গাইবান্ধা, লালমনিরহাট, নীলফামারী ও কুড়িগ্রাম", photo: "maize" },
  { id: "potato", nameEn: "Potato", nameBn: "আলু", category: "rabi", seasonEn: "Rabi · plant Nov; harvest Feb–Mar", seasonBn: "রবি · রোপণ নভেম্বর; তোলা ফেব্রুয়ারি–মার্চ", areasEn: "Rangpur, Dinajpur, Bogura, Joypurhat, Munshiganj and Cumilla", areasBn: "রংপুর, দিনাজপুর, বগুড়া, জয়পুরহাট, মুন্সীগঞ্জ ও কুমিল্লা", photo: "potato" },
  { id: "sweet-potato", nameEn: "Sweet potato", nameBn: "মিষ্টি আলু", category: "rabi", seasonEn: "Rabi · planted in winter", seasonBn: "রবি · শীতকালে রোপণ", areasEn: "Patuakhali and Bhola", areasBn: "পটুয়াখালী ও ভোলা", photo: "sweetPotato" },
  { id: "mustard", nameEn: "Mustard", nameBn: "সরিষা", category: "rabi", seasonEn: "Rabi · sow Oct–Nov; harvest Jan–Feb", seasonBn: "রবি · বপন অক্টোবর–নভেম্বর; কাটা জানুয়ারি–ফেব্রুয়ারি", areasEn: "Widespread; large areas in Faridpur, Tangail, Sirajganj and Pabna", areasBn: "সারাদেশে; ফরিদপুর, টাঙ্গাইল, সিরাজগঞ্জ ও পাবনায় বেশি", photo: "mustard" },
  { id: "lentil", nameEn: "Lentil (masur)", nameBn: "মসুর ডাল", category: "rabi", seasonEn: "Rabi · sow Nov; harvest Feb–Mar", seasonBn: "রবি · বপন নভেম্বর; কাটা ফেব্রুয়ারি–মার্চ", areasEn: "Gangetic delta: Faridpur, Pabna, Rajbari, Kushtia, Meherpur and Jhenaidah", areasBn: "গাঙ্গেয় বদ্বীপ: ফরিদপুর, পাবনা, রাজবাড়ী, কুষ্টিয়া, মেহেরপুর ও ঝিনাইদহ", photo: "lentil" },
  { id: "khesari", nameEn: "Chickling vetch (khesari)", nameBn: "খেসারি", category: "rabi", seasonEn: "Rabi · sow Nov; harvest Feb–Mar", seasonBn: "রবি · বপন নভেম্বর; কাটা ফেব্রুয়ারি–মার্চ", areasEn: "River islands, chars and south-central districts", areasBn: "নদীর চর, দ্বীপ ও মধ্য-দক্ষিণের জেলাগুলো", photo: "khesari", photoNoteEn: "Public-domain botanical illustration", photoNoteBn: "পাবলিক-ডোমেইন উদ্ভিদচিত্র" },
  { id: "mung-bean", nameEn: "Mung bean", nameBn: "মুগ ডাল", category: "rabi", seasonEn: "Sow Feb–Mar", seasonBn: "বপন ফেব্রুয়ারি–মার্চ", areasEn: "Southern coast: Patuakhali, Barguna and Khulna", areasBn: "দক্ষিণ উপকূল: পটুয়াখালী, বরগুনা ও খুলনা", photo: "lentil", photoNoteEn: "Representative pulse photo", photoNoteBn: "ডালের প্রতিনিধিত্বমূলক ছবি" },
  { id: "chilli", nameEn: "Chilli", nameBn: "মরিচ", category: "rabi", seasonEn: "Rabi · sow Nov; harvest Feb–Apr", seasonBn: "রবি · বপন নভেম্বর; কাটা ফেব্রুয়ারি–এপ্রিল", areasEn: "Every district, concentrated in Bogura, Sirajganj and Pabna", areasBn: "সব জেলায়; বগুড়া, সিরাজগঞ্জ ও পাবনায় বেশি", photo: "chilli", photoNoteEn: "Representative plant-growth photo", photoNoteBn: "গাছের প্রতিনিধিত্বমূলক ছবি" },
  { id: "onion", nameEn: "Onion", nameBn: "পেঁয়াজ", category: "rabi", seasonEn: "Rabi · sow Nov–Dec; harvest Mar–Apr", seasonBn: "রবি · বপন নভেম্বর–ডিসেম্বর; কাটা মার্চ–এপ্রিল", areasEn: "Faridpur, Pabna, Rajbari and Meherpur", areasBn: "ফরিদপুর, পাবনা, রাজবাড়ী ও মেহেরপুর", photo: "onion", photoNoteEn: "Related Allium plant reference photo", photoNoteBn: "অ্যালিয়াম গোত্রের উদ্ভিদের প্রতিনিধিত্বমূলক ছবি" },
  { id: "bitter-gourd", nameEn: "Bitter gourd", nameBn: "করলা", category: "vegetable", seasonEn: "Summer · Mar–Sep", seasonBn: "গ্রীষ্ম · মার্চ–সেপ্টেম্বর", areasEn: "Rangpur, Rajshahi/Barind, Keraniganj and river chars", areasBn: "রংপুর, রাজশাহী/বরেন্দ্র, কেরানীগঞ্জ ও নদীর চর", photo: "bitterGourd" },
  { id: "okra", nameEn: "Okra", nameBn: "ঢেঁড়স", category: "vegetable", seasonEn: "Summer and shoulder seasons", seasonBn: "গ্রীষ্ম ও মধ্যবর্তী মৌসুম", areasEn: "Grown widely, including Barind and Rangpur", areasBn: "বরেন্দ্র ও রংপুরসহ বিভিন্ন অঞ্চলে চাষ হয়", photo: "okra" },
  { id: "pointed-gourd", nameEn: "Pointed gourd", nameBn: "পটল", category: "vegetable", seasonEn: "Summer · Mar–Sep", seasonBn: "গ্রীষ্ম · মার্চ–সেপ্টেম্বর", areasEn: "Rangpur region, Rajshahi division, Barind and river chars", areasBn: "রংপুর অঞ্চল, রাজশাহী বিভাগ, বরেন্দ্র ও নদীর চর", photo: "pointedGourd", photoNoteEn: "Seed reference photo", photoNoteBn: "বীজের তথ্যসূত্রের ছবি" },
  { id: "pumpkin", nameEn: "Pumpkin", nameBn: "মিষ্টি কুমড়া", category: "vegetable", seasonEn: "Summer and monsoon vegetables", seasonBn: "গ্রীষ্ম ও বর্ষার সবজি", areasEn: "Rangpur region, Rajshahi division, Barind and river chars", areasBn: "রংপুর অঞ্চল, রাজশাহী বিভাগ, বরেন্দ্র ও নদীর চর", photo: "pumpkin" },
  { id: "bottle-gourd", nameEn: "Bottle gourd", nameBn: "লাউ", category: "vegetable", seasonEn: "Summer · Mar–Sep", seasonBn: "গ্রীষ্ম · মার্চ–সেপ্টেম্বর", areasEn: "Rangpur region, Rajshahi division, Barind and river chars", areasBn: "রংপুর অঞ্চল, রাজশাহী বিভাগ, বরেন্দ্র ও নদীর চর", photo: "bottleGourd" },
  { id: "red-amaranth", nameEn: "Red amaranth", nameBn: "লালশাক", category: "vegetable", seasonEn: "Summer and winter", seasonBn: "গ্রীষ্ম ও শীত", areasEn: "Grown across Bangladesh", areasBn: "বাংলাদেশের বিভিন্ন জেলায় চাষ হয়", photo: "redAmaranth" },
  { id: "yardlong-bean", nameEn: "Yard-long bean", nameBn: "বরবটি", category: "vegetable", seasonEn: "Summer · Mar–Sep", seasonBn: "গ্রীষ্ম · মার্চ–সেপ্টেম্বর", areasEn: "Rangpur region, Rajshahi division, Barind and river chars", areasBn: "রংপুর অঞ্চল, রাজশাহী বিভাগ, বরেন্দ্র ও নদীর চর", photo: "yardlongBean" },
  { id: "brinjal", nameEn: "Brinjal (eggplant)", nameBn: "বেগুন", category: "vegetable", seasonEn: "Both summer and winter", seasonBn: "গ্রীষ্ম ও শীত—দুই মৌসুমে", areasEn: "Grown widely; summer brinjal is also grown in Barind", areasBn: "সারাদেশে; বরেন্দ্র অঞ্চলে গ্রীষ্মকালীন বেগুনও হয়", photo: "brinjal", photoNoteEn: "Related Solanum plant reference photo", photoNoteBn: "সোলানাম গোত্রের উদ্ভিদের প্রতিনিধিত্বমূলক ছবি" },
  { id: "cabbage", nameEn: "Cabbage", nameBn: "বাঁধাকপি", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district; commercial hubs include Bogura, Jashore, Cumilla and Rangpur", areasBn: "সব জেলায়; বাণিজ্যিক কেন্দ্র বগুড়া, যশোর, কুমিল্লা ও রংপুর", photo: "cabbage" },
  { id: "cauliflower", nameEn: "Cauliflower", nameBn: "ফুলকপি", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district; commercial hubs include Bogura, Jashore, Cumilla and Rangpur", areasBn: "সব জেলায়; বাণিজ্যিক কেন্দ্র বগুড়া, যশোর, কুমিল্লা ও রংপুর", photo: "cauliflower" },
  { id: "tomato", nameEn: "Tomato", nameBn: "টমেটো", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district; commercial hubs include Bogura, Jashore, Cumilla and Rangpur", areasBn: "সব জেলায়; বাণিজ্যিক কেন্দ্র বগুড়া, যশোর, কুমিল্লা ও রংপুর", photo: "tomato" },
  { id: "radish", nameEn: "Radish", nameBn: "মুলা", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district", areasBn: "সব জেলায়", photo: "radish" },
  { id: "carrot", nameEn: "Carrot", nameBn: "গাজর", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district", areasBn: "সব জেলায়", photo: "carrot" },
  { id: "spinach", nameEn: "Spinach", nameBn: "পালং শাক", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district", areasBn: "সব জেলায়", photo: "spinach" },
  { id: "peas", nameEn: "Peas", nameBn: "মটরশুঁটি", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district", areasBn: "সব জেলায়", photo: "peas" },
  { id: "hyacinth-bean", nameEn: "Hyacinth bean", nameBn: "শিম", category: "vegetable", seasonEn: "Winter · Nov–Mar", seasonBn: "শীত · নভেম্বর–মার্চ", areasEn: "Every district", areasBn: "সব জেলায়", photo: "hyacinthBean" },
  { id: "gladiolus", nameEn: "Gladiolus", nameBn: "গ্লাডিওলাস", category: "flower", seasonEn: "Plant from Sep; sold mainly Dec–Apr", seasonBn: "সেপ্টেম্বর থেকে রোপণ; বিক্রি মূলত ডিসেম্বর–এপ্রিল", areasEn: "Jhikargacha (Gadkhali, Panisara), Jashore", areasBn: "যশোরের ঝিকরগাছা (গদখালি, পানিসারা)", photo: "gladiolus" },
  { id: "tuberose", nameEn: "Tuberose (rajanigandha)", nameBn: "রজনীগন্ধা", category: "flower", seasonEn: "Plant from Sep; sold mainly Dec–Apr", seasonBn: "সেপ্টেম্বর থেকে রোপণ; বিক্রি মূলত ডিসেম্বর–এপ্রিল", areasEn: "Jhikargacha, Jashore", areasBn: "যশোরের ঝিকরগাছা", photo: "tuberose" },
  { id: "rose", nameEn: "Rose", nameBn: "গোলাপ", category: "flower", seasonEn: "Plant from Sep; peak sales around Valentine's Day", seasonBn: "সেপ্টেম্বর থেকে রোপণ; ভালোবাসা দিবসে বিক্রি বাড়ে", areasEn: "Jhikargacha, with smaller farms in Pirojpur", areasBn: "ঝিকরগাছা; পিরোজপুরে ছোট খামার", photo: "rose" },
  { id: "marigold", nameEn: "Marigold", nameBn: "গাঁদা", category: "flower", seasonEn: "Plant from Sep; sold mainly Dec–Apr", seasonBn: "সেপ্টেম্বর থেকে রোপণ; বিক্রি মূলত ডিসেম্বর–এপ্রিল", areasEn: "Jashore and many other districts", areasBn: "যশোরসহ অনেক জেলা", photo: "marigold" },
  { id: "gerbera", nameEn: "Gerbera", nameBn: "জারবেরা", category: "flower", seasonEn: "Plant from Sep; sold mainly Dec–Apr", seasonBn: "সেপ্টেম্বর থেকে রোপণ; বিক্রি মূলত ডিসেম্বর–এপ্রিল", areasEn: "Jhikargacha, Jashore", areasBn: "যশোরের ঝিকরগাছা", photo: "gerbera" },
  { id: "chrysanthemum", nameEn: "Chrysanthemum", nameBn: "চন্দ্রমল্লিকা", category: "flower", seasonEn: "Smaller seasonal flower crop", seasonBn: "কম পরিসরের মৌসুমি ফুল", areasEn: "Jhikargacha, Jashore", areasBn: "যশোরের ঝিকরগাছা", photo: "chrysanthemum" },
  { id: "calendula", nameEn: "Calendula", nameBn: "ক্যালেন্ডুলা", category: "flower", seasonEn: "Smaller seasonal flower crop", seasonBn: "কম পরিসরের মৌসুমি ফুল", areasEn: "Jhikargacha, Jashore", areasBn: "যশোরের ঝিকরগাছা", photo: "calendula" },
  { id: "sunflower", nameEn: "Sunflower", nameBn: "সূর্যমুখী", category: "flower", seasonEn: "Smaller/newer seasonal flower crop", seasonBn: "নতুন/কম পরিসরের মৌসুমি ফুল", areasEn: "Jhikargacha and newer growing areas", areasBn: "ঝিকরগাছা ও নতুন চাষের এলাকা", photo: "sunflower" },
  { id: "mango", nameEn: "Mango", nameBn: "আম", category: "fruit", seasonEn: "May–Aug", seasonBn: "মে–আগস্ট", areasEn: "Rajshahi, Chapainawabganj, Naogaon, Natore, Dinajpur and the hill districts", areasBn: "রাজশাহী, চাঁপাইনবাবগঞ্জ, নওগাঁ, নাটোর, দিনাজপুর ও পার্বত্য জেলাগুলো", photo: "mango" },
  { id: "litchi", nameEn: "Litchi", nameBn: "লিচু", category: "fruit", seasonEn: "May–Jun", seasonBn: "মে–জুন", areasEn: "Dinajpur, Mymensingh, Jashore, Narayanganj and Chattogram", areasBn: "দিনাজপুর, ময়মনসিংহ, যশোর, নারায়ণগঞ্জ ও চট্টগ্রাম", photo: "litchi" },
  { id: "jackfruit", nameEn: "Jackfruit", nameBn: "কাঁঠাল", category: "fruit", seasonEn: "May–Aug", seasonBn: "মে–আগস্ট", areasEn: "Homesteads countrywide; Madhupur tract (Tangail, Gazipur, Mymensingh)", areasBn: "সারাদেশের বাড়ির আঙিনা; মধুপুর গড় (টাঙ্গাইল, গাজীপুর, ময়মনসিংহ)", photo: "jackfruit" },
  { id: "pineapple", nameEn: "Pineapple", nameBn: "আনারস", category: "fruit", seasonEn: "Jun–Aug", seasonBn: "জুন–আগস্ট", areasEn: "Moulvibazar, Rangamati, Tangail, Khagrachhari and Bandarban", areasBn: "মৌলভীবাজার, রাঙ্গামাটি, টাঙ্গাইল, খাগড়াছড়ি ও বান্দরবান", photo: "pineapple" },
  { id: "watermelon", nameEn: "Watermelon", nameBn: "তরমুজ", category: "fruit", seasonEn: "Mar–Jun", seasonBn: "মার্চ–জুন", areasEn: "Southern coastal districts such as Patuakhali and Barguna", areasBn: "পটুয়াখালী ও বরগুনাসহ দক্ষিণ উপকূলীয় জেলা", photo: "watermelon" },
  { id: "banana", nameEn: "Banana", nameBn: "কলা", category: "fruit", seasonEn: "Year-round", seasonBn: "সারা বছর", areasEn: "Homesteads and farms across the country", areasBn: "সারাদেশের বাড়ির আঙিনা ও খামার", photo: "banana" },
  { id: "guava", nameEn: "Guava", nameBn: "পেয়ারা", category: "fruit", seasonEn: "Year-round", seasonBn: "সারা বছর", areasEn: "Widely grown; Pirojpur and Jhalokathi are well known", areasBn: "সারাদেশে; পিরোজপুর ও ঝালকাঠি পরিচিত", photo: "guava" },
  { id: "papaya", nameEn: "Papaya", nameBn: "পেঁপে", category: "fruit", seasonEn: "Year-round", seasonBn: "সারা বছর", areasEn: "Homesteads and commercial farms countrywide", areasBn: "সারাদেশের বাড়ির আঙিনা ও বাণিজ্যিক খামার", photo: "papaya" },
  { id: "jujube", nameEn: "Jujube (kul)", nameBn: "কুল", category: "fruit", seasonEn: "Dec–Mar", seasonBn: "ডিসেম্বর–মার্চ", areasEn: "Northwest, including Rajshahi and Naogaon, and Savar", areasBn: "রাজশাহী ও নওগাঁসহ উত্তর-পশ্চিম এবং সাভার", photo: "jujube" },
  { id: "citrus", nameEn: "Citrus", nameBn: "লেবুজাতীয় ফল", category: "fruit", seasonEn: "Aug–Dec", seasonBn: "আগস্ট–ডিসেম্বর", areasEn: "Lemons widely grown; oranges in parts of Sylhet and the hill districts", areasBn: "লেবু প্রায় সর্বত্র; সিলেট ও পার্বত্য অঞ্চলের কিছু এলাকায় কমলা", photo: "citrus" },
  { id: "katimon-mango", nameEn: "Katimon mango (off-season)", nameBn: "কাটিমন আম (অসময়ের)", category: "fruit", seasonEn: "Off-season", seasonBn: "অসময়ে", areasEn: "Naogaon (Adalpur area)", areasBn: "নওগাঁ (আদালপুর এলাকা)", photo: "mango" },
  { id: "jute", nameEn: "Jute", nameBn: "পাট", category: "cash", seasonEn: "Sow Mar–May; harvest Jul–Sep", seasonBn: "বপন মার্চ–মে; কাটা জুলাই–সেপ্টেম্বর", areasEn: "Faridpur, Rajbari, Madaripur, Shariatpur, Tangail, Pabna, Kurigram and Gaibandha", areasBn: "ফরিদপুর, রাজবাড়ী, মাদারীপুর, শরীয়তপুর, টাঙ্গাইল, পাবনা, কুড়িগ্রাম ও গাইবান্ধা", photo: "jute" },
  { id: "sugarcane", nameEn: "Sugarcane", nameBn: "আখ", category: "cash", seasonEn: "Plant Feb–Mar; crush Nov–Mar", seasonBn: "রোপণ ফেব্রুয়ারি–মার্চ; মাড়াই নভেম্বর–মার্চ", areasEn: "Rajshahi, Natore and Chuadanga", areasBn: "রাজশাহী, নাটোর ও চুয়াডাঙ্গা", photo: "sugarcane" },
  { id: "tea", nameEn: "Tea", nameBn: "চা", category: "cash", seasonEn: "Plucked Mar–Nov", seasonBn: "পাতা তোলা মার্চ–নভেম্বর", areasEn: "Hills of Moulvibazar, plus Habiganj, Sylhet, Chattogram and Cox's Bazar", areasBn: "মৌলভীবাজারের পাহাড়; এছাড়া হবিগঞ্জ, সিলেট, চট্টগ্রাম ও কক্সবাজার", photo: "tea" },
  { id: "betel-leaf", nameEn: "Betel leaf", nameBn: "পান", category: "cash", seasonEn: "Year-round", seasonBn: "সারা বছর", areasEn: "Barishal, Cox's Bazar, Rajshahi, Moulvibazar and Satkhira", areasBn: "বরিশাল, কক্সবাজার, রাজশাহী, মৌলভীবাজার ও সাতক্ষীরা", photo: "betelLeaf" },
  { id: "mulberry", nameEn: "Mulberry (silk)", nameBn: "তুঁত (রেশম)", category: "cash", seasonEn: "Leaves picked year-round", seasonBn: "সারা বছর পাতা সংগ্রহ", areasEn: "Rajshahi and Chapainawabganj", areasBn: "রাজশাহী ও চাঁপাইনবাবগঞ্জ", photo: "mulberry" },
];

export function getCropPhoto(crop: CropReference): CropPhoto {
  return photos[crop.photo];
}
