const numberToWords = (num) => {
   const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
   const teens = [
      'mười',
      'mười một',
      'mười hai',
      'mười ba',
      'mười bốn',
      'mười lăm',
      'mười sáu',
      'mười bảy',
      'mười tám',
      'mười chín',
   ];
   const tens = [
      '',
      '',
      'hai mươi',
      'ba mươi',
      'bốn mươi',
      'năm mươi',
      'sáu mươi',
      'bảy mươi',
      'tám mươi',
      'chín mươi',
   ];
   const scales = ['nghìn', 'triệu', 'tỷ'];

   if (num === 0) return 'Không đồng';
   if (num < 0) return `Âm ${numberToWords(-num)}`;

   let words = [];
   let scaleIndex = -1;

   while (num > 0) {
      const chunk = num % 1000;
      if (chunk) {
         let chunkWords = [];
         const hundreds = Math.floor(chunk / 100);
         const remainder = chunk % 100;

         if (hundreds) {
            chunkWords.push(units[hundreds] + ' trăm');
         }

         if (remainder) {
            if (remainder < 10) {
               chunkWords.push(units[remainder]);
            } else if (remainder < 20) {
               chunkWords.push(teens[remainder - 10]);
            } else {
               const tensPlace = Math.floor(remainder / 10);
               const onesPlace = remainder % 10;
               chunkWords.push(tens[tensPlace]);
               if (onesPlace) {
                  chunkWords.push(units[onesPlace]);
               }
            }
         }

         if (scaleIndex >= 0) {
            chunkWords.push(scales[scaleIndex]);
         }

         words.unshift(chunkWords.join(' '));
      }

      num = Math.floor(num / 1000);
      scaleIndex++;
   }

   let result = words.join(' ') + ' đồng';

   // In hoa chữ cái đầu tiên
   return result.charAt(0).toUpperCase() + result.slice(1);
};

export default numberToWords;
