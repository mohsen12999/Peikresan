export const ProductCount = (count: number, soldByWeight: boolean, minWeight: number)=>
soldByWeight
        ? count * minWeight < 1000
          ? count * minWeight + " گرم"
          : (count * minWeight) / 1000.0 + " کیلوگرم"
        : count;