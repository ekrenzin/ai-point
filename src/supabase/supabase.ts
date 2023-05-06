import { createClient } from "@supabase/supabase-js";
import { Image } from "../bots/images/ImageTypes";

const supabaseUrl = "https://jlkkzxybzwmsagtwacgh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "MISSING KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

async function storeImageUrls(images: Image[]) {
  const { error } = await supabase.from("category_images").insert(images).select();
  if (error) {
    console.error(error);
    return;
  }
}

async function getImageUrls(category: string): Promise<Image[]> {
  const { data, error } = await supabase
    .from("category_images")
    .select("*")
    .eq("category", category);
  if (error) {
    console.error(error);
    return [];
  }
  const images = data as { url: string }[];
  if (images.length === 0) {
    return [];
  }
  const formattedImages = images.map((image) => {
    return { url: image.url, category: category };
  });
  return formattedImages;
}

export { supabase, storeImageUrls, getImageUrls };
