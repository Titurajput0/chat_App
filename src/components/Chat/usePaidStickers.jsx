import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

export default function usePaidStickers() {
  const [giftImages, setGiftImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const convertGoogleDriveUrl = (url) => {
    const regex = /\/file\/d\/(.+?)\/view/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  useEffect(() => {
    const db = getDatabase();
    const giftRef = ref(db, "GiftImage");

    const unsubscribe = onValue(giftRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let stickers = [];

        // अब हर entry को object के रूप में push करेंगे
        stickers = Object.values(data).map(item => ({
          ...item,
          imageUrl: convertGoogleDriveUrl(item.imageUrl) // सिर्फ imageUrl convert
        }));

        setGiftImages(stickers);
      } else {
        setGiftImages([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { giftImages, loading };
}